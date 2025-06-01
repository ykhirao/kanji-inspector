// downloadする
// https://www.unicode.org/Public/UCD/latest/ucd/Unihan.zip
// 最終日を出力する

import fs from "fs";
import path from "path";
import unzipper from "unzipper";
import readline from "readline";

const UNIHAN_URL = "https://www.unicode.org/Public/UCD/latest/ucd/Unihan.zip";
const AFFIRMATIVE_INPUTS = ['y', 'ｙ'];

const DATA_DIR = path.join(process.cwd(), "data");
const ZIP_PATH = path.join(DATA_DIR, "Unihan.zip");
const EXTRACT_PATH = path.join(DATA_DIR, "unihan");
const META_PATH = path.join(process.cwd(), ".unihan-meta.json");

function readMeta() {
  if (!fs.existsSync(META_PATH)) return null;
  try {
    return JSON.parse(fs.readFileSync(META_PATH, "utf-8"));
  } catch {
    return null;
  }
}

async function downloadUnihan() {
  console.log("ダウンロード開始");

  const res = await fetch(UNIHAN_URL);
  console.log("ダウンロード完了");

  const lastModified = res.headers.get("Last-Modified");
  if (!res.ok) throw new Error(`Failed to download: ${res.statusText}`);
  const meta = readMeta();

  if (meta && meta.lastModified && lastModified) {
    const lastModNew = new Date(lastModified).toISOString();
    if (meta.lastModified === lastModNew) {
      console.log(
        "最終更新日が同じです:",
        lastModNew
      );
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const answer = await new Promise<string>((resolve) => {
        rl.question('ダウンロードを続けますか？ (y/N): ', resolve);
      });
      rl.close();

      if (AFFIRMATIVE_INPUTS.includes(answer.toLowerCase())) {
        console.log('選択: 続行します');
      } else {
        console.log('選択: スキップします');
        return;
      }
    }
  }

  fs.mkdirSync(DATA_DIR, { recursive: true });

  const arrayBuffer = await res.arrayBuffer();
  fs.writeFileSync(ZIP_PATH, Buffer.from(arrayBuffer));
  console.log("ZIPファイル書き込み完了:", ZIP_PATH);

  const now = new Date();
  const metaObj = {
    lastFetched: now.toISOString(),
    lastModified: lastModified ? new Date(lastModified).toISOString() : null,
    sourceUrl: UNIHAN_URL,
  };
  fs.writeFileSync(META_PATH, JSON.stringify(metaObj, null, 4), "utf-8");
  console.log("メタ情報を書き込み完了:", META_PATH);
}

async function unzipUnihan() {
  if (fs.existsSync(EXTRACT_PATH)) {
    console.log("既に解凍済み:", EXTRACT_PATH);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const answer = await new Promise<string>((resolve) => {
      rl.question('上書きしますか？ (y/N): ', resolve);
    });
    rl.close();

    if (AFFIRMATIVE_INPUTS.includes(answer.toLowerCase())) {
      console.log('選択: 上書きします');
      // フォルダの中身を全て削除
      const files = fs.readdirSync(EXTRACT_PATH);
      for (const file of files) {
        const filePath = path.join(EXTRACT_PATH, file);
        fs.rmSync(filePath, { recursive: true, force: true });
  }
      console.log('既存のファイルを削除しました。');
    } else {
      console.log('選択: スキップします');
      return;
    }
  }

  // 一時ディレクトリに解凍
  const tempDir = path.join(DATA_DIR, 'temp');
  console.log('一時ディレクトリを作成:', tempDir);
  fs.mkdirSync(tempDir, { recursive: true });

  console.log('ZIPファイルを解凍中...');
  await fs
    .createReadStream(ZIP_PATH)
    .pipe(unzipper.Extract({ path: tempDir }))
    .promise();
  console.log('ZIPファイルの解凍が完了しました');

  // ファイル名を変更して移動
  console.log('ファイル名の変更と移動を開始...');
  const files = fs.readdirSync(tempDir);
  for (const file of files) {
    const newName = file.replace(/^Unihan_/, '');
    if (newName !== file) {
      console.log(`ファイル名を変更: ${file} -> ${newName}`);
    }
    fs.renameSync(
      path.join(tempDir, file),
      path.join(EXTRACT_PATH, newName)
    );
  }
  console.log('全てのファイルの移動が完了しました');

  // 一時ディレクトリを削除
  console.log('一時ディレクトリを削除中...');
  fs.rmSync(tempDir, { recursive: true, force: true });
  console.log('一時ディレクトリを削除しました');
  console.log("解凍完了:", EXTRACT_PATH);
}

await downloadUnihan();
await unzipUnihan();
