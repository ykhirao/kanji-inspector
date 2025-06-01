// JSONで扱える基本的な型とTypeScriptの特殊型
type PropertyType = 
  // プリミティブ型
  | 'string' 
  | 'number' 
  | 'boolean' 
  | 'any'         // null, undefined用
  // 配列型
  | 'string[]'
  | 'number[]' 
  | 'boolean[]'
  | 'any[]'
  // カスタム型名、ユニオン型、ネスト配列型（'UserType', 'number | string', 'number[][]' など）
  | string;

type TypeProperty = {
  name: string;
  type: PropertyType;
  optional: boolean;
};

type TypeGenOptions = {
  rootTypeName?: string;
  indentSize?: number;
  arrayElementTypeName?: string;
};

type DeepTypeProperty = {
  type: PropertyType;
  optional?: boolean;
  children?: Record<string, DeepTypeProperty>;
};

class TypeGen {
  private readonly rootTypeName: string;
  private readonly indentSize: number;
  private readonly indent: string;
  private readonly arrayElementTypeName: string;
  private generatedTypes: Map<string, string>;

  constructor(options: TypeGenOptions = {}) {
    this.rootTypeName = options.rootTypeName ?? 'RootType';
    this.indentSize = options.indentSize ?? 2;
    this.arrayElementTypeName = options.arrayElementTypeName ?? 'ContentType';
    this.indent = ' '.repeat(this.indentSize);
    this.generatedTypes = new Map();
  }

  /**
   * プロパティ名から型名を生成します
   */
  private getTypeNameFromProperty(propertyName: string): string {
    const capitalized = propertyName.charAt(0).toUpperCase() + propertyName.slice(1);
    return `${capitalized}Type`;
  }

  /**
   * 配列要素の型名を生成します
   */
  private getArrayElementTypeName(): string {
    return this.arrayElementTypeName;
  }

  /**
   * 値の型を判定します
   */
  private getPropertyType(value: any, propertyName?: string): PropertyType {
    if (value === null || value === undefined) {
      return 'any';
    }
    if (Array.isArray(value)) {
      if (value.length === 0) return 'any[]';
      
      // 配列内のすべての要素がオブジェクトかどうかチェック
      const allObjectElements = value.every(v => typeof v === 'object' && v !== null && !Array.isArray(v));
      
      if (allObjectElements && propertyName) {
        // すべての要素がオブジェクトの場合、共通プロパティから型を生成
        const elementTypeName = this.arrayElementTypeName;
        const commonProps = this.extractCommonProperties(value);
        const typeDefinition = this.generateTypeDefinition(commonProps, elementTypeName);
        this.generatedTypes.set(elementTypeName, typeDefinition);
        return `${elementTypeName}[]` as PropertyType;
      } else {
        // 従来の方法：要素の型をすべて調べる
        const elementTypes = Array.from(new Set(value.map(v => this.getPropertyType(v))));
        if (elementTypes.length === 1) {
          const baseType = elementTypes[0];
          return `${baseType}[]` as PropertyType;
        } else {
          return 'any[]';
        }
      }
    }
    if (typeof value === 'object') {
      if (propertyName) {
        const typeName = this.getTypeNameFromProperty(propertyName);
        const typeDefinition = this.generateTypeDefinition(this.extractProperties(value), typeName);
        this.generatedTypes.set(typeName, typeDefinition);
        return typeName as PropertyType;
      }
      // プロパティ名がない場合は汎用的な型名を生成
      return 'any'; // プロパティ名なしの場合はanyとして扱う
    }
    return typeof value as PropertyType;
  }

  /**
   * オブジェクトからプロパティの型情報を抽出します
   */
  private extractProperties(obj: Record<string, any>): TypeProperty[] {
    return Object.entries(obj).map(([name, value]) => ({
      name,
      type: this.getPropertyType(value, name),
      optional: false
    }));
  }

