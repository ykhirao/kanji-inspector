// @ts-nocheck
// @ts-format ignore
// prettier-ignore
import { describe, it, assert } from './test';
import { TypeGen } from '../common/TypeGen';

describe('TypeGen 実際の型定義生成テスト', () => {
  describe('基本的なデータ型の生成', () => {
    it('シンプルなオブジェクトから型定義を生成', () => {
      const typeGen = new TypeGen();
      const data = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        active: true
      };
      
      const result = typeGen.generate(data);
      
      const expected = `
type RootType = {
  id: number;
  name: string;
  email: string;
  active: boolean;
};`.trim();
      
      assert.equal(result, expected);
    });

    it('ネストしたオブジェクトから型定義を生成', () => {
      const typeGen = new TypeGen();
      const data = {
        user: {
          name: "Alice",
          age: 25
        },
        active: true
      };
      
      const result = typeGen.generate(data);
      
      const expected = `
type RootType = {
  user: UserType;
  active: boolean;
};

type UserType = {
  name: string;
  age: number;
};`.trim();
      
      assert.equal(result, expected);
    });

    it('配列を含むオブジェクトから型定義を生成', () => {
      const typeGen = new TypeGen();
      const data = {
        numbers: [1, 2, 3],
        strings: ["a", "b", "c"],
        mixed: [1, "hello", true],
        users: [
          { id: 1, name: "Alice" },
          { id: 2, name: "Bob" }
        ]
      };
      
      const result = typeGen.generate(data);
      
      const expected = `
type RootType = {
  numbers: number[];
  strings: string[];
  mixed: any[];
  users: ContentType[];
};

type ContentType = {
  id: number;
  name: string;
};`.trim();
      
      assert.equal(result, expected);
    });

    it('配列データから型定義を生成', () => {
      const typeGen = new TypeGen();
      const data = [
        { id: 1, name: "Alice", active: true },
        { id: 2, name: "Bob", email: "bob@example.com" }
      ];
      
      const result = typeGen.generate(data);
      
      const expected = `
type ContentType = {
  id: number;
  name: string;
  active?: boolean;
  email?: string;
};

type RootType = ContentType[];`.trim();
      
      assert.equal(result, expected);
    });

    it('カスタムオプションで型定義を生成', () => {
      const typeGen = new TypeGen({
        rootTypeName: 'MyType',
        arrayElementTypeName: 'ItemType',
        indentSize: 4
      });
      const data = {
        items: [
          { value: 1 },
          { value: 2 }
        ]
      };
      
      const result = typeGen.generate(data);
      
      const expected = `
type MyType = {
    items: ItemType[];
};

type ItemType = {
    value: number;
};`.trim();
      
      assert.equal(result, expected);
    });

    it('空のデータ構造の型定義を生成', () => {
      const typeGen = new TypeGen();
      
      const emptyObject = typeGen.generate({});
      const expectedEmpty = `
type RootType = {

};`.trim();
      assert.equal(emptyObject, expectedEmpty);
      
      const emptyArray = typeGen.generate([]);
      const expectedArray = `type RootType = any[];`;
      assert.equal(emptyArray, expectedArray);
    });

    it('深いネスト構造の型定義を生成', () => {
      const typeGen = new TypeGen();
      const data = {
        level1: {
          level2: {
            level3: {
              value: "deep"
            }
          }
        }
      };
      
      const result = typeGen.generate(data);
      
      const expected = `
type RootType = {
  level1: Level1Type;
};

type Level3Type = {
  value: string;
};

type Level2Type = {
  level3: Level3Type;
};

type Level1Type = {
  level2: Level2Type;
};`.trim();
      
      assert.equal(result, expected);
    });

    it('型混在とユニオン型の生成', () => {
      const typeGen = new TypeGen();
      const data = [
        { value: 42, type: "number" },
        { value: "hello", type: "string" },
        { value: true, extra: "info" }
      ];
      
      const result = typeGen.generate(data);
      
      const expected = `
type ContentType = {
  value: number | string | boolean;
  type?: string;
  extra?: string;
};

type RootType = ContentType[];`.trim();
      
      assert.equal(result, expected);
    });
  });

  describe('rootTypeName オプションのテスト', () => {
    it('カスタム rootTypeName でオブジェクト型を生成', () => {
      const typeGen = new TypeGen({ rootTypeName: 'UserProfile' });
      const data = {
        id: 1,
        name: "John",
        settings: {
          theme: "dark",
          notifications: true
        }
      };
      
      const result = typeGen.generate(data);
      
      const expected = `
type UserProfile = {
  id: number;
  name: string;
  settings: SettingsType;
};

type SettingsType = {
  theme: string;
  notifications: boolean;
};`.trim();
      
      assert.equal(result, expected);
    });

    it('カスタム rootTypeName で配列型を生成', () => {
      const typeGen = new TypeGen({ rootTypeName: 'UserList' });
      const data = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" }
      ];
      
      const result = typeGen.generate(data);
      
      const expected = `
type ContentType = {
  id: number;
  name: string;
};

type UserList = ContentType[];`.trim();
      
      assert.equal(result, expected);
    });

    it('withOptions で rootTypeName を変更', () => {
      const baseTypeGen = new TypeGen();
      const customTypeGen = baseTypeGen.withOptions({ rootTypeName: 'ApiResponse' });
      const data = {
        status: "success",
        data: { result: "ok" }
      };
      
      const result = customTypeGen.generate(data);
      
      const expected = `
type ApiResponse = {
  status: string;
  data: DataType;
};

type DataType = {
  result: string;
};`.trim();
      
      assert.equal(result, expected);
    });

    it('複数のオプション組み合わせ', () => {
      const typeGen = new TypeGen({
        rootTypeName: 'ProductCatalog',
        arrayElementTypeName: 'Product',
        indentSize: 4
      });
      const data = [
        {
          id: 1,
          details: { name: "MacBook", price: 200000 }
        },
        {
          id: 2,
          details: { name: "iPhone", price: 100000 }
        }
      ];
      
      const result = typeGen.generate(data);
      
      const expected = `
type Product = {
    id: number;
    details: DetailsType;
};

type DetailsType = {
    name: string;
    price: number;
};

type ProductCatalog = Product[];`.trim();
      
      assert.equal(result, expected);
    });
  });

  describe('配列の複雑なパターン', () => {
    it('ネストした配列の型定義を生成', () => {
      const typeGen = new TypeGen();
      const data = {
        matrix: [[1, 2], [3, 4]],
        mixedMatrix: [[1, "a"], [2, "b"]],
        deepNested: [[[1, 2]], [[3, 4]]]
      };
      
      const result = typeGen.generate(data);
      
      const expected = `
type RootType = {
  matrix: number[][];
  mixedMatrix: any[][];
  deepNested: number[][][];
};`.trim();
      
      assert.equal(result, expected);
    });

    it('配列内でのオプショナルプロパティ', () => {
      const typeGen = new TypeGen();
      const data = [
        { id: 1, name: "Alice", email: "alice@test.com" },
        { id: 2, name: "Bob" },
        { id: 3, name: "Charlie", phone: "123-456-7890" }
      ];
      
      const result = typeGen.generate(data);
      
      const expected = `
type ContentType = {
  id: number;
  name: string;
  email?: string;
  phone?: string;
};

type RootType = ContentType[];`.trim();
      
      assert.equal(result, expected);
    });

    it('複雑な型混在パターン', () => {
      const typeGen = new TypeGen();
      const data = [
        { value: 42, metadata: { type: "number", valid: true } },
        { value: "hello", metadata: { type: "string", length: 5 } },
        { value: [1, 2, 3], status: "array" }
      ];
      
      const result = typeGen.generate(data);
      
      const expected = `
type ContentType = {
  value: number | string | number[];
  metadata?: MetadataType;
  status?: string;
};

type MetadataType = {
  type: string;
  length: number;
};

type RootType = ContentType[];`.trim();
      
      assert.equal(result, expected);
    });
  });

  describe('実世界のデータパターン', () => {
    it('API レスポンス構造', () => {
      const typeGen = new TypeGen({ rootTypeName: 'ApiResponse' });
      const data = {
        meta: {
          status: "success",
          code: 200,
          timestamp: "2024-01-15T12:00:00Z"
        },
        data: {
          users: [
            { id: 1, name: "Alice", roles: ["user", "admin"] },
            { id: 2, name: "Bob", roles: ["user"] }
          ],
          pagination: {
            page: 1,
            limit: 10,
            total: 25
          }
        }
      };
      
      const result = typeGen.generate(data);
      
      const expected = `
type ApiResponse = {
  meta: MetaType;
  data: DataType;
};

type MetaType = {
  status: string;
  code: number;
  timestamp: string;
};

type ContentType = {
  id: number;
  name: string;
  roles: string[];
};

type PaginationType = {
  page: number;
  limit: number;
  total: number;
};

type DataType = {
  users: ContentType[];
  pagination: PaginationType;
};`.trim();
      
      assert.equal(result, expected);
    });

    it('SNS ユーザープロフィール', () => {
      const typeGen = new TypeGen({ rootTypeName: 'UserProfile' });
      const data = {
        user: {
          id: "user_123",
          profile: {
            displayName: "John Doe",
            bio: "Software Engineer",
            stats: {
              followers: 1250,
              following: 580
            }
          },
          posts: [
            {
              id: "post_1",
              content: "Hello world!",
              likes: 45,
              tags: ["hello", "world"]
            }
          ]
        }
      };
      
      const result = typeGen.generate(data);
      
      const expected = `
type UserProfile = {
  user: UserType;
};

type StatsType = {
  followers: number;
  following: number;
};

type ProfileType = {
  displayName: string;
  bio: string;
  stats: StatsType;
};

type ContentType = {
  id: string;
  content: string;
  likes: number;
  tags: string[];
};

type UserType = {
  id: string;
  profile: ProfileType;
  posts: ContentType[];
};`.trim();
      
      assert.equal(result, expected);
    });

    it('eコマース商品データ', () => {
      const typeGen = new TypeGen({ 
        rootTypeName: 'ProductCatalog',
        arrayElementTypeName: 'Product'
      });
      const data = [
        {
          id: "prod_001",
          name: "MacBook Pro",
          price: {
            amount: 299800,
            currency: "JPY",
            discount: { percentage: 10, validUntil: "2024-12-31" }
          },
          specs: {
            cpu: "M3 Pro",
            memory: "32GB"
          }
        },
        {
          id: "prod_002", 
          name: "iPhone 15",
          price: {
            amount: 159800,
            currency: "JPY"
          },
          specs: {
            cpu: "A17 Pro",
            storage: "256GB"
          }
        }
      ];
      
      const result = typeGen.generate(data);
      
      const expected = `
type Product = {
  id: string;
  name: string;
  price: PriceType;
  specs: SpecsType;
};

type DiscountType = {
  percentage: number;
  validUntil: string;
};

type PriceType = {
  amount: number;
  currency: string;
};

type SpecsType = {
  cpu: string;
  storage: string;
};

type ProductCatalog = Product[];`.trim();
      
      assert.equal(result, expected);
    });
  });

  describe('エッジケースの処理', () => {
    it('特殊文字を含むプロパティ名', () => {
      const typeGen = new TypeGen({ rootTypeName: 'SpecialProps' });
      const data = {
        "user-name": "john",
        "user_id": 123,
        "user.email": "john@example.com",
        "🎯target": "emoji property",
        "123number": "starts with number"
      };
      
      const result = typeGen.generate(data);
      
      const expected = `
type SpecialProps = {
  user-name: string;
  user_id: number;
  user.email: string;
  🎯target: string;
  123number: string;
};`.trim();
      
      assert.equal(result, expected);
    });

    it('null と undefined の処理', () => {
      const typeGen = new TypeGen({ rootTypeName: 'NullableData' });
      const data = {
        definedValue: "hello",
        nullValue: null,
        undefinedValue: undefined,
        mixedArray: [1, null, "hello", undefined]
      };
      
      const result = typeGen.generate(data);
      
      const expected = `
type NullableData = {
  definedValue: string;
  nullValue: any;
  undefinedValue: any;
  mixedArray: any[];
};`.trim();
      
      assert.equal(result, expected);
    });

    it('極端に深いネスト構造', () => {
      const typeGen = new TypeGen({ rootTypeName: 'DeepNest' });
      const data = {
        a: {
          b: {
            c: {
              d: {
                e: {
                  f: {
                    value: "very deep"
                  }
                }
              }
            }
          }
        }
      };
      
      const result = typeGen.generate(data);
      
      const expected = `
type DeepNest = {
  a: AType;
};

type FType = {
  value: string;
};

type EType = {
  f: FType;
};

type DType = {
  e: EType;
};

type CType = {
  d: DType;
};

type BType = {
  c: CType;
};

type AType = {
  b: BType;
};`.trim();
      
      assert.equal(result, expected);
    });

    it('大量プロパティの処理', () => {
      const typeGen = new TypeGen({ rootTypeName: 'ManyProps' });
      const data = Object.fromEntries(
        Array.from({ length: 10 }, (_, i) => [`prop${i}`, i])
      );
      
      const result = typeGen.generate(data);
      
      const expected = `
type ManyProps = {
  prop0: number;
  prop1: number;
  prop2: number;
  prop3: number;
  prop4: number;
  prop5: number;
  prop6: number;
  prop7: number;
  prop8: number;
  prop9: number;
};`.trim();
      
      assert.equal(result, expected);
    });
  });

  describe('型混在の複雑なパターン', () => {
    it('すべての基本型が混在するケース', () => {
      const typeGen = new TypeGen({ rootTypeName: 'MixedTypes' });
      const data = [
        { value: 42 },
        { value: "hello" },
        { value: true },
        { value: null },
        { value: [1, 2] },
        { value: { nested: "object" } }
      ];
      
      const result = typeGen.generate(data);
      
      const expected = `
type ContentType = {
  value: number | string | boolean | any | number[] | ValueType;
};

type ValueType = {
  nested: string;
};

type MixedTypes = ContentType[];`.trim();
      
      assert.equal(result, expected);
    });

    it('配列内オブジェクトの複雑な型混在', () => {
      const typeGen = new TypeGen({ 
        rootTypeName: 'ComplexMixed',
        arrayElementTypeName: 'Item'
      });
      const data = [
        {
          status: "active",
          config: { mode: "development" },
          values: [1, 2, 3]
        },
        {
          status: 200,
          config: { mode: "production", debug: true },
          values: ["a", "b", "c"]
        },
        {
          status: true,
          config: { timeout: 5000 },
          extra: "additional"
        }
      ];
      
      const result = typeGen.generate(data);
      
      const expected = `
type Item = {
  status: string | number | boolean;
  config: ConfigType;
  values?: number[] | string[];
  extra?: string;
};

type ConfigType = {
  timeout: number;
};

type ComplexMixed = Item[];`.trim();
      
      assert.equal(result, expected);
    });
  });

  describe('インデントサイズのテスト', () => {
    it('カスタムインデントサイズ（4スペース）', () => {
      const typeGen = new TypeGen({ 
        rootTypeName: 'CustomIndent',
        indentSize: 4
      });
      const data = {
        user: {
          name: "Alice",
          settings: {
            theme: "dark"
          }
        }
      };
      
      const result = typeGen.generate(data);
      
      const expected = `
type CustomIndent = {
    user: UserType;
};

type SettingsType = {
    theme: string;
};

type UserType = {
    name: string;
    settings: SettingsType;
};`.trim();
      
      assert.equal(result, expected);
    });

    it('カスタムインデントサイズ（8スペース）', () => {
      const typeGen = new TypeGen({ 
        rootTypeName: 'WideIndent',
        indentSize: 8
      });
      const data = {
        config: {
          value: "test"
        }
      };
      
      const result = typeGen.generate(data);
      
      const expected = `
type WideIndent = {
        config: ConfigType;
};

type ConfigType = {
        value: string;
};`.trim();
      
      assert.equal(result, expected);
    });
  });

  describe('全オプション組み合わせテスト', () => {
    it('すべてのオプションを指定したケース', () => {
      const typeGen = new TypeGen({
        rootTypeName: 'FullCustom',
        arrayElementTypeName: 'CustomElement',
        indentSize: 4
      });
      const data = {
        items: [
          {
            id: 1,
            details: { name: "Item 1", active: false }
          },
          {
            id: 2,
            details: { name: "Item 2", active: true }
          }
        ],
        metadata: {
          total: 2,
          created: "2024-01-15"
        }
      };
      
      const result = typeGen.generate(data);
      
      const expected = `
type FullCustom = {
    items: CustomElement[];
    metadata: MetadataType;
};

type DetailsType = {
    name: string;
    active: boolean;
};

type CustomElement = {
    id: number;
    details: DetailsType;
};

type MetadataType = {
    total: number;
    created: string;
};`.trim();
      
      assert.equal(result, expected);
    });
  });
}); 
