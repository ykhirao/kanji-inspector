import { dictionaryIndices } from "./data/DictionaryIndices";

/**
 * 1文字の漢字から 'U+xxxx' 形式のコードポイント文字列を返す
 * @param char 1文字の漢字
 * @returns 例: 'U+3400'
 */
export function toCodepointString(char: string): string {
  if (!char || char.length === 0) throw new Error('空文字です');
  const code = char.codePointAt(0);
  if (code === undefined) throw new Error('不正な文字です');
  return 'U+' + code.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * 文字列または文字配列から 'U+xxxx' 形式のコードポイント文字列配列を返す
 * @param chars 文字列または文字配列
 * @returns 例: ['U+6F22', 'U+5B57']
 */
export function toCodepointStrings(chars: string | string[]): string[] {
  if (typeof chars === 'string') {
    return Array.from(chars).map(toCodepointString);
  }
  return chars.map(toCodepointString);
}

/**
 * Unihanデータ型と文字列を受け取り、各漢字のデータを配列で返す
 * @param data Unihanデータ（例: DictionaryIndices）
 * @param chars 文字列または文字配列
 * @returns 各漢字に対応するデータの配列
 */
export function getUnihanDataArray<
  T extends Record<string, any>,
  V = T extends Record<string, infer U> ? U : never
>(
  data: T,
  chars: string | string[]
): (V | undefined)[] {
  const cps = toCodepointStrings(chars);
  return cps.map(cp => data[cp]);
}
