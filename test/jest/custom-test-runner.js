import JestRuntime from 'jest-runtime';
import { readConfig } from 'jest-config';
import { resolve as resolvePath } from 'path';
import { SearchSource, TestScheduler, TestWatcher } from 'jest-cli';
import tmp from 'tmp';

const packageConfig = require('../package.json');

const packageRoot = resolvePath(__dirname, '..');
const reporterPath = resolvePath(__dirname, './reporter');
const helperPath = resolvePath(__dirname, './test-helper.js');

const runTestsAsync = async ({ buildAtomEnvironment, buildDefaultApplicationDelegate }) => {
  const tmpDir = tmp.dirSync();

  // try {
    const applicationDelegate = buildDefaultApplicationDelegate();
    const atom = buildAtomEnvironment({
      applicationDelegate, window, document,
      enablePersistence: true,
      configDirPath: tmpDir.name,
    });
    const getAtom = () => atom;

    const config = Object.assign({
      projects: [packageRoot],
      reporters: [reporterPath],
      setupTestFrameworkScriptFile: helperPath,
      testEnvironment: 'node',
      globals: {
        testUtils: {
          getAtom,
        },
      },
      // transform: {
      //   "^.+\\.jsx?$": "babel-jest"
      // },
    }, packageConfig.jest);

    const { globalConfig, projectConfig } = readConfig({ config: JSON.stringify(config) }, packageRoot)
    const context = await JestRuntime.createContext(projectConfig, { maxWorkers: 1, watchman: false });

    const scheduler = new TestScheduler(globalConfig, { startRun: (globalConfig) => {} });
    const watcher = new TestWatcher({ isWatchMode: false });

    const searcher = new SearchSource(context);
    const { tests } = await searcher.getTestPaths(globalConfig);

    const result = await scheduler.scheduleTests(tests, watcher);
  // } catch (err) {
  //  console.error(err);
  //  return Promise.resolve();
  // } finally {
    // tmpDir.removeCallback();
  //}

  return result;
};

module.exports = ({testPaths, buildAtomEnvironment, buildDefaultApplicationDelegate, logFile, headless}) => {
  return runTestsAsync({ buildAtomEnvironment, buildDefaultApplicationDelegate }).then(() => 0);
}
