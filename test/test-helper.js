const path = require('path');

export default function configure(mocha) {
  const testPackagePath = path.join(__dirname, '..');
  const testPackageName = require(path.join(testPackagePath, 'package.json')).name;

  mocha.suite.beforeAll(() => {
    const originalResolveFunction = atom.packages.resolvePackagePath;
    atom.packages.resolvePackagePath = function (packageName) {
      if (packageName === testPackageName) {
        return originalResolveFunction.call(this, testPackagePath);
      } else {
        return originalResolveFunction.call(this, packageName);
      }
    };
  });
}
