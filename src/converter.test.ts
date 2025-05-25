import { toCodepointString, toCodepointStrings, getUnihanDataArray } from './converter';
import { iRGSources } from './data/IRGSources';

describe('toCodepointString', () => {
  it('1文字の漢字をU+xxxx形式に変換', () => {
    expect(toCodepointString('漢')).toBe('U+6F22');
    expect(toCodepointString('字')).toBe('U+5B57');
  });
});

describe('toCodepointStrings', () => {
  it('文字列をU+xxxx配列に変換', () => {
    expect(toCodepointStrings('漢字')).toEqual(['U+6F22', 'U+5B57']);
    expect(toCodepointStrings(['漢', '字'])).toEqual(['U+6F22', 'U+5B57']);
  });
});

describe('getUnihanDataArray', () => {
  it('iRGSourcesからデータ配列を取得', () => {
    const arr = getUnihanDataArray(iRGSources, '漢字');
    expect(Array.isArray(arr)).toBe(true);
    expect(arr.length).toBe(2);

    // データが存在しない場合はundefined
    expect(arr[0]).toBeDefined();
    expect(arr[1]).toBeDefined();

    expect(arr[0]?.kTotalStrokes).toBe('14'); // 漢は14画
    expect(arr[1]?.kTotalStrokes).toBe('6'); // 字は6画
  });
}); 