import esbuild from "esbuild";
import { globSync } from "glob";
import path from "node:path";
import fs from "node:fs";

async function runBuild() {
	const projectRoot = process.cwd();

	// Read the local package.json to get a unique global name
	const pkgJson = JSON.parse(
		fs.readFileSync(path.join(projectRoot, "package.json"), "utf-8"),
	);
	// Convert "@os/component-library" to "OS_ComponentLibrary"
	const globalName = pkgJson.name
		.replace(/[^a-zA-Z0-9]/g, "_")
		.replace(/^_+|_+$/g, "");

	const entryPoints = globSync("./src/**/*.ts", { absolute: true });

	await esbuild
		.build({
			entryPoints,
			bundle: true, // Required for globalName to work effectively
			minify: true,
			target: "es2020",
			format: "iife", // Immediately Invoked Function Expression
			globalName: globalName,
			outdir: path.join(projectRoot, "dist"),
			logLevel: "info",
		})
		.catch(() => process.exit(1));

	console.log("⚡ Build complete");
	console.log(`Global Namespace: ${globalName}`);
}

runBuild();
