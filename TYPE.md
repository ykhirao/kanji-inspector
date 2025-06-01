# Type Definitions / 型定義

## DictionaryIndexType / 辞書インデックス情報

```tsx
/**
 * Dictionary index information for kanji characters.
 * Contains references to various dictionary entries and indices.
 *
 * 漢字の辞書インデックス情報。
 * 各種辞書の参照情報とインデックスを含みます。
 */
export type DictionaryIndexType = {
  codepoint: number; // Unicode codepoint / Unicodeコードポイント
  kHanYu?: string; // Hanyu Da Zidian reference / 漢語大字典参照
  kIRGHanyuDaZidian?: string; // IRG Hanyu Da Zidian reference / IRG漢語大字典参照
  kIRGKangXi?: string; // KangXi dictionary reference / 康煕字典参照
  kKangXi?: string; // KangXi dictionary reference / 康煕字典参照
  kMorohashi?: string; // Morohashi dictionary reference / 諸橋字典参照
  kCihaiT?: string; // Cihai dictionary reference / 辞海参照
  kSBGY?: string; // Song Ben Guang Yun reference / 宋本広韻参照
  kNelson?: string; // Nelson dictionary reference / ネルソン字典参照
  kCowles?: string; // Cowles dictionary reference / カウルズ字典参照
  kMatthews?: string; // Matthews dictionary reference / マシューズ字典参照
  kGSR?: string; // GSR dictionary reference / GSR字典参照
  kFennIndex?: string; // Fenn index reference / フェン索引参照
  kKarlgren?: string; // Karlgren dictionary reference / カールグレン字典参照
  kSMSZD2003Index?: string; // SMSZD2003 index reference / SMSZD2003索引参照
  kMeyerWempe?: string; // Meyer-Wempe dictionary reference / メイヤー・ウェンペ字典参照
  kLau?: string; // Lau dictionary reference / ラウ字典参照
  kCheungBauerIndex?: string; // Cheung-Bauer index reference / チュン・バウアー索引参照
  kDaeJaweon?: string; // Dae Jaweon dictionary reference / 大字典参照
  kIRGDaeJaweon?: string; // IRG Dae Jaweon reference / IRG大字典参照
};
```

## DictionaryLikeDatumType / 辞書類似データ

```tsx
/**
 * Dictionary-like data for kanji characters.
 * Contains various character information and metadata.
 *
 * 漢字の辞書類似データ。
 * 文字に関する様々な情報とメタデータを含みます。
 */
export type DictionaryLikeDatumType = {
  codepoint: number; // Unicode codepoint / Unicodeコードポイント
  kCangjie?: string; // Cangjie input method code / 倉頡入力コード
  kMojiJoho?: string; // Moji Joho information / 文字情報
  kStrange?: string; // Strange character information / 特殊文字情報
  kPhonetic?: string; // Phonetic information / 音声情報
  kFenn?: string; // Fenn dictionary information / フェン字典情報
  kUnihanCore2020?: string; // Unihan Core 2020 information / Unihan Core 2020情報
  kFourCornerCode?: string; // Four corner code / 四角号碼
  kCheungBauer?: string; // Cheung-Bauer information / チュン・バウアー情報
  kAlternateTotalStrokes?: string; // Alternate stroke count / 代替画数
  kGradeLevel?: string; // Grade level / 学年レベル
  kHDZRadBreak?: string; // HDZ radical break / HDZ部首区切り
  kHKGlyph?: string; // Hong Kong glyph / 香港字形
};
```

## IRGSourceType / IRG ソース情報

```tsx
/**
 * IRG (Ideographic Research Group) source information for kanji characters.
 * Contains references to various IRG sources and standards.
 *
 * 漢字のIRG（表意文字研究グループ）ソース情報。
 * 各種IRGソースと標準規格の参照情報を含みます。
 */
export type IRGSourceType = {
  codepoint: number; // Unicode codepoint / Unicodeコードポイント
  kIRG_GSource?: string; // IRG G source reference / IRG Gソース参照
  kIRG_JSource?: string; // IRG J source reference / IRG Jソース参照
  kIRG_TSource?: string; // IRG T source reference / IRG Tソース参照
  kRSUnicode: string; // Unicode radical-stroke / Unicode部首・画数
  kIRG_KSource?: string; // IRG K source reference / IRG Kソース参照
  kTotalStrokes?: string; // Total stroke count / 総画数
  kIRG_KPSource?: string; // IRG KP source reference / IRG KPソース参照
  kIRG_VSource?: string; // IRG V source reference / IRG Vソース参照
  kIRG_HSource?: string; // IRG H source reference / IRG Hソース参照
  kIRG_USource?: string; // IRG U source reference / IRG Uソース参照
  kIICore?: string; // IICore reference / IICore参照
  kIRG_MSource?: string; // IRG M source reference / IRG Mソース参照
  kIRG_UKSource?: string; // IRG UK source reference / IRG UKソース参照
  kCompatibilityVariant?: string; // Compatibility variant / 互換異体字
  kIRG_SSource?: string; // IRG S source reference / IRG Sソース参照
};
```

## NumericValueType / 数値情報

```tsx
/**
 * Numeric value information for kanji characters.
 * Contains various numeric representations and values.
 *
 * 漢字の数値情報。
 * 様々な数値表現と値を含みます。
 */
export type NumericValueType = {
  codepoint: number; // Unicode codepoint / Unicodeコードポイント
  kOtherNumeric?: string; // Other numeric value / その他の数値
  kVietnameseNumeric?: string; // Vietnamese numeric value / ベトナム語数値
  kZhuangNumeric?: string; // Zhuang numeric value / 壮語数値
  kPrimaryNumeric?: string; // Primary numeric value / 主要数値
  kAccountingNumeric?: string; // Accounting numeric value / 会計数値
};
```

