import fs from 'fs';
import path from 'path';

// テストファイルを検索して実行
async function runTests() {
  try {
    // testsディレクトリ内のすべての.test.tsファイルを検索
    const testFiles = findTestFiles('tests');
    
    // テストファイルを順番に実行
    for (const file of testFiles) {
      console.log(`\n実行中: ${file}`);
      try {
        // テストファイルを動的にインポート
        await import(path.resolve(file));
      } catch (error) {
        // テストファイルの実行中にエラーが発生した場合
        console.error(`\n\x1b[31mテストファイル ${file} の実行中にエラーが発生しました\x1b[0m`);
        if (error instanceof Error) {
          console.error(error.message);
        }
        process.exit(1);
      }
    }
  } catch (error) {
    console.error('テストファイルの検索中にエラーが発生しました:', error);
    process.exit(1);
  }
}

// 再帰的にテストファイルを検索する関数
function findTestFiles(dir: string): string[] {
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findTestFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.test.ts')) {
      files.push(fullPath);
    }
  }

  return files;
}

// テストを実行
runTests(); 