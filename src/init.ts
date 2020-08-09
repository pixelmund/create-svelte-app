import { error, info, log, warning } from './helpers/logging';
import * as path from 'path';
import * as fs from 'fs-extra';
import mri from 'mri';

import inquirer, { QuestionCollection } from 'inquirer';
import { spawn } from 'child_process';

const svelteOrSapperPrompt: QuestionCollection = [
  {
    type: 'list',
    name: 'svelteOrSapper',
    message: 'Do you like to use Svelte or Sapper?',
    choices: ['svelte', 'sapper'],
  },
  {
    type: 'list',
    name: 'bundler',
    message: 'Which bundler would you like to use?',
    choices: ['rollup', 'webpack'],
  },
  {
    type: 'confirm',
    name: 'typescript',
    message: 'Do you want to use typescript?',
    default: false,
  },
  {
    type: 'list',
    name: 'cssPreprocessor',
    message: 'Do you want to use a css preprocessor?',
    choices: ['none', 'sass', 'less', 'stylus'],
  },
];

const templatePaths = {
  svelte: {
    rollup: {
      javascript: path.resolve(
        __dirname,
        'templates',
        'svelte',
        'rollup',
        'javascript'
      ),
      typescript: path.resolve(
        __dirname,
        'templates',
        'svelte',
        'rollup',
        'typescript'
      ),
    },
    webpack: {
      javascript: path.resolve(
        __dirname,
        'templates',
        'svelte',
        'webpack',
        'javascript'
      ),
      typescript: path.resolve(
        __dirname,
        'templates',
        'svelte',
        'webpack',
        'typescript'
      ),
    },
  },
  sapper: {
    rollup: {
      javascript: path.resolve(
        __dirname,
        'templates',
        'sapper',
        'rollup',
        'javascript'
      ),
      typescript: path.resolve(
        __dirname,
        'templates',
        'sapper',
        'rollup',
        'typescript'
      ),
    },
    webpack: {
      javascript: path.resolve(
        __dirname,
        'templates',
        'sapper',
        'webpack',
        'javascript'
      ),
      typescript: path.resolve(
        __dirname,
        'templates',
        'sapper',
        'webpack',
        'typescript'
      ),
    },
  },
};

export async function initNewApp(
  args: mri.Argv,
  name: string,
  dir: { baseDir: string; newDir: boolean }
) {
  log(name, dir.baseDir, dir.newDir);

  const questions = await inquirer.prompt(svelteOrSapperPrompt);

  const svelteOrSapper = questions['svelteOrSapper'];

  const bundler = questions['bundler'];

  const typescriptOrJavaScript = questions['typescript']
    ? 'typescript'
    : 'javascript';

  const cssPreprocessor = questions['cssPreprocessor'];

  // @ts-expect-error
  const source = templatePaths[svelteOrSapper][bundler][typescriptOrJavaScript];
  let destPath: string;

  if (dir.newDir) {
    destPath = path.join(dir.baseDir, path.sep, name);
    fs.mkdirSync(destPath);
  } else {
    destPath = dir.baseDir;
  }

  fs.copySync(source, destPath);

  const packagePath = path.resolve(destPath, 'package.json');

  let pckg: any = fs.readFileSync(packagePath).toString();

  pckg = JSON.parse(pckg);
  pckg['name'] = name;
  if (cssPreprocessor !== 'none') {
    pckg['devDependencies'][cssPreprocessor] = 'latest';
  }

  fs.writeFileSync(packagePath, JSON.stringify(pckg, undefined, 2));

  info('Installing dependencies, please wait...\n');

  const npmI = spawn(
    /^win/.test(process.platform) ? 'npm.cmd' : 'npm',
    ['install'],
    { cwd: destPath, stdio: 'inherit' }
  );
  npmI.on('close', function (code) {
    info('Installed all dependencies\n');
    info('Next steps:\n');
    warning(`cd ${destPath}\n`);
    warning('npm run dev');
  });
}
