import * as fs from "fs";
import { log, logFileName, logFileStream } from "./log-system";
import { unixTime } from "./unix-time";

export const folders: Array<string> = ["_workspace/logs"];

export function createFolder(folder: string): void {
	const subfolders = folder.split("/");
	let current: string = "";
	for (let i = 0; i < subfolders.length; i++) {
		const subfolder = subfolders[i];
		current += subfolder;
		if (!fs.existsSync(current)) {
			log(`${current} was not found. Building...`, "yellow", {
				toFile: false,
			});
			fs.mkdirSync(current);
		} else {
			log(`${current} was found`, "green", { toFile: false });
		}
		current += "/";
	}
}

export function createFolders(paths: Array<string>): void {
	paths.forEach((path: string) => {
		createFolder(path);
	});
}

export function onStartUp() {
	createFolders(folders);

	logFileStream().write(
		String(`*******************************************\n`),
	);
	log(`APP: Starting...`, "yellow");

	const onClose = (signal?: any) => {
		return (code?: any) => {
			let color: "green" | "red" = "green";
			if (code !== 0) {
				color = "red";
			}

			log(`APP: Closed. signal: "${signal}", code: ${code}\n`, color);
			process.exit();
		};
	};

	const signals: Array<NodeJS.Signals> = ["SIGINT", "SIGQUIT", "SIGILL"];
	signals.forEach(async (signal: NodeJS.Signals) => {
		process.on(signal, onClose(signal));
		log(`Added listener: process.on("${signal}").`, "green");
	});

	process.on("beforeExit", onClose("beforeExit"));
	log(`Added listener: process.on("beforeExit").`, "green");
}
