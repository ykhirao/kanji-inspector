import { describe, it } from './test';
import { TypeGen } from '../common/TypeGen';

describe('TypeGen 包括的テスト', () => {
  describe('基本データ型のテスト', () => {
    it('様々な数値型', () => {
      const typeGen = new TypeGen();
      const data = {
        integer: 42,
        negative: -100,
        zero: 0,
        float: 3.14159,
        large: 999999999999,
        scientific: 1e10
      };
      typeGen.assertDeep(data, {
        integer: { type: 'number' },
        negative: { type: 'number' },
        zero: { type: 'number' },
        float: { type: 'number' },
        large: { type: 'number' },
        scientific: { type: 'number' },
      });
    });

    it('様々な文字列型', () => {
      const typeGen = new TypeGen();
      const data = {
        empty: "",
        single: "a",
        japanese: "こんにちは世界",
        emoji: "🎉🔥⚡",
        long: "a".repeat(1000),
        special: "特殊!@#$%^&*()文字",
        multiline: "line1\nline2\tline3"
      };
      typeGen.assertDeep(data, {
        empty: { type: 'string' },
        single: { type: 'string' },
        japanese: { type: 'string' },
        emoji: { type: 'string' },
        long: { type: 'string' },
        special: { type: 'string' },
        multiline: { type: 'string' },
      });
    });

    it('ブール値と特殊値', () => {
      const typeGen = new TypeGen();
      const data = {
        truthy: true,
        falsy: false,
        nullValue: null,
        undefinedValue: undefined
      };
      typeGen.assertDeep(data, {
        truthy: { type: 'boolean' },
        falsy: { type: 'boolean' },
        nullValue: { type: 'any' },
        undefinedValue: { type: 'any' },
      });
    });
  });

  describe('配列の複雑なパターン', () => {
    it('ネストした配列', () => {
      const typeGen = new TypeGen();
      const data = {
        matrix: [[1, 2], [3, 4], [5, 6]],
        mixedNested: [[1, "a"], [2, "b"]],
        deepNested: [[[1, 2]], [[3, 4]]],
        jagged: [[1], [1, 2], [1, 2, 3]]
      };
      typeGen.assertDeep(data, {
        matrix: { type: 'number[][]' },
        mixedNested: { type: 'any[][]' },
        deepNested: { type: 'number[][][]' },
        jagged: { type: 'number[][]' },
      });
    });

    it('様々な型の混合配列', () => {
      const typeGen = new TypeGen();
      const data = {
        mixed: [1, "hello", true, null, undefined],
        objectArray: [{ a: 1 }, { b: 2 }, { c: "three" }],
        primitiveArray: [42, 3.14, 0, -100]
      };
      typeGen.assertDeep(data, {
        mixed: { type: 'any[]' },
        objectArray: { type: 'ContentType[]' },
        primitiveArray: { type: 'number[]' },
      });
    });
  });

  describe('深いネスト構造', () => {
    it('5階層の深いネスト', () => {
      const typeGen = new TypeGen();
      const data = {
        level1: {
          level2: {
            level3: {
              level4: {
                level5: {
                  deepValue: "buried treasure",
                  deepNumber: 12345
                }
              }
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
                    level4: {
                      type: 'Level4Type', children: {
                        level5: {
                          type: 'Level5Type', children: {
                            deepValue: { type: 'string' },
                            deepNumber: { type: 'number' },
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

    it('複雑な混合ネスト', () => {
      const typeGen = new TypeGen();
      const data = {
        config: {
          database: {
            host: "localhost",
            port: 5432,
            credentials: {
              username: "admin",
              password: "secret123"
            },
            pools: [
              { name: "read", size: 10 },
              { name: "write", size: 5 }
            ]
          },
          cache: {
            enabled: true,
            ttl: 3600,
            backends: ["redis", "memory"]
          }
        }
      };
      typeGen.assertDeep(data, {
        config: {
          type: 'ConfigType', children: {
            database: {
              type: 'DatabaseType', children: {
                host: { type: 'string' },
                port: { type: 'number' },
                credentials: {
                  type: 'CredentialsType', children: {
                    username: { type: 'string' },
                    password: { type: 'string' },
                  }
                },
                pools: { type: 'ContentType[]' },
              }
            },
            cache: {
              type: 'CacheType', children: {
                enabled: { type: 'boolean' },
                ttl: { type: 'number' },
                backends: { type: 'string[]' },
              }
            }
          }
        }
      });
    });
  });

  describe('実世界のデータ構造', () => {
    it('SNSユーザープロフィール', () => {
      const typeGen = new TypeGen();
      const data = {
        user: {
          id: "user_12345",
          username: "john_doe",
          profile: {
            displayName: "John Doe",
            bio: "Software Engineer 🚀",
            avatar: "https://example.com/avatar.jpg",
            location: "Tokyo, Japan",
            website: "https://johndoe.dev"
          },
          stats: {
            followers: 1250,
            following: 580,
            posts: 342
          },
          preferences: {
            theme: "dark",
            notifications: {
              email: true,
              push: false,
              sms: null
            },
            privacy: {
              publicProfile: true,
              showEmail: false
            }
          },
          posts: [
            {
              id: "post_1",
              content: "Hello world!",
              timestamp: "2024-01-15T10:30:00Z",
              likes: 45,
              comments: 3,
              tags: ["hello", "world"]
            }
          ]
        }
      };
      typeGen.assertDeep(data, {
        user: {
          type: 'UserType', children: {
            id: { type: 'string' },
            username: { type: 'string' },
            profile: {
              type: 'ProfileType', children: {
                displayName: { type: 'string' },
                bio: { type: 'string' },
                avatar: { type: 'string' },
                location: { type: 'string' },
                website: { type: 'string' },
              }
            },
            stats: {
              type: 'StatsType', children: {
                followers: { type: 'number' },
                following: { type: 'number' },
                posts: { type: 'number' },
              }
            },
            preferences: {
              type: 'PreferencesType', children: {
                theme: { type: 'string' },
                notifications: {
                  type: 'NotificationsType', children: {
                    email: { type: 'boolean' },
                    push: { type: 'boolean' },
                    sms: { type: 'any' },
                  }
                },
                privacy: {
                  type: 'PrivacyType', children: {
                    publicProfile: { type: 'boolean' },
                    showEmail: { type: 'boolean' },
                  }
                }
              }
            },
            posts: { type: 'ContentType[]' },
          }
        }
      });
    });

    it('eコマース商品データ', () => {
      const typeGen = new TypeGen();
      const data = [
        {
          product: {
            id: "prod_001",
            name: "MacBook Pro 16-inch",
            category: "laptops",
            price: {
              amount: 299800,
              currency: "JPY",
              discount: {
                percentage: 10,
                validUntil: "2024-12-31"
              }
            },
            specifications: {
              cpu: "M3 Pro",
              memory: "32GB",
              storage: "1TB SSD",
              display: {
                size: 16.2,
                resolution: "3456x2234",
                technology: "Liquid Retina XDR"
              }
            },
            availability: {
              inStock: true,
              quantity: 15,
              warehouses: ["tokyo", "osaka", "nagoya"]
            },
            reviews: {
              average: 4.8,
              count: 1847,
              breakdown: {
                "5": 1203,
                "4": 520,
                "3": 95,
                "2": 21,
                "1": 8
              }
            }
          }
        },
        {
          product: {
            id: "prod_002",
            name: "iPhone 15 Pro",
            category: "smartphones",
            price: {
              amount: 159800,
              currency: "JPY"
            },
            specifications: {
              cpu: "A17 Pro",
              storage: "256GB",
              display: {
                size: 6.1,
                resolution: "2556x1179",
                technology: "Super Retina XDR"
              },
              camera: {
                main: "48MP",
                ultrawide: "12MP",
                telephoto: "12MP"
              }
            },
            availability: {
              inStock: false,
              quantity: 0,
              expectedRestockDate: "2024-02-15"
            },
            reviews: {
              average: 4.9,
              count: 2341
            }
          }
        }
      ];
      typeGen.assertDeep(data, {
        product: {
          type: 'ProductType', children: {
            id: { type: 'string' },
            name: { type: 'string' },
            category: { type: 'string' },
            price: {
              type: 'PriceType', children: {
                amount: { type: 'number' },
                currency: { type: 'string' },
                discount: {
                  type: 'DiscountType', optional: true, children: {
                    percentage: { type: 'number' },
                    validUntil: { type: 'string' },
                  }
                }
              }
            },
            specifications: {
              type: 'SpecificationsType', children: {
                cpu: { type: 'string' },
                memory: { type: 'string', optional: true },
                storage: { type: 'string' },
                display: {
                  type: 'DisplayType', children: {
                    size: { type: 'number' },
                    resolution: { type: 'string' },
                    technology: { type: 'string' },
                  }
                },
                camera: {
                  type: 'CameraType', optional: true, children: {
                    main: { type: 'string' },
                    ultrawide: { type: 'string' },
                    telephoto: { type: 'string' },
                  }
                }
              }
            },
            availability: {
              type: 'AvailabilityType', children: {
                inStock: { type: 'boolean' },
                quantity: { type: 'number' },
                warehouses: { type: 'string[]', optional: true },
                expectedRestockDate: { type: 'string', optional: true },
              }
            },
            reviews: {
              type: 'ReviewsType', children: {
                average: { type: 'number' },
                count: { type: 'number' },
                breakdown: {
                  type: 'BreakdownType', optional: true, children: {
                    "5": { type: 'number' },
                    "4": { type: 'number' },
                    "3": { type: 'number' },
                    "2": { type: 'number' },
                    "1": { type: 'number' },
                  }
                }
              }
            }
          }
        }
      });
    });

    it('API レスポンス形式', () => {
      const typeGen = new TypeGen();
      const data = {
        meta: {
          status: "success",
          code: 200,
          message: "Data retrieved successfully",
          timestamp: "2024-01-15T12:00:00Z",
          requestId: "req_abc123",
          version: "v2.1"
        },
        data: {
          users: [
            {
              id: 1,
              name: "Alice",
              email: "alice@example.com",
              roles: ["user", "moderator"]
            },
            {
              id: 2,
              name: "Bob", 
              email: "bob@example.com",
              roles: ["user"]
            }
          ],
          pagination: {
            page: 1,
            limit: 10,
            total: 25,
            totalPages: 3,
            hasNext: true,
            hasPrev: false
          }
        },
        errors: null
      };
      typeGen.assertDeep(data, {
        meta: {
          type: 'MetaType', children: {
            status: { type: 'string' },
            code: { type: 'number' },
            message: { type: 'string' },
            timestamp: { type: 'string' },
            requestId: { type: 'string' },
            version: { type: 'string' },
          }
        },
        data: {
          type: 'DataType', children: {
            users: { type: 'ContentType[]' },
            pagination: {
              type: 'PaginationType', children: {
                page: { type: 'number' },
                limit: { type: 'number' },
                total: { type: 'number' },
                totalPages: { type: 'number' },
                hasNext: { type: 'boolean' },
                hasPrev: { type: 'boolean' },
              }
            }
          }
        },
        errors: { type: 'any' },
      });
    });
  });

  describe('エッジケースとストレステスト', () => {
    it('空のオブジェクトと配列', () => {
      const typeGen = new TypeGen();
      const data = {
        emptyObject: {},
        emptyArray: [],
        nullObject: null,
        undefinedObject: undefined
      };
      typeGen.assertDeep(data, {
        emptyObject: { type: 'EmptyObjectType' },
        emptyArray: { type: 'any[]' },
        nullObject: { type: 'any' },
        undefinedObject: { type: 'any' },
      });
    });

    it('特殊な文字を含むプロパティ名', () => {
      const typeGen = new TypeGen();
      const data = {
        "user-name": "john",
        "user_id": 123,
        "user.email": "john@example.com",
        "user@domain": "special",
        "🎯target": "emoji property",
        "123number": "starts with number"
      };
      typeGen.assertDeep(data, {
        "user-name": { type: 'string' },
        "user_id": { type: 'number' },
        "user.email": { type: 'string' },
        "user@domain": { type: 'string' },
        "🎯target": { type: 'string' },
        "123number": { type: 'string' },
      });
    });

    it('非常に大きなデータ構造', () => {
      const typeGen = new TypeGen();
      const data = {
        bigArray: Array.from({ length: 100 }, (_, i) => ({
          id: i,
          value: `item_${i}`,
          active: i % 2 === 0
        })),
        manyProperties: Object.fromEntries(
          Array.from({ length: 50 }, (_, i) => [`prop${i}`, i * 2])
        )
      };
      typeGen.assertDeep(data, {
        bigArray: { type: 'ContentType[]' },
        manyProperties: { type: 'ManyPropertiesType' },
      });
    });

    it('型の境界値テスト', () => {
      const typeGen = new TypeGen();
      const data = {
        numbers: {
          maxSafeInteger: Number.MAX_SAFE_INTEGER,
          minSafeInteger: Number.MIN_SAFE_INTEGER,
          infinity: Infinity,
          negativeInfinity: -Infinity,
          notANumber: NaN
        },
        strings: {
          veryLong: "x".repeat(10000),
          unicode: "🌟🎉🔥⚡🚀💎🎯🌈",
          newlines: "line1\nline2\r\nline3",
          tabs: "col1\tcol2\tcol3"
        }
      };
      typeGen.assertDeep(data, {
        numbers: {
          type: 'NumbersType', children: {
            maxSafeInteger: { type: 'number' },
            minSafeInteger: { type: 'number' },
            infinity: { type: 'number' },
            negativeInfinity: { type: 'number' },
            notANumber: { type: 'number' },
          }
        },
        strings: {
          type: 'StringsType', children: {
            veryLong: { type: 'string' },
            unicode: { type: 'string' },
            newlines: { type: 'string' },
            tabs: { type: 'string' },
          }
        }
      });
    });
  });

  describe('型混在の複雑なパターン', () => {
    it('同じプロパティ名での型混在', () => {
      const typeGen = new TypeGen();
      const data = [
        { value: 42 },
        { value: "hello" },
        { value: true },
        { value: null },
        { value: [1, 2, 3] },
        { value: { nested: "string" } }
      ];
      typeGen.assertDeep(data, {
        value: { type: 'number | string | boolean | any | number[] | ValueType' },
      });
    });

    it('配列内での複雑な型混在', () => {
      const typeGen = new TypeGen();
      const data = {
        mixedCollection: [
          42,
          "string",
          true,
          null,
          undefined,
          { objectProp: "value" },
          [1, 2, 3],
          ["a", "b", "c"],
          { differentProp: 123 }
        ]
      };
      typeGen.assertDeep(data, {
        mixedCollection: { type: 'any[]' },
      });
    });
  });
}); 