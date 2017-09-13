import path from 'path';
import fileHelper from './fileHelper';

let baseDirectory = process.cwd();

async function loadPackage() {
	let packages = await getPackageFiles();
	let packageList = await Promise.all(packages.map(d => {
		return Promise.resolve({
			filePath: d,
			jsonContent: require(d)
		});
		// return import(d);
	}));
	let packageDictionary = {};
	packageList.forEach(p => {
		packageDictionary[p.jsonContent.name] = p;
	});
	return packageDictionary;
}

async function getPackageFiles() {
	let dirs = await fileHelper.readDir(baseDirectory);
	let packages = dirs.map(d => {
		return path.resolve(baseDirectory, `${d}`, 'package.json');
	});
	let existPackages = [];
	await Promise.all(packages.map(d => {
		return fileHelper.exist(d).then(result => {
			if (result) {
				existPackages.push(d);
			}
		}).catch(() => { });
	}));
	return existPackages;
}

export default loadPackage;
