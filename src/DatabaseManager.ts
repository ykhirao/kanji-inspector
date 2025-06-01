import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// データベースディレクトリのパス
const DB_DIR = path.join(__dirname, '..', 'db');

// データベース接続を管理するクラス
export class DatabaseManager {
  private static instance: DatabaseManager;
  private connections: Map<string, sqlite3.Database> = new Map();

  private constructor() {}

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  // データベース接続を取得
  getConnection(tableName: string): sqlite3.Database {
    if (!this.connections.has(tableName)) {
      const dbPath = path.join(DB_DIR, `${tableName}.db`);
      if (!fs.existsSync(dbPath)) {
        throw new Error(`データベースファイルが見つかりません: ${dbPath}`);
      }
      const db = new sqlite3.Database(dbPath);
      this.connections.set(tableName, db);
    }
    return this.connections.get(tableName)!;
  }

  // 特定のテーブルの接続を閉じる
  closeConnection(tableName: string): void {
    const db = this.connections.get(tableName);
    if (db) {
      db.close();
      this.connections.delete(tableName);
    }
  }

  // すべての接続を閉じる
  closeAll(): void {
    for (const db of this.connections.values()) {
      db.close();
    }
    this.connections.clear();
  }
}