/**
* 主模块文件
*/
import 'babel-polyfill';
import loadPackage from './packageManager';
import { analyze } from './dependencyManager';
import compileManager from './compileManager';
import chalk from 'chalk';
import yargs from 'yargs';

let argv = yargs.command('patch', 'patch your package', yargs => {
	return yargs.option('name', {
		alias: 'n',
		demand: true,
		describe: 'package to be patched version',
		type: 'string'
	});
}, argv => {
	run(argv.name, 'patch');
}).command('update', 'update your package', yargs => {
	return yargs.option('name', {
		alias: 'n',
		demand: true,
		describe: 'package to be updated version',
		type: 'string'
	});
}, argv => {
	run(argv.name, 'update');
}).command('upgrade', 'upgrade your package', yargs => {
	return yargs.option('name', {
		alias: 'n',
		demand: true,
		describe: 'package to be upgraded version',
		type: 'string'
	});
}, argv => {
	run(argv.name, 'upgrade');
}).argv;

/**
 * 入口函数
 */
function run(name, mode) {
	exec(name, mode).then(() => {
		console.log(chalk.bgGreen('succeed!'));
	}).catch(error => {
		console.log(chalk.bgRed('failed!'));
		console.log(chalk.red(error.message));
	});
}

async function exec(name, mode) {
	let packageDictionary = await loadPackage();
	let dependenciesTree = analyze(packageDictionary);
  let pkg = dependenciesTree[name];
  if (!pkg) {
    throw new Error(`Package ${name} is not found!`);
  }
	switch (mode) {
		case 'patch':
			pkg.patch();
			break;
		case 'update':
			pkg.update();
			break;
		case 'upgrade':
			pkg.upgrade();
			break;
		default:
			return;
	}
	await pkg.save();
	await compileManager.compile();
}
