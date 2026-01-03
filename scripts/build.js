import esbuild from "esbuild";
import { globSync } from "glob";
import path from "node:path";
import fs from "node:fs";
import process from "node:process";

async function runBuild() {
	const projectRoot = process.cwd();
	const sourceDir = path.join(projectRoot, "source", "scripts");
	const outdir = path.join(projectRoot, "dist");

	// Find all entry points (index.ts files)
	const entryPoints = globSync("source/scripts/**/index.ts", {
		absolute: true,
	});

	if (entryPoints.length === 0) {
		console.log(`No TypeScript files found in ${sourceDir}`);
		return;
	}

	console.log(`⚡ Building ${entryPoints.length} components...`);

	for (const entry of entryPoints) {
		// 1. Determine the folder name to use as a unique Global Namespace
		// e.g., source/scripts/feature-a/index.ts -> feature_a
		const folderName = path.basename(path.dirname(entry));
		const namespace = folderName.replace(/[^a-zA-Z0-9]/g, "_");

		// 2. Calculate output path for the source comment logic
		const relativePath = path.relative(sourceDir, path.dirname(entry));
		const fileName = `${path.basename(entry, path.extname(entry))}.js`;
		const finalOutPath = path.join(outdir, relativePath, fileName);

		try {
			await esbuild.build({
				entryPoints: [entry],
				bundle: true,
				minify: true,
				// Keeps your function names like 'generateTestData' intact
				minifyIdentifiers: false,
				minifySyntax: true,
				minifyWhitespace: true,
				target: "es2020",
				format: "iife", // Best for direct copy-paste into OutSystems
				globalName: namespace,
				outfile: finalOutPath, // Use outfile for precision in a loop
				sourcemap: false,
				logLevel: "error",
			});

			// 3. Prepend source path comment
			if (fs.existsSync(finalOutPath)) {
				const relSrc = path.relative(projectRoot, entry).replace(/\\/g, "/");
				const content = fs.readFileSync(finalOutPath, "utf8");
				const marker = `// Source: ${relSrc} | Namespace: ${namespace}\n`;

				if (!content.startsWith("// Source:")) {
					fs.writeFileSync(finalOutPath, marker + content, "utf8");
				}
			}
		} catch (err) {
			console.error(`❌ Failed to build ${namespace}:`, err);
			process.exit(1);
		}
	}

	console.log("✅ Build complete. Ready for OutSystems.");
}

runBuild();
