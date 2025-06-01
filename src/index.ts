import fs from 'fs';
import path from 'path';
import { DatabaseManager } from './DatabaseManager.js';
import { Codepoint } from '../common/Codepoint.js';
import {
  DictionaryIndexType,
  DictionaryLikeDatumType,
  IRGSourceType,
  NumericValueType,
  OtherMappingType,
  RadicalStrokeCountType,
  ReadingType,
  VariantType
} from '../data/UnihanType';

// データベースディレクトリのパス
const DB_DIR = path.join(process.cwd(), 'dist', 'db');

// codepointをnumberに変換する関数
function toCodepoint(codepoint: string | number): number {
  return new Codepoint(codepoint).getValue();
}

// データベースからデータを取得する関数
async function getData<T>(tableName: string, codepoint: string | number): Promise<T | null> {
  const codepointNum = toCodepoint(codepoint);
  return new Promise((resolve, reject) => {
    const db = DatabaseManager.getInstance().getConnection(tableName);
    db.get(
      `SELECT * FROM ${tableName} WHERE codepoint = ?`,
      [codepointNum],
      (err: Error | null, row: any) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row as T || null);
      }
    );
  });
}

// データベースから複数のデータを取得する関数
async function getDataList<T>(tableName: string, codepoints: (string | number)[]): Promise<T[]> {
  const codepointNums = codepoints.map(toCodepoint);
  return new Promise((resolve, reject) => {
    const db = DatabaseManager.getInstance().getConnection(tableName);
    const placeholders = codepointNums.map(() => '?').join(',');
    db.all(
      `SELECT * FROM ${tableName} WHERE codepoint IN (${placeholders})`,
      codepointNums,
      (err: Error | null, rows: any[]) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows as T[]);
      }
    );
  });
}

// 利用可能なテーブル名のリストを取得
function listAvailableTables(): string[] {
  if (!fs.existsSync(DB_DIR)) {
    return [];
  }
  return fs.readdirSync(DB_DIR)
    .filter(file => file.endsWith('.db'))
    .map(file => path.basename(file, '.db'));
}

// 型定義のエクスポート
export type {
  DictionaryIndexType,
  DictionaryLikeDatumType,
  IRGSourceType,
  NumericValueType,
  OtherMappingType,
  RadicalStrokeCountType,
  ReadingType,
  VariantType
};

// データ取得関数のエクスポート
export const getDictionaryIndex = (codepoint: string | number) => getData<DictionaryIndexType>('DictionaryIndices', codepoint);
export const getDictionaryLikeData = (codepoint: string | number) => getData<DictionaryLikeDatumType>('DictionaryLikeData', codepoint);
export const getIRGSource = (codepoint: string | number) => getData<IRGSourceType>('IRGSources', codepoint);
export const getNumericValue = (codepoint: string | number) => getData<NumericValueType>('NumericValues', codepoint);
export const getOtherMapping = (codepoint: string | number) => getData<OtherMappingType>('OtherMappings', codepoint);
export const getRadicalStrokeCount = (codepoint: string | number) => getData<RadicalStrokeCountType>('RadicalStrokeCounts', codepoint);
export const getReading = (codepoint: string | number) => getData<ReadingType>('Readings', codepoint);
export const getVariant = (codepoint: string | number) => getData<VariantType>('Variants', codepoint);

// 複数データ取得関数のエクスポート
export const getDictionaryIndices = (codepoints: (string | number)[]) => getDataList<DictionaryIndexType>('DictionaryIndices', codepoints);
export const getDictionaryLikeDataList = (codepoints: (string | number)[]) => getDataList<DictionaryLikeDatumType>('DictionaryLikeData', codepoints);
export const getIRGSources = (codepoints: (string | number)[]) => getDataList<IRGSourceType>('IRGSources', codepoints);
export const getNumericValues = (codepoints: (string | number)[]) => getDataList<NumericValueType>('NumericValues', codepoints);
export const getOtherMappings = (codepoints: (string | number)[]) => getDataList<OtherMappingType>('OtherMappings', codepoints);
export const getRadicalStrokeCounts = (codepoints: (string | number)[]) => getDataList<RadicalStrokeCountType>('RadicalStrokeCounts', codepoints);
export const getReadings = (codepoints: (string | number)[]) => getDataList<ReadingType>('Readings', codepoints);
export const getVariants = (codepoints: (string | number)[]) => getDataList<VariantType>('Variants', codepoints);

// 利用可能なテーブル名のエクスポート
export const getAvailableTables = () => listAvailableTables();

// データベース接続を閉じる関数のエクスポート
export const closeDatabase = () => DatabaseManager.getInstance().closeAll();
export const closeTableConnection = (tableName: string) => DatabaseManager.getInstance().closeConnection(tableName);

export const getKanjiDetail = async (codepoint: string | number) => {
  const cp = new Codepoint(codepoint);
  const codepointNum = toCodepoint(codepoint);
  return {
    char: cp.toChar(),
    codepoint: codepointNum,
    codepointStr: cp.toString(),
    dictionaryIndex: await getDictionaryIndex(codepointNum),
    dictionaryLikeData: await getDictionaryLikeData(codepointNum),
    iRGSource: await getIRGSource(codepointNum),
    numericValue: await getNumericValue(codepointNum),
    otherMapping: await getOtherMapping(codepointNum),
    radicalStrokeCount: await getRadicalStrokeCount(codepointNum),
    reading: await getReading(codepointNum),
    variant: await getVariant(codepointNum)
  }
}

export const getKanjiDetailList = async (codepoints: (string | number)[]) => {
  const codepointNums = codepoints.map(toCodepoint);
  const [
    dictionaryIndices,
    dictionaryLikeDataList,
    iRGSources,
    numericValues,
    otherMappings,
    radicalStrokeCounts,
    readings,
    variants
  ] = await Promise.all([
    getDictionaryIndices(codepointNums),
    getDictionaryLikeDataList(codepointNums),
    getIRGSources(codepointNums),
    getNumericValues(codepointNums),
    getOtherMappings(codepointNums),
    getRadicalStrokeCounts(codepointNums),
    getReadings(codepointNums),
    getVariants(codepointNums)
  ]);

  return codepointNums.map(codepoint => {
    const cp = new Codepoint(codepoint);
    const dictionaryIndex = dictionaryIndices.find(d => d.codepoint === codepoint);
    const dictionaryLikeData = dictionaryLikeDataList.find(d => d.codepoint === codepoint);
    const iRGSource = iRGSources.find(d => d.codepoint === codepoint);
    const numericValue = numericValues.find(d => d.codepoint === codepoint);
    const otherMapping = otherMappings.find(d => d.codepoint === codepoint);
    const radicalStrokeCount = radicalStrokeCounts.find(d => d.codepoint === codepoint);
    const reading = readings.find(d => d.codepoint === codepoint);
    const variant = variants.find(d => d.codepoint === codepoint);

    return {
      char: cp.toChar(),
      codepoint,
      codepointStr: cp.toString(),
      dictionaryIndex,
      dictionaryLikeData,
      iRGSource,
      numericValue,
      otherMapping,
      radicalStrokeCount,
      reading,
      variant
    };
  });
}

// Codepointクラスのエクスポート
export { Codepoint };

export default {
  getKanjiDetail,
  getKanjiDetailList,
}
