const fs = require('fs-extra');
const path = require('path');

const sourcePath = path.resolve('src', 'templates');

const destinationPath = path.resolve('dist');

const templateFolder = path.join(destinationPath, path.sep, 'templates');

const existsTemplate = fs.existsSync(templateFolder);

if (!existsTemplate) {
  fs.mkdirSync(templateFolder);
}

const packagePath = path.resolve('package.json');

fs.copyFileSync(packagePath, path.resolve(destinationPath, 'package.json'));
fs.copyFileSync(
  path.resolve('README.md'),
  path.resolve(destinationPath, 'README.md')
);
fs.copyFileSync(
  path.resolve('LICENSE'),
  path.resolve(destinationPath, 'LICENSE')
);

fs.copy(sourcePath, templateFolder);
