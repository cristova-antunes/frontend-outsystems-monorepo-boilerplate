import esbuild from "esbuild";
import { globSync } from "glob";
import path from "node:path";
import fs from "node:fs";
import process from "node:process";
import chokidar from "chokidar";

const isWatch = process.argv.includes("--watch");

async function buildFile(entry) {
	const projectRoot = process.cwd();
	const sourceDir = path.resolve(projectRoot, "source", "scripts");
	const outdir = path.resolve(projectRoot, "dist/scripts");

	// Ensure entry is absolute for consistent path math
	const absoluteEntry = path.resolve(entry);
	const folderName = path.basename(path.dirname(absoluteEntry));
	const namespace = folderName.replace(/[^a-zA-Z0-9]/g, "_");

	const relativePath = path.relative(sourceDir, path.dirname(absoluteEntry));
	const fileName = `${path.basename(absoluteEntry, path.extname(absoluteEntry))}.js`;
	const finalOutPath = path.join(outdir, relativePath, fileName);

	try {
		await esbuild.build({
			entryPoints: [absoluteEntry],
			bundle: true,
			minify: true,
			minifyIdentifiers: false,
			minifySyntax: true,
			minifyWhitespace: true,
			target: "es2020",
			format: "iife",
			globalName: namespace,
			outfile: finalOutPath,
			sourcemap: false,
			logLevel: "error",
		});

		const relSrc = path
			.relative(projectRoot, absoluteEntry)
			.replace(/\\/g, "/");
		const content = fs.readFileSync(finalOutPath, "utf8");
		const marker = `// Source: ${relSrc} | Namespace: ${namespace}\n`;
		fs.writeFileSync(finalOutPath, marker + content, "utf8");

		console.log(`[${new Date().toLocaleTimeString()}] ⚡ Built ${namespace}`);
	} catch (err) {
		console.error(`❌ Build failed for ${namespace}:`, err);
	}
}

async function run() {
	const projectRoot = process.cwd();
	// Use absolute path for the glob
	const entryPattern = path
		.resolve(projectRoot, "source/scripts/**/index.ts")
		.replace(/\\/g, "/");
	const files = globSync(entryPattern);

	console.log(
		isWatch ? "🔭 Watch mode active..." : "⚡ Building components...",
	);
	for (const file of files) await buildFile(file);

	if (isWatch) {
		// Watch the whole directory using an absolute path
		const watchPath = path
			.resolve(projectRoot, "source/scripts")
			.replace(/\\/g, "/");

		const watcher = chokidar.watch(watchPath, {
			persistent: true,
			ignoreInitial: true,
			ignored: "**/node_modules/**",
		});

		watcher.on("all", (_, filePath) => {
			// If any .ts file changes, find its parent index.ts
			if (filePath.endsWith(".ts")) {
				const dir = path.dirname(filePath);
				const indexFile = path.join(dir, "index.ts");

				if (fs.existsSync(indexFile)) {
					buildFile(indexFile);
				}
			}
		});

		watcher.on("error", (error) => console.error(`Watcher error: ${error}`));
	}
}

run();
