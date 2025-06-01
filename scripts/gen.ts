// データディレクトリからすべてのファイル一覧を取得する
// ループで処理をする

/**
 * ファイルはテキストファイル
 * ファイル名はデータ名
 * 一行ごとに codepoint と key と valueがはいっている
 * @example
 * U+3400	kHanYu	10015.030
 * U+3400	kIRGHanyuDaZidian	10015.030
 * U+3400	kKangXi	0078.010
 * U+3400	kMorohashi	00034
 * U+3401	kCihaiT	37.103
 *
 * 最終的には以下のようなJSONデータにしてほしい
 * [{
 *   codepoint: 'U+3400',
 *   kHanYu: '10015.030',
 *   kIRGHanyuDaZidian: '10015.030',
 * }, {
 *   codepoint: 'U+3400',
 *   kKangXi: '0078.010',
 *   kMorohashi: '00034'
 * }]
 * 
 * このときループをまわして同じコードポイントにkHanYuが複数あった場合
 * kHanYu は配列として格納したいのでエラーを吐き出し終了する
 * const ARRAY_KEY = [ファイル名.kHanYu]; みたいな形でファイルの先頭に追加して処理をやりなおす
 * 
 * 最終的なデータ構造を typescript の型として出力してほしい
 */

// とりあえずデータディレクトリからすべてのファイルを読み込んで、ファイル名をキーにしてデータを格納する

import fs from 'fs';
import path from 'path';
import { TypeGen } from '../common/TypeGen';
import pluralize from 'pluralize';
import { Codepoint } from '../common/Codepoint';

// データディレクトリのパス
const DATA_DIR = path.join(process.cwd(), 'data', 'unihan');

// データを格納するマップ
const dataMap = new Map<string, Record<string, string | string[] | number>>();

// 重複を検出したキーを記録するセット
const duplicateKeys = new Set<string>();

// 配列が検出された情報を記録するマップ
const arrayDetections = new Map<string, { codepoint: string; key: string; values: string[] }[]>();

// 配列として扱うキーを記録するセット
const arrayKeys = new Set<string>();

// ファイルを読み込んでデータを処理する関数
function processFile(filePath: string) {
  const fileName = path.basename(filePath);
  console.log(`処理中: ${fileName}`);

  const lines = fs.readFileSync(filePath, 'utf-8').split('\n');

  for (const line of lines) {
    if (!line.trim()) continue;

    const [codepoint, key, value] = line.split('\t');
    if (!codepoint || !key || !value) continue;

    // codepointを数値に変換
    const codepointValue = new Codepoint(codepoint).getValue();

    // データマップに追加
    if (!dataMap.has(codepoint)) {
      dataMap.set(codepoint, { codepoint: codepointValue });
    }

    const data = dataMap.get(codepoint)!;
    const isArrayKey = arrayKeys.has(key) || duplicateKeys.has(key);

    if (isArrayKey) {
      // 配列キーの場合
      if (!data[key]) {
        data[key] = [value];
      } else if (Array.isArray(data[key])) {
        (data[key] as string[]).push(value);
        // 配列が検出された情報を記録
        if (!arrayDetections.has(fileName)) {
          arrayDetections.set(fileName, []);
        }
        const detections = arrayDetections.get(fileName)!;
        const existingDetection = detections.find(d => d.codepoint === codepoint && d.key === key);
        if (existingDetection) {
          existingDetection.values = data[key] as string[];
        } else {
          detections.push({
            codepoint,
            key,
            values: data[key] as string[]
          });
        }
      } else {
        // 非配列から配列に変換
        const oldValue = data[key] as string;
        data[key] = [oldValue, value];
        // 配列が検出された情報を記録
        if (!arrayDetections.has(fileName)) {
          arrayDetections.set(fileName, []);
        }
        arrayDetections.get(fileName)!.push({
          codepoint,
          key,
          values: [oldValue, value]
        });
      }
    } else {
      // 通常のキーの場合
      if (data[key]) {
        // 重複を検出した場合、配列として扱うように設定
        duplicateKeys.add(key);
        arrayKeys.add(key); // このキーを配列キーとして記録
        const oldValue = data[key] as string;
        data[key] = [oldValue, value];
        // 配列が検出された情報を記録
        if (!arrayDetections.has(fileName)) {
          arrayDetections.set(fileName, []);
        }
        arrayDetections.get(fileName)!.push({
          codepoint,
          key,
          values: [oldValue, value]
        });
      } else {
        data[key] = value;
      }
    }
  }
}

// メインの処理
function main() {
  try {
    // データディレクトリ内のすべてのファイルを処理
    const files = fs.readdirSync(DATA_DIR);
    let allTypeDefinitions = '';

    console.log(`データディレクトリ: ${DATA_DIR}`);
    console.log(`見つかったファイル: ${files.length}`);

    for (const file of files) {
      if (file.endsWith('.txt')) {
        // 重複キーのセットをクリア
        duplicateKeys.clear();
        // データマップをクリア
        dataMap.clear();
        // 配列検出情報をクリア
        arrayDetections.clear();
        // 配列キーをクリア
        arrayKeys.clear();

        // ファイルを処理
        processFile(path.join(DATA_DIR, file));

        // データを配列に変換
        const data = Array.from(dataMap.values());
        console.log(`${file} のデータ数: ${data.length}`);
        if (duplicateKeys.size > 0) {
          console.log(`配列として扱うキー: ${Array.from(duplicateKeys).join(', ')}`);
        }

        // 配列が検出された情報を出力
        const detections = arrayDetections.get(file);
        if (detections && detections.length > 0) {
          console.log('\n配列が検出されたデータ:');
          detections.forEach(detection => {
            console.log(`  ファイル: ${file}`);
            console.log(`  コードポイント: ${detection.codepoint}`);
            console.log(`  キー: ${detection.key}`);
            console.log(`  値: ${detection.values.join(', ')}`);
            console.log('---');
          });
        }

        // ファイル名から型名を生成
        const baseName = path.basename(file, '.txt');
        const singularName = pluralize.singular(baseName);
        const rootTypeName = `${baseName}Type`;
        const arrayElementTypeName = `${singularName}Type`;

        // TypeGenを使用して型定義を生成
        const typeGen = new TypeGen({
          rootTypeName,
          arrayElementTypeName
        });
        const typeDefinition = typeGen.generate(data);

        // 型定義を追加
        allTypeDefinitions += `\n// ${file} の型定義\nexport ${typeDefinition}\n`;

        // データをJSONファイルとして出力
        const jsonOutputDir = path.join(process.cwd(), 'data', 'json');
        if (!fs.existsSync(jsonOutputDir)) {
          fs.mkdirSync(jsonOutputDir, { recursive: true });
        }
        fs.writeFileSync(
          path.join(jsonOutputDir, `${baseName}.json`),
          JSON.stringify(data, null, 2)
        );
      }
    }

    // すべての型定義を1つのファイルに出力
    const typeOutputDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(typeOutputDir)) {
      fs.mkdirSync(typeOutputDir, { recursive: true });
    }
    fs.writeFileSync(
      path.join(typeOutputDir, 'UnihanType.ts'),
      allTypeDefinitions
    );

    console.log('データの生成が完了しました');
  } catch (error) {
    console.error('エラーが発生しました:', error);
    process.exit(1);
  }
}

main();

