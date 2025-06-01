/**
 * Unicodeコードポイントを扱うためのクラス
 * 
 * このクラスでは以下の形式を扱います：
 * - 数値としてのコードポイント (例: 0x4E00, 19968)
 * - 文字列としてのコードポイント (例: 'U+4E00')
 * - 実際の文字 (例: '一')
 * 
 * 各形式間の変換を提供します。
 * 内部では常に数値として値を保持します。
 */
export class Codepoint {
  private readonly value: number;

  /**
   * コードポイントからインスタンスを生成します。
   * 引数の型に応じて適切に処理します：
   * - number: そのまま値として使用（16進数表記も10進数表記も同じ値）
   * - string (U+XXXX形式): 16進数に変換して使用
   * - string (その他): 文字のコードポイントとして使用
   * 
   * @example
   * new Codepoint(0x4E00)    // => 漢字「一」のコードポイント
   * new Codepoint(19968)     // => 漢字「一」のコードポイント（0x4E00と同じ）
   * new Codepoint('U+4E00')  // => 漢字「一」のコードポイント
   * new Codepoint('一')      // => 漢字「一」のコードポイント
   */
  constructor(input: number | string) {
    this.value = this.parseInput(input);
  }

  private parseInput(input: number | string): number {
    if (typeof input === 'number') {
      return this.validateCodepoint(input);
    }
    return this.parseString(input);
  }

  private parseString(str: string): number {
    if (str.startsWith('U+')) {
      return this.parseHexString(str);
    }
    return this.parseCharString(str);
  }

  private parseHexString(str: string): number {
    if (!/^U\+[0-9A-Fa-f]{4,6}$/.test(str)) {
      throw new Error("Invalid codepoint format. Expected 'U+XXXX'");
    }
    return this.validateCodepoint(parseInt(str.slice(2), 16));
  }

  private parseCharString(str: string): number {
    const code = str.codePointAt(0);
    if (code === undefined) {
      throw new Error("Empty string");
    }
    return this.validateCodepoint(code);
  }

  /**
   * Unicodeスカラー値（有効なコードポイント）かどうかを検証
   * 有効範囲: 0x0000–0xD7FF, 0xE000–0x10FFFF（サロゲート除く）
   * 
   * @example
   * this.validateCodepoint(0x4E00) // => 0x4E00 (漢字「一」のコードポイント)
   * this.validateCodepoint(0x6587) // => 0x6587 (漢字「文」のコードポイント)
   * this.validateCodepoint(0xD800) // => Error: Invalid Unicode codepoint (サロゲートペアの範囲)
   */
  private validateCodepoint(value: number): number {
    if (
      !Number.isInteger(value) ||
      value < 0 ||
      value > 0x10FFFF ||
      (value >= 0xD800 && value <= 0xDFFF)
    ) {
      throw new Error("Invalid Unicode codepoint");
    }
    return value;
  }

  /**
   * 内部で保持しているコードポイント値を取得します。
   * このメソッドは主にデバッグやテストで使用します。
   * 
   * @example
   * new Codepoint(0x4E00).getValue() // => 0x4E00
   * new Codepoint(0x6587).getValue() // => 0x6587
   */
  getValue(): number {
    return this.value;
  }

  /**
   * 16進数表記のコードポイントを取得します。
   * 
   * @example
   * new Codepoint(0x4E00).toHexString() // => '4E00'
   * new Codepoint(0x6587).toHexString() // => '6587'
   */
  toHexString(): string {
    return this.value.toString(16).toUpperCase();
  }

  /**
   * 10進数表記のコードポイントを取得します。
   * 
   * @example
   * new Codepoint(0x4E00).toDecimalString() // => '19968'
   * new Codepoint(0x6587).toDecimalString() // => '25991'
   */
  toDecimalString(): string {
    return this.value.toString();
  }

  /**
   * "U+XXXX"形式の文字列を取得します。
   * 
   * @example
   * new Codepoint(0x4E00).toString() // => 'U+4E00'
   * new Codepoint(0x6587).toString() // => 'U+6587'
   */
  toString(): string {
    return "U+" + this.toHexString();
  }

  /**
   * 文字を取得します。
   * 
   * @example
   * new Codepoint(0x4E00).toChar() // => '一'
   * new Codepoint(0x6587).toChar() // => '文'
   */
  toChar(): string {
    return String.fromCodePoint(this.value);
  }

  /**
   * 他のCodepointインスタンスと等しいかどうかを判定します。
   * 
   * @example
   * new Codepoint(0x4E00).equals(new Codepoint('一')) // => true
   * new Codepoint(0x4E00).equals(new Codepoint('文')) // => false
   */
  equals(other: Codepoint): boolean {
    return this.value === other.value;
  }
}
