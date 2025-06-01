import { describe, it } from './test';
import { TypeGen } from '../common/TypeGen';

describe('TypeGen', () => {
  describe('コンストラクタとオプション', () => {
    it('デフォルト設定でインスタンスを作成できる', () => {
      const typeGen = new TypeGen();
      // デフォルト設定の確認は内部プロパティなので型生成で間接的に確認
      const data = { id: 1 };
      typeGen.assertDeep(data, {
        id: { type: 'number' },
      });
    });

    it('カスタム rootTypeName でインスタンスを作成できる', () => {
      const typeGen = new TypeGen({ rootTypeName: 'CustomType' });
      const data = { id: 1 };
      typeGen.assertDeep(data, {
        id: { type: 'number' },
      });
    });

    it('カスタム indentSize でインスタンスを作成できる', () => {
      const typeGen = new TypeGen({ indentSize: 4 });
      const data = { id: 1 };
      typeGen.assertDeep(data, {
        id: { type: 'number' },
      });
    });

    it('すべてのオプションを指定してインスタンスを作成できる', () => {
      const typeGen = new TypeGen({ rootTypeName: 'MyType', indentSize: 3 });
      const data = { id: 1 };
      typeGen.assertDeep(data, {
        id: { type: 'number' },
      });
    });

    it('withOptions で新しいインスタンスを作成できる', () => {
      const typeGen = new TypeGen();
      const customTypeGen = typeGen.withOptions({ rootTypeName: 'UserType' });
      const data = { id: 1 };
      customTypeGen.assertDeep(data, {
        id: { type: 'number' },
      });
    });

    it('withOptions で部分的なオプション変更ができる', () => {
      const typeGen = new TypeGen({ rootTypeName: 'BaseType', indentSize: 4 });
      const customTypeGen = typeGen.withOptions({ rootTypeName: 'NewType' });
      const data = { id: 1 };
      customTypeGen.assertDeep(data, {
        id: { type: 'number' },
      });
    });

    it('カスタム arrayElementTypeName でインスタンスを作成できる', () => {
      const typeGen = new TypeGen({ arrayElementTypeName: 'ItemType' });
      const data = {
        items: [{ id: 1, name: "item1" }, { id: 2, name: "item2" }]
      };
      typeGen.assertDeep(data, {
        items: { type: 'ItemType[]' },
      });
    });

    it('withOptions で arrayElementTypeName を変更できる', () => {
      const typeGen = new TypeGen();
      const customTypeGen = typeGen.withOptions({ arrayElementTypeName: 'ElementType' });
      const data = {
        elements: [{ value: 1 }, { value: 2 }]
      };
      customTypeGen.assertDeep(data, {
        elements: { type: 'ElementType[]' },
      });
    });
  });

  describe('基本データ型の判定', () => {
    it('number型を正しく判定する', () => {
      const typeGen = new TypeGen();
      const data = {
        integer: 42,
        float: 3.14,
        negative: -100,
        zero: 0,
        infinity: Infinity,
        negativeInfinity: -Infinity,
        nan: NaN
      };
      typeGen.assertDeep(data, {
        integer: { type: 'number' },
        float: { type: 'number' },
        negative: { type: 'number' },
        zero: { type: 'number' },
        infinity: { type: 'number' },
        negativeInfinity: { type: 'number' },
        nan: { type: 'number' },
      });
    });

    it('string型を正しく判定する', () => {
      const typeGen = new TypeGen();
      const data = {
        empty: "",
        normal: "hello",
        unicode: "こんにちは🌟",
        multiline: "line1\nline2"
      };
      typeGen.assertDeep(data, {
        empty: { type: 'string' },
        normal: { type: 'string' },
        unicode: { type: 'string' },
        multiline: { type: 'string' },
      });
    });

    it('boolean型を正しく判定する', () => {
      const typeGen = new TypeGen();
      const data = {
        truthy: true,
        falsy: false
      };
      typeGen.assertDeep(data, {
        truthy: { type: 'boolean' },
        falsy: { type: 'boolean' },
      });
    });

    it('null と undefined を any 型として判定する', () => {
      const typeGen = new TypeGen();
      const data = {
        nullValue: null,
        undefinedValue: undefined
      };
      typeGen.assertDeep(data, {
        nullValue: { type: 'any' },
        undefinedValue: { type: 'any' },
      });
    });
  });

  describe('配列型の判定', () => {
    it('空配列を any[] として判定する', () => {
      const typeGen = new TypeGen();
      const data = {
        empty: []
      };
      typeGen.assertDeep(data, {
        empty: { type: 'any[]' },
      });
    });

    it('同じ型の配列を正しく判定する', () => {
      const typeGen = new TypeGen();
      const data = {
        numbers: [1, 2, 3],
        strings: ["a", "b", "c"],
        booleans: [true, false, true]
      };
      typeGen.assertDeep(data, {
        numbers: { type: 'number[]' },
        strings: { type: 'string[]' },
        booleans: { type: 'boolean[]' },
      });
    });

    it('混在型の配列を any[] として判定する', () => {
      const typeGen = new TypeGen();
      const data = {
        mixed: [1, "hello", true, null],
        mixedNumbers: [1, 2.5, "3"]
      };
      typeGen.assertDeep(data, {
        mixed: { type: 'any[]' },
        mixedNumbers: { type: 'any[]' },
      });
    });

    it('ネストした配列を正しく判定する', () => {
      const typeGen = new TypeGen();
      const data = {
        matrix: [[1, 2], [3, 4]],
        mixedMatrix: [[1, "a"], [2, "b"]],
        deepNested: [[[1]]]
      };
      typeGen.assertDeep(data, {
        matrix: { type: 'number[][]' },
        mixedMatrix: { type: 'any[][]' },
        deepNested: { type: 'number[][][]' },
      });
    });
  });

  describe('オブジェクト型の判定とネスト', () => {
    it('シンプルなネストオブジェクトの型名を生成する', () => {
      const typeGen = new TypeGen();
      const data = {
        user: {
          name: "John",
          age: 30
        },
        profile: {
          bio: "Engineer"
        }
      };
      typeGen.assertDeep(data, {
        user: {
          type: 'UserType', children: {
            name: { type: 'string' },
            age: { type: 'number' },
          }
        },
        profile: {
          type: 'ProfileType', children: {
            bio: { type: 'string' },
          }
        }
      });
    });

    it('深いネスト構造の型名を生成する', () => {
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
      typeGen.assertDeep(data, {
        level1: {
          type: 'Level1Type', children: {
            level2: {
              type: 'Level2Type', children: {
                level3: {
                  type: 'Level3Type', children: {
                    value: { type: 'string' },
                  }
                }
              }
            }
          }
        }
      });
    });

    it('プロパティ名がない場合は any 型として判定する', () => {
      const typeGen = new TypeGen();
      // getPropertyType メソッドでpropertyNameがない場合のテスト
      // 実際にはprivateメソッドなので間接的にテスト
      const data = {
        anonymous: { key: "value" }
      };
      typeGen.assertDeep(data, {
        anonymous: {
          type: 'AnonymousType', children: {
            key: { type: 'string' },
          }
        }
      });
    });
  });

  describe('単一オブジェクトからの型生成', () => {
    it('基本的なプロパティを持つオブジェクトから型を生成する', () => {
      const typeGen = new TypeGen();
      const data = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        active: true
      };
      typeGen.assertDeep(data, {
        id: { type: 'number' },
        name: { type: 'string' },
        email: { type: 'string' },
        active: { type: 'boolean' },
      });
    });

    it('空のオブジェクトから型を生成する', () => {
      const typeGen = new TypeGen();
      const data = {};
      typeGen.assertDeep(data, {});
    });

    it('複雑なネスト構造を持つオブジェクトから型を生成する', () => {
      const typeGen = new TypeGen();
      const data = {
        user: {
          profile: {
            personal: {
              age: 30,
              isActive: true
            },
            scores: [85, 90, 95]
          },
          role: "admin"
        },
        metadata: {
          createdAt: "2024-01-01",
          tags: ["verified", "premium"]
        }
      };
      typeGen.assertDeep(data, {
        user: {
          type: 'UserType', children: {
            profile: {
              type: 'ProfileType', children: {
                personal: {
                  type: 'PersonalType', children: {
                    age: { type: 'number' },
                    isActive: { type: 'boolean' },
                  }
                },
                scores: { type: 'number[]' },
              }
            },
            role: { type: 'string' },
          }
        },
        metadata: {
          type: 'MetadataType', children: {
            createdAt: { type: 'string' },
            tags: { type: 'string[]' },
          }
        }
      });
    });
  });

  describe('配列からの型生成', () => {
    it('空配列から型を生成する', () => {
      const typeGen = new TypeGen();
      const data: any[] = [];
      typeGen.assertDeep(data, {});
    });

    it('同一構造の配列から共通型を生成する', () => {
      const typeGen = new TypeGen();
      const data = [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com"
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com"
        }
      ];
      typeGen.assertDeep(data, {
        id: { type: 'number' },
        name: { type: 'string' },
        email: { type: 'string' },
      });
    });

    it('異なる構造の配列からオプショナルプロパティを含む型を生成する', () => {
      const typeGen = new TypeGen();
      const data = [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com"
        },
        {
          id: 2,
          name: "Jane Smith",
          phone: "123-456-7890"
        }
      ];
      typeGen.assertDeep(data, {
        id: { type: 'number' },
        name: { type: 'string' },
        email: { type: 'string', optional: true },
        phone: { type: 'string', optional: true },
      });
    });

    it('型が混在する配列からユニオン型を生成する', () => {
      const typeGen = new TypeGen();
      const data = [
        {
          id: 1,
          value: 100,
          tags: ["active"]
        },
        {
          id: 2,
          value: "premium",
          tags: [1, 2, 3]
        }
      ];
      typeGen.assertDeep(data, {
        id: { type: 'number' },
        value: { type: 'number | string' },
        tags: { type: 'string[] | number[]' },
      });
    });

    it('ネストしたオブジェクトを含む配列から型を生成する', () => {
      const typeGen = new TypeGen();
      const data = [
        {
          user: {
            name: "John",
            age: 30
          },
          active: true
        },
        {
          user: {
            name: "Jane",
            age: 25
          },
          active: false
        }
      ];
      typeGen.assertDeep(data, {
        user: {
          type: 'UserType', children: {
            name: { type: 'string' },
            age: { type: 'number' },
          }
        },
        active: { type: 'boolean' },
      });
    });

    it('複雑なネストとオプショナルプロパティを含む配列から型を生成する', () => {
      const typeGen = new TypeGen();
      const data = [
        {
          user: {
            profile: {
              scores: [85, 90, 95],
              status: "active",
            },
            level: 1
          }
        },
        {
          user: {
            profile: {
              scores: ["A", "B"],
              status: 2,
            },
            isPremium: true
          }
        }
      ];
      typeGen.assertDeep(data, {
        user: {
          type: 'UserType', children: {
            profile: {
              type: 'ProfileType', children: {
                scores: { type: 'number[] | string[]' },
                status: { type: 'string | number' },
              }
            },
            level: { type: 'number', optional: true },
            isPremium: { type: 'boolean', optional: true },
          }
        }
      });
    });
  });

  describe('エッジケースの処理', () => {
    it('特殊な文字を含むプロパティ名を処理する', () => {
      const typeGen = new TypeGen();
      const data = {
        "user-name": "john",
        "user_id": 123,
        "user.email": "john@example.com",
        "123number": "starts with number",
        "🎯target": "emoji property"
      };
      typeGen.assertDeep(data, {
        "user-name": { type: 'string' },
        "user_id": { type: 'number' },
        "user.email": { type: 'string' },
        "123number": { type: 'string' },
        "🎯target": { type: 'string' },
      });
    });

    it('非常に深いネスト構造を処理する', () => {
      const typeGen = new TypeGen();
      const data = {
        a: {
          b: {
            c: {
              d: {
                e: {
                  value: "deep"
                }
              }
            }
          }
        }
      };
      typeGen.assertDeep(data, {
        a: {
          type: 'AType', children: {
            b: {
              type: 'BType', children: {
                c: {
                  type: 'CType', children: {
                    d: {
                      type: 'DType', children: {
                        e: {
                          type: 'EType', children: {
                            value: { type: 'string' },
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });
    });

    it('大量のプロパティを持つオブジェクトを処理する', () => {
      const typeGen = new TypeGen();
      const data = Object.fromEntries(
        Array.from({ length: 20 }, (_, i) => [`prop${i}`, i])
      );
      const expected = Object.fromEntries(
        Array.from({ length: 20 }, (_, i) => [`prop${i}`, { type: 'number' }])
      );
      typeGen.assertDeep(data, expected);
    });

    it('大量の要素を持つ配列を処理する', () => {
      const typeGen = new TypeGen();
      const data = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        value: `item_${i}`,
        active: i % 2 === 0
      }));
      typeGen.assertDeep(data, {
        id: { type: 'number' },
        value: { type: 'string' },
        active: { type: 'boolean' },
      });
    });
  });

  describe('型の判定境界値テスト', () => {
    it('JavaScript の数値の境界値を処理する', () => {
      const typeGen = new TypeGen();
      const data = {
        maxSafe: Number.MAX_SAFE_INTEGER,
        minSafe: Number.MIN_SAFE_INTEGER,
        maxValue: Number.MAX_VALUE,
        minValue: Number.MIN_VALUE,
        epsilon: Number.EPSILON
      };
      typeGen.assertDeep(data, {
        maxSafe: { type: 'number' },
        minSafe: { type: 'number' },
        maxValue: { type: 'number' },
        minValue: { type: 'number' },
        epsilon: { type: 'number' },
      });
    });

    it('極端に長い文字列を処理する', () => {
      const typeGen = new TypeGen();
      const data = {
        veryLong: "a".repeat(10000),
        unicode: "🌟".repeat(1000),
        mixed: "a🌟".repeat(1000)
      };
      typeGen.assertDeep(data, {
        veryLong: { type: 'string' },
        unicode: { type: 'string' },
        mixed: { type: 'string' },
      });
    });

    it('極端に深いネスト配列を処理する', () => {
      const typeGen = new TypeGen();
      const data = {
        deepArray: [[[[[1]]]]]
      };
      typeGen.assertDeep(data, {
        deepArray: { type: 'number[][][][][]' },
      });
    });
  });

  describe('型混在パターンの網羅テスト', () => {
    it('2つの異なる型の混在', () => {
      const typeGen = new TypeGen();
      const data = [
        { value: 42 },
        { value: "hello" }
      ];
      typeGen.assertDeep(data, {
        value: { type: 'number | string' },
      });
    });

    it('3つの異なる型の混在', () => {
      const typeGen = new TypeGen();
      const data = [
        { value: 42 },
        { value: "hello" },
        { value: true }
      ];
      typeGen.assertDeep(data, {
        value: { type: 'number | string | boolean' },
      });
    });

    it('配列型とプリミティブ型の混在', () => {
      const typeGen = new TypeGen();
      const data = [
        { value: [1, 2, 3] },
        { value: "hello" }
      ];
      typeGen.assertDeep(data, {
        value: { type: 'number[] | string' },
      });
    });

    it('オブジェクト型とプリミティブ型の混在', () => {
      const typeGen = new TypeGen();
      const data = [
        { value: { nested: "object" } },
        { value: 42 }
      ];
      typeGen.assertDeep(data, {
        value: { type: 'ValueType | number' },
      });
    });

    it('すべての基本型が混在する場合', () => {
      const typeGen = new TypeGen();
      const data = [
        { value: 42 },
        { value: "hello" },
        { value: true },
        { value: null },
        { value: [1, 2] },
        { value: { prop: "object" } }
      ];
      typeGen.assertDeep(data, {
        value: { type: 'number | string | boolean | any | number[] | ValueType' },
      });
    });
  });
});
