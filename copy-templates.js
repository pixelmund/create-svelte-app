const fs = require('fs-extra');
const path = require('path');

const sourcePath = path.resolve('src', 'templates');

const destinationPath = path.resolve('dist');

const templateFolder = path.join(destinationPath, path.sep, 'templates');

const existsTemplate = fs.existsSync(templateFolder);

if (!existsTemplate) {
  fs.mkdirSync(templateFolder);
}

fs.copy(sourcePath, templateFolder);
