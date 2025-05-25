# kanji-inspector

UnihanデータをTypeScriptで扱いやすくパース・型化するnpmパッケージ

## インストール

```
npm install kanji-inspector
```

## 使い方

```ts
import { parseUnihanDictionaryLikeData } from 'kanji-inspector';

const data = parseUnihanDictionaryLikeData();
console.log(data);
```

## ビルド

```
npm run build
```

## テスト

```
npm test
```
