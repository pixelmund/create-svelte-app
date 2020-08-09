#!/usr/bin/env node

import mri from 'mri';
import { basename, resolve } from 'path';
import { error, info, log } from './helpers/logging';
import { isDirectory } from './helpers/filesystem';
import { createPackageName } from './helpers';
import { initNewApp } from './init';

const argv = process.argv.slice(2);
const args = mri(argv, {
  alias: {
    h: 'help',
  },
});

const mainArg = args['_'][0] || '';

let nameArg: string;
let baseDir = process.cwd();
let newDir = true;

if (mainArg === '.' || mainArg === './' || mainArg === '') {
  baseDir = resolve('./');
  nameArg = createPackageName(basename(baseDir));
  newDir = false;
} else if (isDirectory(mainArg)) {
  nameArg = createPackageName(basename(mainArg));
  baseDir = resolve(mainArg);
  newDir = false;
} else {
  nameArg = args['_'].join('-');
  nameArg = createPackageName(nameArg);
}

if (!nameArg || nameArg.length === 0) {
  error('You need to specify a valid package name');
  process.exit(9);
}

info(`Creating a new svelte app with name ${nameArg}`);

initNewApp(args, nameArg, { baseDir, newDir });
