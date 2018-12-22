import * as fs from "fs";
import { unixTime } from "./unix-time";

interface CustomLoggingOptions {
	toFile?: boolean;
	toConsole?: boolean;
}

export const logFileName: string = `${new Date().toISOString()}.log`;

let _logFileStream: fs.WriteStream;
export function logFileStream() {
	if (!_logFileStream) {
		_logFileStream = fs.createWriteStream(`_workspace/logs/${logFileName}`);
	}
	return _logFileStream;
}

export function log(
	message: string,
	color?: "r" | "red" | "y" | "yellow" | "g" | "green",
	options?: CustomLoggingOptions,
): void {
	if (!options) {
		options = {};
	}

	const time: number | string = new Date().getTime();
	let rawMessage: string = "";

	switch (color) {
		case "r":
		case "red":
			rawMessage = `\x1b[31m${message}\x1b[0m`;
			break;

		case "y":
		case "yellow":
			rawMessage = `\x1b[33m${message}\x1b[0m`;
			break;

		case "g":
		case "green":
			rawMessage = `\x1b[32m${message}\x1b[0m`;
			break;

		default:
			rawMessage = `${message}`;
			break;
	}

	if (options.toConsole !== false) {
		console.log(`${unixTime(time)} ${rawMessage}`);
	}

	if (options.toFile !== false) {
		logFileStream().write(
			`${unixTime(time)}${
				color === "r" || color === "red" ? " ERROR: " : ""
			} ${message}\n`,
		);
	}
}
