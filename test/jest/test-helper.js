const path = require('path');
const testPackagePath = path.join(__dirname, '..');
const testPackageName = require(path.join(testPackagePath, 'package.json')).name;

jasmine.getEnv().beforeEach(() => {
  global.atom = global.testUtils.getAtom();

  const originalResolveFunction = atom.packages.resolvePackagePath;
  atom.packages.resolvePackagePath = function (packageName) {
    if (packageName === testPackageName) {
      return originalResolveFunction.call(this, testPackagePath);
    } else {
      return originalResolveFunction.call(this, packageName);
    }
  };
});
