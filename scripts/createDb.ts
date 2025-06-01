// data/db/createDb.ts にSQlite3 のDBにデータをいれていくスクリプトをかいてほしい
// dataは data/db/json にある
// 型は data/UnihanType.ts にある
// 型はファイル名と対応されている。単数形とかがかがあれだけど

import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';

// データディレクトリのパス
const DATA_DIR = path.join(process.cwd(), 'data', 'json');
const DB_DIR = path.join(process.cwd(), 'src', 'db');

// 型からテーブル定義を生成
function generateTableSQL(data: any[], tableName: string): string {
  if (data.length === 0) {
    throw new Error(`データが空です: ${tableName}`);
  }

  const columns = Object.keys(data[0])
    .filter(key => key !== 'codepoint')
    .map(key => `${key} TEXT`)
    .join(', ');

  const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (codepoint INTEGER PRIMARY KEY, ${columns})`;
  console.log('生成されたSQL:', sql);
  return sql;
}

// データベースの初期化
async function initializeDatabase(tableName: string, tableSQL: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const dbPath = path.join(DB_DIR, `${tableName}.db`);
    
    // 既存のデータベースファイルを削除
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }

    const db = new sqlite3.Database(dbPath);

    db.serialize(() => {
      // テーブルの作成
      db.run(tableSQL, (err) => {
        if (err) {
          reject(err);
          return;
        }

        // インデックスの作成
        db.run(`CREATE INDEX IF NOT EXISTS ${tableName}_codepoint_idx ON ${tableName} (codepoint)`, (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      });
    });
  });
}

// データの挿入
async function insertData(tableName: string, data: any[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const dbPath = path.join(DB_DIR, `${tableName}.db`);
    const db = new sqlite3.Database(dbPath);

    db.serialize(() => {
      const columns = Object.keys(data[0]);
      const placeholders = columns.map(() => '?').join(', ');
      const sql = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;

      const stmt = db.prepare(sql);

      for (const item of data) {
        // カラムの順序を保証
        const values = columns.map(key => item[key]);
        stmt.run(values);
      }

      stmt.finalize((err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  });
}

// メインの処理
async function main() {
  try {
    // データベースディレクトリの作成
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    // 各テーブルの処理
    const tableNames = [
      'DictionaryIndices',
      'DictionaryLikeData',
      'IRGSources',
      'NumericValues',
      'OtherMappings',
      'RadicalStrokeCounts',
      'Readings',
      'Variants'
    ];

    for (const tableName of tableNames) {
      console.log(`処理中: ${tableName}`);

      // JSONファイルの読み込み
      const jsonPath = path.join(DATA_DIR, `${tableName}.json`);
      if (!fs.existsSync(jsonPath)) {
        console.log(`JSONファイルが見つかりません: ${jsonPath}`);
        continue;
      }

      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
      console.log(`${tableName} のデータ数: ${data.length}`);

      // テーブル定義の生成
      const tableSQL = generateTableSQL(data, tableName);

      // データベースの初期化
      await initializeDatabase(tableName, tableSQL);

      // データの挿入
      await insertData(tableName, data);
      console.log(`${tableName} のデータを挿入しました`);
    }

    console.log('データベースの作成が完了しました');
  } catch (error) {
    console.error('エラーが発生しました:', error);
    process.exit(1);
  }
}

main();