  /**
   * 配列から共通のプロパティを抽出し、オプショナルなプロパティを特定します
   */
  private extractCommonProperties(array: Record<string, any>[]): TypeProperty[] {
    const allProperties = new Map<string, Set<string>>();
    
    // すべてのオブジェクトのプロパティを収集
    array.forEach(obj => {
      // objがオブジェクトかどうかチェック
      if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
        Object.entries(obj).forEach(([name, value]) => {
          if (!allProperties.has(name)) {
            allProperties.set(name, new Set());
          }
          allProperties.get(name)?.add(this.getPropertyType(value, name));
        });
      }
    });

    // 共通プロパティを生成
    return Array.from(allProperties.entries()).map(([name, types]) => {
      const typeSet = Array.from(types);
      const type = typeSet.length > 1 
        ? typeSet.join(' | ') as PropertyType
        : typeSet[0] as PropertyType;

      // objがオブジェクトの場合のみチェック
      const existsInAllObjects = array.every(obj => 
        typeof obj === 'object' && obj !== null && !Array.isArray(obj) && name in obj
      );
      // 全てのオブジェクトに存在する場合は必須プロパティとする
      const optional = !existsInAllObjects;

      return {
        name,
        type,
        optional
      };
    });
  }

  /**
   * 型定義を文字列として生成します
   */
  private generateTypeDefinition(properties: TypeProperty[], typeName: string): string {
    const propertiesStr = properties
      .map(prop => `${this.indent}${prop.name}${prop.optional ? '?' : ''}: ${prop.type};`)
      .join('\n');

    return `type ${typeName} = {\n${propertiesStr}\n};`;
  }

  /**
   * データからTypeScriptの型定義を生成します
   */
  generate(data: Record<string, any> | Record<string, any>[]): string {
    this.generatedTypes.clear();

    if (Array.isArray(data)) {
      if (data.length === 0) {
        return `type ${this.rootTypeName} = any[];`;
      }

      const properties = this.extractCommonProperties(data);
      const elementTypeName = this.getArrayElementTypeName();
      const elementType = this.generateTypeDefinition(properties, elementTypeName);
      
      const allTypes = [elementType];
      for (const [_typeName, typeDefinition] of this.generatedTypes) {
        allTypes.push(typeDefinition);
      }
      allTypes.push(`type ${this.rootTypeName} = ${elementTypeName}[];`);
      
      return allTypes.join('\n\n');
    } else {
      const properties = this.extractProperties(data);
      const rootType = this.generateTypeDefinition(properties, this.rootTypeName);
      
      const allTypes = [rootType];
      for (const [_typeName, typeDefinition] of this.generatedTypes) {
        allTypes.push(typeDefinition);
      }
      
      return allTypes.join('\n\n');
    }
  }

  /**
   * 新しいオプションでTypeGenインスタンスを生成します
   */
  withOptions(options: TypeGenOptions): TypeGen {
    return new TypeGen({
      rootTypeName: options.rootTypeName ?? this.rootTypeName,
      indentSize: options.indentSize ?? this.indentSize,
      arrayElementTypeName: options.arrayElementTypeName ?? this.arrayElementTypeName
    });
  }

  /**
   * 再帰的に型情報を抽出（配列にも対応）
   */
  private extractDeepProperties(obj: any): Record<string, DeepTypeProperty> {
    if (Array.isArray(obj)) {
      if (obj.length === 0) return {};
      // 配列の場合は共通プロパティを抽出
      const commonProps = this.extractCommonProperties(obj);
      const result: Record<string, DeepTypeProperty> = {};
      for (const prop of commonProps) {
        if (typeof obj[0][prop.name] === 'object' && obj[0][prop.name] !== null && !Array.isArray(obj[0][prop.name])) {
          // ネストしたオブジェクトの場合、全ての要素から該当プロパティを抽出して再帰処理
          const nestedObjects = obj.map(item => item[prop.name]).filter(item => item !== undefined);
          result[prop.name] = {
            type: prop.type,
            optional: prop.optional,
            children: this.extractDeepProperties(nestedObjects)
          };
        } else {
          result[prop.name] = {
            type: prop.type,
            optional: prop.optional
          };
        }
      }
      return result;
    }
    
    if (typeof obj !== 'object' || obj === null) return {};
    const result: Record<string, DeepTypeProperty> = {};
    for (const [key, value] of Object.entries(obj)) {
      const type = this.getPropertyType(value, key);
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result[key] = {
          type,
          children: this.extractDeepProperties(value)
        };
      } else {
        result[key] = {
          type,
        };
      }
    }
    return result;
  }

  /**
   * 再帰的な型アサーション（配列にも対応）
   */
  assertDeep(data: any, expected: Record<string, DeepTypeProperty>, path: string = ''): void {
    const actual = this.extractDeepProperties(data);
    for (const key of Object.keys(expected)) {
      if (!(key in actual)) {
        throw new Error(`Missing property at ${path}${key}`);
      }
      const exp = expected[key];
      const act = actual[key];
      
      // optionalのデフォルト値はfalse
      const expectedOptional = exp.optional ?? false;
      const actualOptional = act.optional ?? false;
      
      if (exp.type !== act.type || expectedOptional !== actualOptional) {
        throw new Error(`Type mismatch at ${path}${key}: expected { type: ${exp.type}, optional: ${expectedOptional} }, got { type: ${act.type}, optional: ${actualOptional} }`);
      }
      if (exp.children) {
        // 配列の場合は、ネストしたオブジェクトも配列として渡す
        const nestedData = Array.isArray(data) 
          ? data.map(item => item[key]).filter(item => item !== undefined)
          : (data as any)[key];
        this.assertDeep(nestedData, exp.children, `${path}${key}.`);
      }
    }
  }
}

