import { Codepoint } from '@common/Codepoint';
import { describe, it, assert } from './test';

/**
 * @example
 * U+3400 𴐀 IRGSources(Unihan) で一番前にある漢字
 * U+323AF 𓎯 IRGSources(Unihan) で一番後ろにある漢字
 * 0x4E00 一 一番の一
 * 0x6587 文 文章の文
 * 0x3106c 𱁬 日本語で一番画数多い漢字
 * 0x10FFFF 𯿽 最大のコードポイント
 */
describe("Codepoint", () => {
  describe("コンストラクタ", () => {
    it("数値から生成", () => {
      assert.strictEqual(new Codepoint(0x4E00).getValue(), 0x4E00);
      assert.strictEqual(new Codepoint(19968).getValue(), 0x4E00);
      assert.strictEqual(new Codepoint(0x6587).getValue(), 0x6587);
    });

    it("U+形式の文字列から生成", () => {
      assert.strictEqual(new Codepoint("U+4E00").getValue(), 0x4E00);
      assert.strictEqual(new Codepoint("U+6587").getValue(), 0x6587);
    });

    it("文字から生成", () => {
      assert.strictEqual(new Codepoint("一").getValue(), 0x4E00);
      assert.strictEqual(new Codepoint("文").getValue(), 0x6587);
    });

    it("無効な入力でエラー", () => {
      assert.throws(() => new Codepoint("U+XXXX"), /Invalid codepoint format/);
      assert.throws(() => new Codepoint(""), /Empty string/);
      assert.throws(() => new Codepoint(-1), /Invalid Unicode codepoint/);
      assert.throws(() => new Codepoint(0x110000), /Invalid Unicode codepoint/);
      assert.throws(() => new Codepoint(0xD800), /Invalid Unicode codepoint/);
    });
  });

  describe("変換メソッド", () => {
    it("toHexString", () => {
      assert.strictEqual(new Codepoint(0x4E00).toHexString(), "4E00");
      assert.strictEqual(new Codepoint(0x6587).toHexString(), "6587");
    });

    it("toDecimalString", () => {
      assert.strictEqual(new Codepoint(0x4E00).toDecimalString(), "19968");
      assert.strictEqual(new Codepoint(0x6587).toDecimalString(), "25991");
    });

    it("toString", () => {
      assert.strictEqual(new Codepoint(0x4E00).toString(), "U+4E00");
      assert.strictEqual(new Codepoint(0x6587).toString(), "U+6587");
    });

    it("toChar", () => {
      assert.strictEqual(new Codepoint(0x4E00).toChar(), "一");
      assert.strictEqual(new Codepoint(0x6587).toChar(), "文");
    });
  });

  describe("境界値のテスト", () => {
    it("最小値", () => {
      const min = new Codepoint(0x0000);
      assert.strictEqual(min.getValue(), 0x0000);
      assert.strictEqual(min.toHexString(), "0");
      assert.strictEqual(min.toDecimalString(), "0");
      assert.strictEqual(min.toString(), "U+0");
      assert.strictEqual(min.toChar(), "\u0000");

      // 文字列からの生成も確認
      assert.strictEqual(new Codepoint("U+0000").getValue(), 0x0000);
      assert.strictEqual(new Codepoint("\u0000").getValue(), 0x0000);
    });

    it("最大値", () => {
      const max = new Codepoint(0x10FFFF);
      assert.strictEqual(max.getValue(), 0x10FFFF);
      assert.strictEqual(max.toHexString(), "10FFFF");
      assert.strictEqual(max.toDecimalString(), "1114111");
      assert.strictEqual(max.toString(), "U+10FFFF");
      assert.strictEqual(max.toChar(), "\u{10FFFF}");

      // 文字列からの生成も確認
      assert.strictEqual(new Codepoint("U+10FFFF").getValue(), 0x10FFFF);
      assert.strictEqual(new Codepoint("\u{10FFFF}").getValue(), 0x10FFFF);

      // 10進数からの生成も確認
      assert.strictEqual(new Codepoint(1114111).getValue(), 0x10FFFF);
    });

    it("最大値の前後の値", () => {
      // 最大値の1つ前
      const beforeMax = new Codepoint(0x10FFFE);
      assert.strictEqual(beforeMax.getValue(), 0x10FFFE);
      assert.strictEqual(beforeMax.toHexString(), "10FFFE");
      assert.strictEqual(beforeMax.toDecimalString(), "1114110");
      assert.strictEqual(beforeMax.toString(), "U+10FFFE");
      assert.strictEqual(beforeMax.toChar(), "\u{10FFFE}");

      // 最大値の2つ前
      const twoBeforeMax = new Codepoint(0x10FFFD);
      assert.strictEqual(twoBeforeMax.getValue(), 0x10FFFD);
      assert.strictEqual(twoBeforeMax.toHexString(), "10FFFD");
      assert.strictEqual(twoBeforeMax.toDecimalString(), "1114109");
      assert.strictEqual(twoBeforeMax.toString(), "U+10FFFD");
      assert.strictEqual(twoBeforeMax.toChar(), "\u{10FFFD}");
    });

    it("サロゲートペアの境界", () => {
      // サロゲートペアの直前
      assert.strictEqual(new Codepoint(0xD7FF).getValue(), 0xD7FF);
      assert.strictEqual(new Codepoint(0xD7FF).toChar(), "\uD7FF");

      // サロゲートペアの直後
      assert.strictEqual(new Codepoint(0xE000).getValue(), 0xE000);
      assert.strictEqual(new Codepoint(0xE000).toChar(), "\uE000");

      // サロゲートペアの範囲は無効
      assert.throws(() => new Codepoint(0xD800), /Invalid Unicode codepoint/);
      assert.throws(() => new Codepoint(0xDFFF), /Invalid Unicode codepoint/);
    });
  });

  describe("equals", () => {
    it("同じ値のインスタンスは等しい", () => {
      const cp1 = new Codepoint(0x4E00);
      const cp2 = new Codepoint(0x4E00);
      const cp3 = new Codepoint("一");
      const cp4 = new Codepoint("U+4E00");
      assert.strictEqual(cp1.equals(cp2), true);
      assert.strictEqual(cp1.equals(cp3), true);
      assert.strictEqual(cp1.equals(cp4), true);
    });

    it("異なる値のインスタンスは等しくない", () => {
      const cp1 = new Codepoint(0x4E00);
      const cp2 = new Codepoint(0x6587);
      assert.strictEqual(cp1.equals(cp2), false);
    });
  });

  describe('最大値のテスト', () => {
    it("'U+10FFFF'から生成したCodepointのtoString()が'U+10FFFF'になる", () => {
      const max = 'U+10FFFF';
      const cp = new Codepoint(max);
      assert.equal(cp.toString(), max);
      assert.equal(cp.toHexString(), '10FFFF');
    });
  });
}); 