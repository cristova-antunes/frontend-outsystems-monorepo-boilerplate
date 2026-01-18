import fs from "fs";
import path from "path";
import process from "process";
import postcss from "postcss";
import postcssConfig from "../postcss.config.js";

const outDir = path.resolve("dist/styles");
const timestamp = new Date().toLocaleString("pt-PT", { timeZone: "UTC" });
const isProduction = process.env.NODE_ENV === "production";

async function runBuild() {
  // Parse CLI arguments
  const args = process.argv.slice(2);
  const configArgIndex = args.indexOf("--config");
  let configPath = "./styles.config.js";

  if (configArgIndex !== -1 && args[configArgIndex + 1]) {
    configPath = args[configArgIndex + 1];
  }

  // Resolve config path relative to current working directory
  const resolvedConfigPath = path.resolve(process.cwd(), configPath);

  // Load the config
  let stylesConfig;
  try {
    const configModule = await import(`file://${resolvedConfigPath}`);
    stylesConfig = configModule.default;
  } catch (err) {
    console.error(`❌ Failed to load config from ${resolvedConfigPath}:`, err.message);
    process.exit(1);
  }

  const indexFilesPaths = stylesConfig.indexFiles;

  const mode = isProduction ? "PRODUCTION (PRD)" : "DEVELOPMENT (DEV)";
  const suffix = isProduction ? ".prd.css" : ".dev.css";

  console.log(`🚀 Starting Build [${mode}] at ${timestamp}...`);

  for (const entry of indexFilesPaths) {
    const from = path.resolve(entry.input);

    if (!fs.existsSync(from)) {
      console.warn(`⚠️ Input file not found: ${entry.input}`);
      continue;
    }

    // Determine the final filename and ensure subfolders exist
    const relativeOutputPath = entry.output.replace(".css", suffix);
    const finalOutputPath = path.join(outDir, relativeOutputPath);
    const finalDir = path.dirname(finalOutputPath);

    if (!fs.existsSync(finalDir)) {
      fs.mkdirSync(finalDir, { recursive: true });
    }

    const css = fs.readFileSync(from, "utf8");

    if (isProduction) {
      /** * CHUNKING CONFIGURATION
       * Adjust these values if OutSystems still breaks.
       */
      /** >200 and OS internal parser breaks */
      const chunkingConfig = {
        minLength: 100, // Minimum chars before looking for a break point
        maxLength: 200, // Maximum chars allowed on a single line
        breakPoints: "[;},]", // Regex safe-break characters (semicolon, closing brace, comma)
        fallbackLimit: 300, // Hard wrap limit if no breakPoints are found
      };

      // --- 2. GENERATE PRD VERSION ---
      const prdResult = await postcss(
        postcssConfig({ env: "production" }).plugins
      ).process(css, { from, to: finalOutputPath });

      let prdCss = prdResult.css;

      // --- DYNAMIC CHUNKING LOGIC ---
      // Build regex: /(.{MIN,MAX}[BREAKPOINTS])/g
      const chunkRegex = new RegExp(
        `(.{${chunkingConfig.minLength},${chunkingConfig.maxLength}}${chunkingConfig.breakPoints})`,
        "g"
      );

      let processedCss = prdCss.replace(chunkRegex, "$1\n");

      // Hard fallback if a line is still too long (e.g. no semicolons found in range)
      const fallbackRegex = new RegExp(
        `(.{${chunkingConfig.fallbackLimit}})`,
        "g"
      );
      processedCss = processedCss
        .split("\n")
        .map((line) => {
          return line.length > chunkingConfig.fallbackLimit
            ? line.replace(fallbackRegex, "$1\n")
            : line;
        })
        .join("\n");

      const finalPrd =
        `/* Built on: ${timestamp} UTC - OutSystems PRD */\n` + processedCss;
      fs.writeFileSync(finalOutputPath, finalPrd);

      const sizeKB = (Buffer.byteLength(finalPrd) / 1024).toFixed(2);
      console.log(`📦 PRD: ${relativeOutputPath} (${sizeKB} KB)`);
    } else {
      // --- 1. GENERATE DEV VERSION ---
      const devResult = await postcss(
        postcssConfig({ env: "development" }).plugins
      ).process(css, { from, to: finalOutputPath });

      const finalDev = `/* DEV MODE */\n` + devResult.css;
      fs.writeFileSync(finalOutputPath, finalDev);
      console.log(`✅ DEV: ${relativeOutputPath}`);
    }
  }

  console.log("✨ All tasks complete!");
}

runBuild().catch((err) => console.error("❌ Build failed:", err));
