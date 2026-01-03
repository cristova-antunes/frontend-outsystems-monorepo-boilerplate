import esbuild from "esbuild";
import { globSync } from "glob";
import path from "node:path";
import process from "node:process";

async function runBuild() {
  const projectRoot = process.cwd();

  // Use forward slashes for glob patterns even on Windows
  const entryPoints = globSync("./src/**/*.ts", { absolute: true });

  if (entryPoints.length === 0) {
    console.log(`No TypeScript files found in ${projectRoot}/src`);
    return;
  }

  await esbuild
    .build({
      entryPoints,
      bundle: false,
      minify: true,
      target: "es2020",
      format: "iife", //Adjusted so the code is "ready to run" the moment it's pasted into a standard OutSystems script block.
      outdir: path.join(projectRoot, "dist"),
      sourcemap: false,
      logLevel: "info",
    })
    .catch(() => process.exit(1));

  console.log("⚡ Build complete");
}

runBuild();
