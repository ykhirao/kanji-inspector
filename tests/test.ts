import { strict as assert } from 'assert';

type TestCase = {
  name: string;
  fn: () => void;
};

type TestSuite = {
  name: string;
  cases: TestCase[];
};

const suites: TestSuite[] = [];

function createTestRunner() {
  let currentSuite: TestSuite | null = null;
  let failedCount = 0; // 失敗数カウント

  function describe(name: string, fn: () => void) {
    // テストスイートを作成して設定
    currentSuite = { name, cases: [] };
    suites.push(currentSuite);

    // テストケースを収集
    fn();

    // テストを実行
    if (currentSuite) {  // nullチェックを追加
      console.log(`\n${name}`);
      currentSuite.cases.forEach(test => {
        try {
          test.fn();
          console.log(`  \x1b[32m✓ ${test.name}\x1b[0m`);
        } catch (error) {
          failedCount++;
          process.exitCode = 1;
          console.error(`  \x1b[31m✗ ${test.name}\x1b[0m`);
          if (error instanceof Error) {
            console.error(`    ${error.message}`);
            if (error.stack) {
              console.error(error.stack.split('\n').slice(1).join('\n'));
            }
          } else {
            console.error(error);
          }
          // テスト失敗時に即座にプロセスを終了
          console.error('\n\x1b[31mテストが失敗したため、実行を停止します\x1b[0m');
          process.exit(1);
        }
      });
    }

    currentSuite = null;
  }

  function it(name: string, fn: () => void) {
    if (!currentSuite) {
      throw new Error('it must be called inside describe');
    }
    currentSuite.cases.push({ name, fn });
  }

  // describeの外で失敗数を出力
  process.on('exit', () => {
    if (failedCount > 0) {
      console.error(`\n\x1b[31m${failedCount} test(s) failed\x1b[0m`);
    }
  });

  return { describe, it };
}

const { describe, it } = createTestRunner();

export { describe, it, assert }; 