/**
 * データからTypeScriptの型定義を生成するためのユーティリティ
 * 
 * このモジュールは、データの構造から適切なTypeScript型定義を生成します。
 * 入力データの形式に応じて、単一オブジェクト用の型定義または配列用の型定義を生成します。
 * 
 * 特徴:
 * - 単一オブジェクトから型定義を生成
 * - 配列から共通プロパティを抽出して型定義を生成
 * - カスタマイズ可能な型名とインデント
 * - プロパティ名に基づく型名の自動生成
 * 
 * 型の判定ルール:
 * - 配列の場合:
 *   - 空配列 → any[]
 *   - 要素がすべて同じ型 → その型の配列（例: number[]）
 *   - 要素の型が混在 → any[]
 * - オブジェクトの場合:
 *   - ネストしたオブジェクト → プロパティ名から生成された型名（例: user → UserType）
 *   - null/undefined → any型
 * 
 * @example
 * // 単一オブジェクトの場合
 * const data = {
 *   id: 1,
 *   name: "John Doe",
 *   email: "john@example.com"
 * };
 * // 生成される型:
 * type RootType = {
 *   id: number;
 *   name: string;
 *   email: string;
 * }
 * 
 * @example
 * // 配列の場合
 * const data = [
 *   {
 *     id: 1,
 *     name: "John Doe",
 *     email: "john@example.com"
 *   },
 *   {
 *     id: 2,
 *     name: "Jane Smith",
 *     phone: "123-456-7890"
 *   }
 * ];
 * // 生成される型:
 * type ContentType = {
 *   id: number;
 *   name: string;
 *   email?: string;
 *   phone?: string;
 * }
 * type RootType = ContentType[];
 * 
 * @example
 * // 配列の型混在とネストしたオブジェクト
 * const data = {
 *   numbers: [1, 2, 3],        // number[]
 *   strings: ["a", "b", "c"],  // string[]
 *   mixed: [1, "a", true],     // any[]
 *   empty: [],                 // any[]
 *   user: {                    // UserType
 *     profile: {               // ProfileType
 *       name: "John"
 *     }
 *   }
 * };
 * // 生成される型:
 * type ProfileType = {
 *   name: string;
 * }
 * type UserType = {
 *   profile: ProfileType;
 * }
 * type RootType = {
 *   numbers: number[];
 *   strings: string[];
 *   mixed: any[];
 *   empty: any[];
 *   user: UserType;
 * }
 * 
 * @note
 * - 配列の場合は、すべてのプロパティをオプショナル（?）として扱います
 * - 単一オブジェクトの場合は、すべてのプロパティを必須として扱います
 * - ネストしたオブジェクトの型名は、プロパティ名から自動生成されます（user → UserType）
 * - 配列要素の型は ContentType として生成されます
 */
export { TypeGen };
