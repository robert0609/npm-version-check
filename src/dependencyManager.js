import PackageClass from './PackageClass';

export function analyze(packageDictionary) {
	let pkgs = [];
	for (let key in packageDictionary) {
		let value = packageDictionary[key];
		packageDictionary[key] = new PackageClass(value);
		pkgs.push(packageDictionary[key]);
	}
	for (let i = 0; i < pkgs.length; ++i) {
		let leftPkg = pkgs[i];
		for (let j = i + 1; j < pkgs.length; ++j) {
			let rightPkg = pkgs[j];
			if (!leftPkg.judgePackage(rightPkg)) {
				rightPkg.judgePackage(leftPkg);
			}
		}
	}

	return packageDictionary;
}
