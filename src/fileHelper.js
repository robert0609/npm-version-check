import path from 'path';
import fs from 'fs';
import promiseWrapper from './promiseWrapper';

async function exist(filename) {
	try {
		await promiseWrapper(fs.access)(filename);
		return true;
	}
	catch (e) {
		if (e.code === 'ENOENT') {
			return false;
		}
		else {
			throw e;
		}
	}
}

async function read(filename) {
	let isExist = await exist(filename);
	if (!isExist) {
		throw new Error(`Failed to read ${filename}! Can't find the target file.`);
	}
	let content = await new Promise((resolve, reject) => {
		let rs = fs.createReadStream(filename);
		let result = '';
		rs.on('data', (data) => {
			result += data;
		}).on('end', () => {
			resolve(result);
		}).on('close', () => {
			// console.log('close');
		}).on('error', (error) => {
			reject(error);
		});
	});
	return content;
}
async function write(filename, content, append = false) {
	let isExist = await exist(filename);
	let flag = (isExist && append) ? 'a' : 'w';
	let result = await new Promise((resolve, reject) => {
		let ws = fs.createWriteStream(filename, {
			flags: flag
		});
		ws.on('finish', () => {
			resolve('finish');
		}).on('close', () => {
			resolve('close');
		}).on('error', (error) => {
			reject(error);
		});
		let contentBuffer = Buffer.from(content);
		let length = contentBuffer.length;
		let hasWriteLength = 0;
		writeChunk();

		function writeChunk() {
			let writeResult = true;
			while (writeResult && hasWriteLength < length) {
				let restLength = length - hasWriteLength;
				let toWriteLength = restLength < 10240 ? restLength : 10240;
				let toWriteBuffer = contentBuffer.slice(hasWriteLength, toWriteLength);
				writeResult = ws.write(toWriteBuffer);
				hasWriteLength += toWriteLength;
			}
			if (!writeResult) {
				ws.once('drain', writeChunk);
				return;
			}
			if (hasWriteLength === length) {
				ws.end();
			}
		}
	});
	return result;
}

async function readDir(baseDir) {
	return await promiseWrapper(fs.readdir)(baseDir);
}

export default {
	read,
	write,
	exist,
	readDir
};
