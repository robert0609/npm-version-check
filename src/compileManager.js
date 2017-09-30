import npmHelper from './npmHelper';
import chalk from 'chalk';
import ora from 'ora';

let compileQueue = [];

function push(pkg) {
	compileQueue.push(pkg);
}

async function compile() {
	let pkg = compileQueue.shift();
	let spinner = ora();
	while (pkg) {
		spinner.start(chalk.cyan(`${pkg.name} installing dependency......`));
		await npmHelper.install(pkg);
		spinner.succeed(chalk.cyan(`${pkg.name} installed successfully!`));
		spinner.start(chalk.cyan(`${pkg.name} building......`));
		await npmHelper.build(pkg);
		spinner.succeed(chalk.cyan(`${pkg.name} built successfully!`));
		spinner.start(chalk.cyan(`${pkg.name} publishing......`));
		await npmHelper.publish(pkg);
		spinner.succeed(chalk.cyan(`${pkg.name} published successfully!`));

		pkg = compileQueue.shift();
	}
}

export default {
	push,
	compile
};
