// downloadする
// https://www.unicode.org/Public/UCD/latest/ucd/Unihan.zip
// 最終日を出力する

import fs from "fs";
import path from "path";
import unzipper from "unzipper";
import { fileURLToPath } from "url";

const UNIHAN_URL = "https://www.unicode.org/Public/UCD/latest/ucd/Unihan.zip";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "data");
const ZIP_PATH = path.join(DATA_DIR, "Unihan.zip");
const EXTRACT_PATH = path.join(DATA_DIR, "unihan");
const META_PATH = path.join(__dirname, "../.unihan-meta.json");

function getForceFlag() {
  return process.argv.includes("-f") || process.argv.includes("--force");
}

function readMeta() {
  if (!fs.existsSync(META_PATH)) return null;
  try {
    return JSON.parse(fs.readFileSync(META_PATH, "utf-8"));
  } catch {
    return null;
  }
}

async function downloadUnihan(force = false) {
  console.log("ダウンロード開始");

  const res = await fetch(UNIHAN_URL);
  console.log("ダウンロード完了");

  const lastModified = res.headers.get("Last-Modified");
  if (!res.ok) throw new Error(`Failed to download: ${res.statusText}`);
  const meta = readMeta();

  if (!force && meta && meta.lastModified && lastModified) {
    const lastModNew = new Date(lastModified).toISOString();
    if (meta.lastModified === lastModNew) {
      console.log(
        "最終更新日が同じなのでダウンロード・解凍をスキップします:",
        lastModNew
      );
      process.exit(0);
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
  fs.writeFileSync(META_PATH, JSON.stringify(metaObj), "utf-8");
  console.log("メタ情報を書き込み完了:", META_PATH);
}

async function unzipUnihan(force = false) {
  if (fs.existsSync(EXTRACT_PATH)) {
    console.log("既に解凍済み:", EXTRACT_PATH);
    if (!force) return;
    // 強制上書きの場合は一度削除
    fs.rmSync(EXTRACT_PATH, { recursive: true, force: true });
  }
  await fs
    .createReadStream(ZIP_PATH)
    .pipe(unzipper.Extract({ path: EXTRACT_PATH }))
    .promise();
  console.log("解凍完了:", EXTRACT_PATH);
}

/**
 * npx ts-node scripts/download.ts         # 通常は差分がなければスキップ
 * npx ts-node scripts/download.ts -f      # 強制ダウンロード
 */
(async () => {
  const force = getForceFlag();
  await downloadUnihan(force);
  await unzipUnihan(force);
})();