## OtherMappingType / その他のマッピング

```tsx
/**
 * Other mapping information for kanji characters.
 * Contains various character mappings and encodings.
 *
 * 漢字のその他のマッピング情報。
 * 様々な文字マッピングとエンコーディングを含みます。
 */
export type OtherMappingType = {
  codepoint: number; // Unicode codepoint / Unicodeコードポイント
  kJIS0213?: string; // JIS X 0213 mapping / JIS X 0213マッピング
  kTGH?: string; // TGH mapping / TGHマッピング
  kKoreanName?: string; // Korean name / 韓国語名
  kEACC?: string; // EACC mapping / EACCマッピング
  kTaiwanTelegraph?: string; // Taiwan Telegraph mapping / 台湾電報マッピング
  kJa?: string; // Japanese mapping / 日本語マッピング
  kBigFive?: string; // Big Five mapping / Big Fiveマッピング
  kCCCII?: string; // CCCII mapping / CCCIIマッピング
  kCNS1986?: string; // CNS 1986 mapping / CNS 1986マッピング
  kCNS1992?: string; // CNS 1992 mapping / CNS 1992マッピング
  kGB0?: string; // GB 0 mapping / GB 0マッピング
  kGB1?: string; // GB 1 mapping / GB 1マッピング
  kJis0?: string; // JIS 0 mapping / JIS 0マッピング
  kJoyoKanji?: string; // Joyo kanji / 常用漢字
  kKoreanEducationHanja?: string; // Korean education hanja / 韓国教育漢字
  kMainlandTelegraph?: string; // Mainland Telegraph mapping / 中国電報マッピング
  kXerox?: string; // Xerox mapping / Xeroxマッピング
  kGB5?: string; // GB 5 mapping / GB 5マッピング
  kJis1?: string; // JIS 1 mapping / JIS 1マッピング
  kPseudoGB1?: string; // Pseudo GB1 mapping / 疑似GB1マッピング
  kGB3?: string; // GB 3 mapping / GB 3マッピング
  kGB8?: string; // GB 8 mapping / GB 8マッピング
  kJinmeiyoKanji?: string; // Jinmeiyo kanji / 人名用漢字
  kIBMJapan?: string; // IBM Japan mapping / IBM Japanマッピング
  kGB7?: string; // GB 7 mapping / GB 7マッピング
};
```

## RadicalStrokeCountType / 部首・画数

```tsx
/**
 * Radical and stroke count information for kanji characters.
 * Contains information about character components and stroke counts.
 *
 * 漢字の部首・画数情報。
 * 文字の構成要素と画数に関する情報を含みます。
 */
export type RadicalStrokeCountType = {
  codepoint: number; // Unicode codepoint / Unicodeコードポイント
  kRSAdobe_Japan1_6: string; // Adobe Japan1-6 radical-stroke / Adobe Japan1-6部首・画数
};
```

## ReadingType / 読み方情報

```tsx
/**
 * Reading information for kanji characters.
 * Contains various pronunciations and readings in different languages.
 *
 * 漢字の読み方情報。
 * 様々な言語での発音と読み方を含みます。
 */
export type ReadingType = {
  codepoint: number; // Unicode codepoint / Unicodeコードポイント
  kCantonese?: string; // Cantonese reading / 広東語読み
  kDefinition?: string; // Definition / 定義
  kJapanese?: string; // Japanese reading / 日本語読み
  kMandarin?: string; // Mandarin reading / 北京語読み
  kFanqie?: string; // Fanqie reading / 反切読み
  kHanyuPinyin?: string; // Hanyu Pinyin / 漢語拼音
  kTGHZ2013?: string; // TGHZ2013 reading / TGHZ2013読み
  kXHC1983?: string; // XHC1983 reading / XHC1983読み
  kVietnamese?: string; // Vietnamese reading / ベトナム語読み
  kSMSZD2003Readings?: string; // SMSZD2003 readings / SMSZD2003読み
  kHangul?: string; // Korean reading / 韓国語読み
  kTang?: string; // Tang dynasty reading / 唐音
  kJapaneseKun?: string; // Japanese kun reading / 日本語訓読み
  kJapaneseOn?: string; // Japanese on reading / 日本語音読み
  kHanyuPinlu?: string; // Hanyu Pinyin frequency / 漢語拼音頻度
  kKorean?: string; // Korean reading / 韓国語読み
  kZhuang?: string; // Zhuang reading / 壮語読み
};
```

## VariantType / 異体字情報

```tsx
/**
 * Variant information for kanji characters.
 * Contains information about different character variants and forms.
 *
 * 漢字の異体字情報。
 * 様々な文字の異体字と字形に関する情報を含みます。
 */
export type VariantType = {
  codepoint: number; // Unicode codepoint / Unicodeコードポイント
  kSemanticVariant?: string; // Semantic variant / 意味的異体字
  kSpoofingVariant?: string; // Spoofing variant / なりすまし異体字
  kTraditionalVariant?: string; // Traditional variant / 繁体字異体字
  kSimplifiedVariant?: string; // Simplified variant / 簡体字異体字
  kSpecializedSemanticVariant?: string; // Specialized semantic variant / 専門的意味的異体字
  kZVariant?: string; // Z-variant / Z異体字
};
```
