import chalk from 'chalk';

const console_log = console.log;
export const log = (...text: unknown[]) =>
  console_log(chalk.hex('#fefefe')(text));
export const error = (...text: unknown[]) => console_log(chalk.redBright(text));
export const warning = (...text: unknown[]) => console_log(chalk.yellow(text));
export const info = (...text: unknown[]) => console_log(chalk.blueBright(text));
