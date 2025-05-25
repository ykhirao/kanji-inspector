import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UNIHAN_DIR = path.join(__dirname, "data/unihan");
const TS_TYPE_PATH = path.join(__dirname, '../src/data/UnihanType.ts');
const TS_CODEPOINT_PATH = path.join(__dirname, '../src/data/CodepointType.ts');
const TS_DATA_DIR = path.join(__dirname, '../src/data');

const expectedFiles = [
  'Unihan_DictionaryIndices.txt',
  'Unihan_DictionaryLikeData.txt',
  'Unihan_IRGSources.txt',
  'Unihan_NumericValues.txt',
  'Unihan_OtherMappings.txt',
  'Unihan_RadicalStrokeCounts.txt',
  'Unihan_Readings.txt',
  'Unihan_Variants.txt'
];

function toPascalCase(name: string): string {
  // Unihan_と拡張子除去
  const base = name.replace(/^Unihan_/, '').replace(/\.txt$/i, '');
  return base.replace(/([A-Z])/g, '_$1')
    .split(/[_\-]+/)
    .filter(Boolean)
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

function toCamelCase(name: string): string {
  const pascal = toPascalCase(name);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function listFilesRecursive(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of list) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      results = results.concat(listFilesRecursive(filePath));
    } else {
      results.push(file.name);
    }
  }
  return results;
}

if (!fs.existsSync(UNIHAN_DIR)) {
  console.error("ディレクトリが存在しません:", UNIHAN_DIR);
  process.exit(1);
}

fs.mkdirSync(TS_DATA_DIR, { recursive: true });

const files = listFilesRecursive(UNIHAN_DIR);
const expectedSet = new Set(expectedFiles);
const filesSet = new Set(files);
const missing = expectedFiles.filter(f => !filesSet.has(f));
const extra = files.filter(f => !expectedSet.has(f));
if (missing.length > 0 || extra.length > 0) {
  if (missing.length > 0) {
    console.error('想定されるファイルが見つかりません:', missing);
  }
  if (extra.length > 0) {
    console.error('想定外のファイルが存在します:', extra);
  }
  process.exit(1);
}
console.log('全ファイル名が想定通りです。');

// 型定義生成
let typeDefs = `// Auto-generated from Unihan data\nimport type { CodepointType } from './CodepointType';\n`;
const allCodepoints = new Set<string>();
for (const filename of expectedFiles) {
  const filePath = path.join(UNIHAN_DIR, filename);
  const lines = fs.readFileSync(filePath, 'utf-8').split(/\r?\n/);
  const codepointFields: Record<string, Set<string>> = {};
  const dataObj: Record<string, Record<string, string>> = {};
  for (const line of lines) {
    if (!line.trim() || line.startsWith('#')) continue;
    const [codepoint, field, ...valueParts] = line.split('\t');
    if (!codepoint || !field || valueParts.length === 0) continue;
    if (!codepointFields[codepoint]) codepointFields[codepoint] = new Set();
    if (codepointFields[codepoint].has(field)) {
      console.error('同じキーが重複しています:', codepoint, field, 'in', filename);
      process.exit(1);
    }
    codepointFields[codepoint].add(field);
    if (!dataObj[codepoint]) dataObj[codepoint] = {};
    dataObj[codepoint][field] = valueParts.join('\t');
    allCodepoints.add(codepoint);
  }
  // 全field名を集める
  const allFields = new Set<string>();
  Object.values(codepointFields).forEach(set => set.forEach(f => allFields.add(f)));
  const typeName = toPascalCase(filename);
  typeDefs += `\nexport type ${typeName} = {\n  [codepoint in CodepointType]?: {\n`;
  for (const field of Array.from(allFields).sort()) {
    typeDefs += `    ${field}?: string;\n`;
  }
  typeDefs += `  }\n}\n`;
  // データもTSファイルとして出力
  const varName = toCamelCase(filename);
  const tsDataPath = path.join(TS_DATA_DIR, typeName + '.ts');
  const tsContent = `import type { ${typeName} } from './UnihanType';\n\nexport const ${varName}: ${typeName} = ${JSON.stringify(dataObj, null, 2)} as const;\n`;
  fs.writeFileSync(tsDataPath, tsContent, 'utf-8');
  console.log('TSデータを書き出しました:', tsDataPath);
}
// CodepointType生成
const codepointList = Array.from(allCodepoints).sort();
const codepointTypeDef = `// Auto-generated from Unihan data\nexport type CodepointType =\n  ${codepointList.map(cp => `'${cp}'`).join(' |\n  ')};\n`;
fs.mkdirSync(path.dirname(TS_TYPE_PATH), { recursive: true });
fs.writeFileSync(TS_TYPE_PATH, typeDefs, 'utf-8');
console.log('型定義を書き出しました:', TS_TYPE_PATH);
fs.writeFileSync(TS_CODEPOINT_PATH, codepointTypeDef, 'utf-8');
console.log('CodepointTypeを書き出しました:', TS_CODEPOINT_PATH);

// --- index.ts自動生成 ---
const indexLines = [
  `export * from './data/UnihanType';`,
  `export * from './data/CodepointType';`
];
for (const filename of expectedFiles) {
  const typeName = toPascalCase(filename);
  indexLines.push(`export * from './data/${typeName}';`);
}
const indexPath = path.join(__dirname, '../src/index.ts');
fs.writeFileSync(indexPath, indexLines.join('\n'), 'utf-8');
console.log('index.tsを書き出しました:', indexPath);
