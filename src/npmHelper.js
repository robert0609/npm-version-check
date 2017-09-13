import shell from 'shelljs';

async function install(pkg) {
	await new Promise((resolve, reject) => {
		shell.cd(pkg.dir);
		shell.exec('npm install', {
			silent: true
		}, (code, stdout, stderr) => {
			// console.log('Exit code:', code);
			// console.log('Program output:', stdout);
			// console.log('Program stderr:', stderr);
			if (code === 0) {
				resolve();
			}
			else {
				reject();
			}
		});
	});
}

async function build(pkg) {
	await new Promise((resolve, reject) => {
		shell.cd(pkg.dir);
		shell.exec('npm run prod', {
			silent: true
		}, (code, stdout, stderr) => {
			// console.log('Exit code:', code);
			// console.log('Program output:', stdout);
			// console.log('Program stderr:', stderr);
			if (code === 0) {
				resolve();
			}
			else {
				reject();
			}
		});
	});
}

async function publish(pkg) {
	await new Promise((resolve, reject) => {
		shell.cd(pkg.dir);
		shell.exec('npm publish', {
			silent: true
		}, (code, stdout, stderr) => {
			// console.log('Exit code:', code);
			// console.log('Program output:', stdout);
			// console.log('Program stderr:', stderr);
			if (code === 0) {
				resolve();
			}
			else {
				reject();
			}
		});
	});
}

export default {
	install,
	build,
	publish
};
