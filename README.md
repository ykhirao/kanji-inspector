# kanji-inspector

UnihanデータをSQLiteデータベースとして利用できるnpmパッケージです。

* [npm - kanji-inspector](https://www.npmjs.com/package/kanji-inspector)
* [GitHub - kanji-inspector](https://github.com/ykhirao/kanji-inspector)
  * [type docs](https://github.com/ykhirao/kanji-inspector/blob/main/TYPE.md)

## 特徴
- [Unihan](https://www.unicode.org/charts/unihan.html) の主要テキストファイルを自動パースし、SQLiteデータベースとして利用可能
- コードポイントは文字、数値、U+形式など様々な形式で指定可能
- 単一データ取得と一括データ取得の両方に対応
- 非同期処理（Promise）ベースのAPI
- MITライセンス

## インストール

```bash
$ npm install kanji-inspector
```

## 型情報・エクスポート例

```typescript
import {
  // Type definitions / 型定義
  DictionaryIndexType,      // Dictionary index information / 辞書インデックス情報
  DictionaryLikeDatumType,  // Dictionary-like data / 辞書類似データ
  IRGSourceType,           // IRG source information / IRGソース情報
  NumericValueType,        // Numeric values / 数値情報
  OtherMappingType,        // Other mappings / その他のマッピング
  RadicalStrokeCountType,  // Radical and stroke count / 部首・画数
  ReadingType,             // Reading information / 読み方情報
  VariantType,             // Variant information / 異体字情報

  // Utility class / ユーティリティクラス
  Codepoint,               // Codepoint conversion utility / コードポイント変換ユーティリティ

  // Data retrieval functions / データ取得関数
  getKanjiDetail,          // Get detailed kanji information / 漢字の詳細情報を取得
  getKanjiDetailList,      // Get multiple kanji details / 複数の漢字の詳細を取得
  getDictionaryIndex,      // Get dictionary index / 辞書インデックスを取得
  getDictionaryLikeData,   // Get dictionary-like data / 辞書類似データを取得
  getIRGSource,           // Get IRG source / IRGソースを取得
  getNumericValue,        // Get numeric value / 数値を取得
  getOtherMapping,        // Get other mapping / その他のマッピングを取得
  getRadicalStrokeCount,  // Get radical and stroke count / 部首・画数を取得
  getReading,             // Get reading / 読み方を取得
  getVariant,             // Get variant / 異体字を取得

  // Bulk data retrieval functions / 一括データ取得関数
  getDictionaryIndices,    // Get multiple dictionary indices / 複数の辞書インデックスを取得
  getDictionaryLikeDataList, // Get multiple dictionary-like data / 複数の辞書類似データを取得
  getIRGSources,          // Get multiple IRG sources / 複数のIRGソースを取得
  getNumericValues,       // Get multiple numeric values / 複数の数値を取得
  getOtherMappings,       // Get multiple other mappings / 複数のその他のマッピングを取得
  getRadicalStrokeCounts, // Get multiple radical and stroke counts / 複数の部首・画数を取得
  getReadings,            // Get multiple readings / 複数の読み方を取得
  getVariants,            // Get multiple variants / 複数の異体字を取得

  // Other functions / その他の関数
  getAvailableTables,     // Get available table names / 利用可能なテーブル名を取得
  closeDatabase,          // Close database connection / データベース接続を閉じる
  closeTableConnection    // Close specific table connection / 特定のテーブル接続を閉じる
} from 'kanji-inspector';

// 単一の漢字の詳細情報を取得
const kanjiDetail = await getKanjiDetail('漢');
console.log(kanjiDetail);
// {
//   codepoint: 28450,
//   dictionaryIndex: { ... },
//   dictionaryLikeData: { ... },
//   iRGSource: { ... },
//   numericValue: { ... },
//   otherMapping: { ... },
//   radicalStrokeCount: { ... },
//   reading: { ... },
//   variant: { ... }
// }

// 複数の漢字の詳細情報を一括取得
const kanjiDetails = await getKanjiDetailList(['漢', '字', '文']);

// コードポイントの変換
const codepoint = new Codepoint('漢');
console.log(codepoint.getValue());  // 28450
console.log(codepoint.toString());  // 'U+6F22'
```

### 型定義例

```typescript
// Dictionary index information / 辞書インデックス情報
export type DictionaryIndexType = {
  codepoint: number;              // Unicode codepoint / Unicodeコードポイント
  kHanYu?: string;               // Hanyu Da Zidian reference / 漢語大字典参照
  kIRGHanyuDaZidian?: string;    // IRG Hanyu Da Zidian reference / IRG漢語大字典参照
  kIRGKangXi?: string;           // KangXi dictionary reference / 康煕字典参照
}

// Reading information / 読み方情報
export type ReadingType = {
  codepoint: number;              // Unicode codepoint / Unicodeコードポイント
  kCantonese?: string;           // Cantonese reading / 広東語読み
  kDefinition?: string;          // Definition / 定義
  kHangul?: string;              // Korean reading / 韓国語読み
  kHanyuPinlu?: string;          // Hanyu Pinyin frequency / 漢語拼音頻度
  kHanyuPinyin?: string;         // Hanyu Pinyin / 漢語拼音
  kJapaneseKun?: string;         // Japanese kun reading / 日本語訓読み
  kJapaneseOn?: string;          // Japanese on reading / 日本語音読み
  kKorean?: string;              // Korean reading / 韓国語読み
  kMandarin?: string;            // Mandarin reading / 北京語読み
  kTang?: string;                // Tang dynasty reading / 唐音
  kTGHZ2013?: string;            // TGHZ2013 reading / TGHZ2013読み
  kVietnamese?: string;          // Vietnamese reading / ベトナム語読み
  kXHC1983?: string;             // XHC1983 reading / XHC1983読み
}
```

## ライセンス

このライブラリは [MIT License](./LICENSE) のもとで公開されています。

このライブラリは [Unicode Consortium](https://www.unicode.org/) によって提供されている  
[Unihan Database](https://www.unicode.org/charts/unihan.html) のデータを利用しています。  
Unihan データは [Unicode Terms of Use](https://www.unicode.org/copyright.html) に従って使用されています。

> © 1991–2025 Unicode, Inc. All rights reserved.  
> The Unicode Consortium makes no expressed or implied warranty of any kind, and assumes no liability for errors or omissions.

本ライブラリの提供者は、Unihanデータをもとに細心の注意を払って使いやすい形に加工・整備していますが、  
データの欠損や誤り、不具合などに関して一切の責任を負いかねます。  
利用者ご自身の判断と責任においてご利用ください。
