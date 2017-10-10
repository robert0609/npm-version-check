# npm-version-check

> npm version manager

## Build Setup

``` bash
# install dependencies
npm install

# serve development program
npm run dev

# build for production
npm run prod
```
## Command

> npm-version

##  Sub Command

| name | description
| ---- | ------------------
| patch | change SemVer: X.X.1 ==> X.X.2
| update | change SemVer: X.1.X ==> X.2.0
| upgrade | change SemVer: 1.X.X ==> 2.0.0

## parameter

| name | demand | description
| ---- | ------ | ------------------
| --name,-n | yes | package name to be patched/updated/upgraded

## How to use?

Example:
```
rootFolder
├--package1Folder
|  └--package.json
├--package2Folder
|  └--package.json
└--package3Folder
   └--package.json
```
Instruction:
```
You have to run command "npm-version" in rootFolder for working properly. It will manage the dependencies of all sub packages(package1、package2、package3) in rootFolder.
```

``` bash
# cd rootFolder
> cd rootFolder/

# run patch. It will patch package1 and patch all of package that depend on it in rootFolder.
> npm-version patch -n package1Folder

# run update. It will update package1 and patch all of package that depend on it in rootFolder.
> npm-version update -n package1Folder

# run upgrade. It will upgrade package1 and patch all of package that depend on it in rootFolder.
> npm-version upgrade -n package1Folder
```
