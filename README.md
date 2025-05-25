# kanji-inspector

UnihanデータをTypeScript型・定数としてnpmパッケージ化したライブラリです。

[npm - kanji-inspector](https://www.npmjs.com/package/kanji-inspector)
[GitHub - kanji-inspector](https://github.com/ykhirao/kanji-inspector)

## 特徴
- [Unihan](https://www.unicode.org/charts/unihan.html) の主要テキストファイルを自動パースし、型・データとして利用可能
- すべてのcodepoint（U+xxxx形式）を網羅した `CodepointType` ユニオン型を自動生成
- 各種データ・型は `src/data/` 配下のTypeScriptファイルとして分離
- 必要なデータ・型だけ個別import可能、default exportで一括利用も可能
- MITライセンス

## インストール

```
npm install kanji-inspector
```

## 型情報・エクスポート例

- `CodepointType` … すべてのU+xxxx形式のユニオン型
- `DictionaryIndices` … 各codepointごとの辞書インデックス情報
- `DictionaryIndicesType` … その型定義
- 他、`DictionaryLikeData`, `IRGSources`, `NumericValues`, `OtherMappings`, `RadicalStrokeCounts`, `Readings`, `Variants` など

```ts
import {
  CodepointType,
  DictionaryIndices,
  DictionaryIndices,
  // ...他の型・データ
} from 'kanji-inspector';

// すべてまとめて使いたい場合
import Unihan from 'kanji-inspector';
console.log(Unihan.dictionaryIndices['U+3400']);
```

### 型定義例

```ts
export type DictionaryIndices = {
  [codepoint in CodepointType]?: {
    kHanYu?: string;
    kIRGHanyuDaZidian?: string;
    // ...他のフィールド
  }
}

export type CodepointType =
  'U+3400' |
  'U+3401' |
  ... // すべてのU+xxxx
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
