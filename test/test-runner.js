import { createRunner } from 'atom-mocha-test-runner';
import path from 'path';
import fs from 'fs';
import helper from './test-helper';

function isEqualPaths(p1, p2) {
  return path.relative(p1, p2).length === 0;
}

function flattenArray(array) {
  return Array.prototype.concat(...array);
}

function lookupTestDirectories(dirname) {
  return flattenArray(fs.readdirSync(dirname).map((item) => {
    const fullpath = path.join(dirname, item);
    const stat = fs.statSync(fullpath);
    if (stat.isDirectory()) {
      if (item === '__tests__') {
        return fullpath;
      } else {
        return lookupTestDirectories(fullpath);
      }
    } else {
      return [];
    }
  }));
}

module.exports = function Runner(options) {
  let testPaths = options.testPaths;

  if (options.testPaths.length === 1 && isEqualPaths(options.testPaths[0], __dirname)) {
    testPaths = lookupTestDirectories(path.resolve(__dirname, '..'));
  }

  const runOptions = Object.assign({}, options, { testPaths });

  return createRunner({}, helper)(runOptions);
}
