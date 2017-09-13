import path from 'path';
import semver from 'semver';
import fileHelper from './fileHelper';
import compileManager from './compileManager';
import chalk from 'chalk';

const privatePropertySet = Symbol('privatePropertySet');

const containsPackage = Symbol('containsPackage');

function parameterCanNotBeUndefined(name) {
	throw new Error(`${name} is undefined!`);
}

export default class PackageClass {
	constructor({
		filePath = parameterCanNotBeUndefined('filePath'),
		jsonContent = parameterCanNotBeUndefined('jsonContent')
	}) {
		this.dependencyDictionary = {};
		this.references = [];
		this[privatePropertySet] = {
			rawPackageJson: jsonContent,
			rawPackageFilePath: filePath,
			isPatched: false,
			isUpdated: false,
			isUpgraded: false,
			oldVersion: jsonContent.version
		};
	}

	get name() {
		return this[privatePropertySet].rawPackageJson.name;
	}

	get version() {
		return this[privatePropertySet].rawPackageJson.version;
	}
	set version(value) {
		this[privatePropertySet].rawPackageJson.version = value;
	}

	get dir() {
		return path.dirname(this[privatePropertySet].rawPackageFilePath);
	}

	get isPatched() {
		return this[privatePropertySet].isPatched;
	}
	set isPatched(value) {
		this[privatePropertySet].isPatched = value;
		if (!this.isVersionChanged) {
			this[privatePropertySet].oldVersion = this.version;
		}
	}

	get isUpdated() {
		return this[privatePropertySet].isUpdated;
	}
	set isUpdated(value) {
		this[privatePropertySet].isUpdated = value;
		if (!this.isVersionChanged) {
			this[privatePropertySet].oldVersion = this.version;
		}
	}

	get isUpgraded() {
		return this[privatePropertySet].isUpgraded;
	}
	set isUpgraded(value) {
		this[privatePropertySet].isUpgraded = value;
		if (!this.isVersionChanged) {
			this[privatePropertySet].oldVersion = this.version;
		}
	}

	get isVersionChanged() {
		return this[privatePropertySet].isPatched || this[privatePropertySet].isUpdated || this[privatePropertySet].isUpgraded;
	}

	get oldVersion() {
		return this[privatePropertySet].oldVersion;
	}

	judgePackage(pkg) {
		let flag = this[containsPackage](pkg);
		if (flag) {
			pkg.references.push(this);
		}
		return flag;
	}

	patch() {
		if (this.isPatched) {
			return;
		}
		this.version = semver.inc(this.version, 'patch');
		this.isPatched = true;
		let tips = `Patch ${this.name}: ${this.oldVersion} ==> ${this.version}\n`;
		console.log(chalk.cyan(tips));
		this.references.forEach(pkg => {
			pkg.setDependencyVersion(this.name, this.version);
			pkg.patch();
		});
	}

	update() {
		if (this.isUpdated) {
			return;
		}
		this.version = semver.inc(this.version, 'minor');
		this.isUpdated = true;
		let tips = `Update ${this.name}: ${this.oldVersion} ==> ${this.version}\n`;
		console.log(chalk.cyan(tips));
		this.references.forEach(pkg => {
			pkg.setDependencyVersion(this.name, this.version);
			pkg.patch();
		});
	}

	upgrade() {
		if (this.isUpgraded) {
			return;
		}
		this.version = semver.inc(this.version, 'major');
		this.isUpgraded = true;
		let tips = `Upgrade ${this.name}: ${this.oldVersion} ==> ${this.version}\n`;
		console.log(chalk.cyan(tips));
	}

	setDependencyVersion(name, version) {
		for (let kind in this.dependencyDictionary) {
			if (this.dependencyDictionary[kind][name]) {
				this[privatePropertySet].rawPackageJson[kind][name] = `^${version}`;
			}
		}
	}

	async save() {
		if (!this.isVersionChanged) {
			return;
		}
		//TODO:判断当前package的依赖包是否有版本升级，如果有则中断当前的保存操作
		let content = JSON.stringify(this[privatePropertySet].rawPackageJson, null, 2);
		await fileHelper.write(this[privatePropertySet].rawPackageFilePath, content);
		this.isPatched = false;
		this.isUpdated = false;
		this.isUpgraded = false;
		compileManager.push(this);
		for (let pkg of this.references) {
			await pkg.save();
		}
	}

	[containsPackage](pkg) {
		let rawPkg = this[privatePropertySet].rawPackageJson;
		let result = false;
		judge.call(this, 'dependencies');
		judge.call(this, 'devDependencies');
		judge.call(this, 'peerDependencies');

		function judge(dependencyKind) {
			if (rawPkg[dependencyKind] && rawPkg[dependencyKind][pkg.name]) {
				result = true;
				this.dependencyDictionary[dependencyKind] = this.dependencyDictionary[dependencyKind] || {};
				this.dependencyDictionary[dependencyKind][pkg.name] = pkg;
			}
		}

		return result;
	}
}
