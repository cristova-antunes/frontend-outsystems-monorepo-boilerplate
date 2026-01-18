import esbuild from "esbuild";
import { globSync } from "glob";
import path from "node:path";
import fs from "node:fs";
import process from "node:process";
import chokidar from "chokidar";

function getExportedNames(filePath) {
	const src = fs.readFileSync(filePath, "utf8");
	const names = new Set();
	let match;

	// function declarations: export function name
	const fnRegex = /export\s+(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/g;
	match = fnRegex.exec(src);
	while (match) {
		names.add(match[1]);
		match = fnRegex.exec(src);
	}

	// exported const/let/var
	const constRegex = /export\s+(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/g;
	match = constRegex.exec(src);
	while (match) {
		names.add(match[1]);
		match = constRegex.exec(src);
	}

	// exported classes
	const classRegex = /export\s+class\s+([A-Za-z_$][\w$]*)/g;
	match = classRegex.exec(src);
	while (match) {
		names.add(match[1]);
		match = classRegex.exec(src);
	}

	// named exports: export { a, b as c }
	const namedRegex = /export\s*\{\s*([^}]+)\s*\}/g;
	match = namedRegex.exec(src);
	while (match) {
		match[1]
			.split(",")
			.map((s) =>
				s
					.trim()
					.split(/\s+as\s+/)
					.pop()
					.trim(),
			)
			.forEach((n) => {
				if (n) {
					names.add(n);
				}
			});
		match = namedRegex.exec(src);
	}

	// default exports collide as the "default" key
	if (/export\s+default\b/.test(src)) {
		names.add("default");
	}

	return Array.from(names);
}

function checkForDuplicateExports(entryFiles) {
	const map = new Map();
	for (const file of entryFiles) {
		const exported = getExportedNames(file);
		for (const name of exported) {
			const arr = map.get(name) || [];
			arr.push(file);
			map.set(name, arr);
		}
	}

	for (const [name, files] of map) {
		if (files.length > 1) {
			console.warn(
				`[${new Date().toLocaleTimeString()}] ⚠️ Duplicate export "${name}" found in:\n  - ${files
					.map((f) => path.relative(process.cwd(), f))
					.join(
						"\n  - ",
					)}\n  This may overwrite exports at runtime when merged into window.OS_FE_Scripts.`,
			);
		}
	}
}

const isWatch = process.argv.includes("--watch");

async function buildFile(entry) {
	const projectRoot = process.cwd();
	const sourceDir = path.resolve(projectRoot, "source", "scripts");
	const outdir = path.resolve(projectRoot, "dist/scripts");

	const absoluteEntry = path.resolve(entry);
	// Make a normalized path relative to project root so consumers can find the source
	const sourceRelative = path
		.relative(projectRoot, absoluteEntry)
		.replace(/\\/g, "/");
	const bannerComment = `/* Source: ${sourceRelative} */\nwindow.OS_FE_Scripts = window.OS_FE_Scripts || {};`;

	const relativePath = path.relative(sourceDir, path.dirname(absoluteEntry));
	const fileName = `${path.basename(absoluteEntry, path.extname(absoluteEntry))}.js`;
	const finalOutPath = path.join(outdir, relativePath, fileName);

	try {
		await esbuild.build({
			entryPoints: [absoluteEntry],
			bundle: true,
			minify: true,
			target: "es2020",
			format: "iife",
			// This creates a temporary local var inside the IIFE
			globalName: "tempModule",
			banner: {
				js: bannerComment,
			},
			// This merges the tempModule exports into the global object
			footer: {
				js: `Object.assign(window.OS_FE_Scripts, tempModule);`,
			},
			outfile: finalOutPath,
			logLevel: "error",
		});

		// Add your file marker logic here...
		console.log(
			`[${new Date().toLocaleTimeString()}] ⚡ Exported to OS_FE_Scripts`,
		);
	} catch (err) {
		console.error(`❌ Build failed:`, err);
	}
}

async function run() {
	const projectRoot = process.cwd();
	const entryPattern = path
		.resolve(projectRoot, "source/scripts/**/index.ts")
		.replace(/\\/g, "/");
	const files = globSync(entryPattern);

	console.log(
		isWatch ? "🔭 Watch mode active..." : "⚡ Building components...",
	);

	// Check for duplicate exports across entries and warn
	checkForDuplicateExports(files);

	// Initial build
	for (const file of files) {
		await buildFile(file);
	}

	if (isWatch) {
		const watchPath = path
			.resolve(projectRoot, "source/scripts")
			.replace(/\\/g, "/");
		const watcher = chokidar.watch(watchPath, { ignoreInitial: true });

		watcher.on("all", async (_, filePath) => {
			if (filePath.endsWith(".ts")) {
				const dir = path.dirname(filePath);
				const indexFile = path.join(dir, "index.ts");
				if (fs.existsSync(indexFile)) {
					// Re-scan entries and warn about duplicates
					const currentEntries = globSync(entryPattern);
					checkForDuplicateExports(currentEntries);

					await buildFile(indexFile);
				}
			}
		});
	}
}

run();
