# OutSystems Front-End Monorepo

This monorepo is a centralized development environment for managing high-performance CSS and JavaScript components for OutSystems applications. It leverages modern tooling to provide a premium local developer experience (DX) while ensuring the output is optimized for the OutSystems platform.

## 🚀 Purpose

OutSystems does not provide a CLI for direct asset synchronization. This project bridges that gap by allowing developers to:

- **Write Modern Code:** Use TypeScript (ESNext) and PostCSS.
- **Maintain 1-1 Mapping:** Every source file in `src/` maps to a single optimized file in `dist/`, making it easy to copy-paste into Service Studio.
- **Ensure Consistency:** Share linting (Biome), formatting, and build logic across multiple OutSystems modules/themes.
- **Performance First:** Use `esbuild` for ultra-fast compilation and minification.

## 🛠 Tech Stack

- **Runtime:** Node.js (ESM)
- **Package Manager:** npm Workspaces
- **Compiler:** [esbuild](https://esbuild.github.io/) (Configured for IIFE output)
- **Linter/Formatter:** [Biome](https://biomejs.dev/)
- **CSS Processor:** [PostCSS](https://postcss.org/)

## 📂 Project Structure

```text
├── packages/
│   ├── project-a/          # Specific OutSystems Application/Module
│   │   ├── src/            # Source TS/CSS files
│   │   └── dist/           # Compiled assets for OutSystems
│   └── project-b/          # Another Application
├── scripts/
│   └── build-logic.js      # Shared esbuild engine (Dynamic)
├── biome.json              # Shared linting & formatting rules
└── package.json            # Monorepo configuration & shared dependencies
```

## 🏗 Getting Started

### Install Dependencies

From the root directory

```bash
pnpm install
```

### Developing

To work on a specific project

```bash
cd packages/your-package-name
pnpm run watch
```

This will watch for changes in `src/` and automatically update the `dist/` folder.

### Build All Projects

To compile all packages in the monorepo at once

```bash
pnpm run build:all
```

### Code Quality

We use Biome for instant linting and formatting.

```bash
pnpm run check:all   # Check for errors
pnpm run format:all  # Auto-format all files
```

### Editor Setup (VS Code) 🔧

To ensure Biome works correctly in VS Code:

- Install the **Biome** extension from the VS Code Marketplace (open Extensions → search for "Biome" → Install).
- **Enable the extension for this workspace** (open the extension and choose **Enable (Workspace)**).
- The workspace already points to the shared config via `.vscode/monorepo.code-workspace` (`"biome.configPath": "../../biome.json"`), so Biome will pick up the project rules automatically.
- Optional: make Biome the default formatter and enable format on save by adding to your user or workspace settings:

```json
{
  "editor.formatOnSave": true,
  "[javascript]": { "editor.defaultFormatter": "biome" },
  "[typescript]": { "editor.defaultFormatter": "biome" }
}
```

---

### Adding a new project to this workspace ➕

Follow these steps to add a new package to the monorepo:

1. Create the folder structure:

```bash
mkdir -p packages/my-new-project/source
mkdir -p packages/my-new-project/dist
```

2. Add a minimal `package.json` at `packages/my-new-project/package.json` (example):

```json
{
  "name": "my-new-project",
  "version": "0.0.0",
  "type": "module",
  "private": true,
  "scripts": {
		"lint:css": "stylelint \"source/styles/**/*.css\"",
		"watch:css": "postcss \"source/styles/*.css\" --base source/styles -d dist/styles --config ../../postcss.config.js --watch",
		"watch:js": "node ../../scripts/build.js --watch",
		"start:css": "npm-run-all --parallel lint:css watch:css"
	}
}
```

Adjust the scripts/paths to match whether you use `source/` or `src/` in your package.

3. Add the project to the workspace file `.vscode/monorepo.code-workspace` by adding an entry to the `folders` array:

```jsonc
{ "path": "packages/my-new-project" }
```

4. Reload VS Code (Developer: Reload Window) so the workspace recognizes the new folder.

> Note: After adding dependencies, run `pnpm install` from the repository root so new packages are available to the workspace.

---


## 📝 OutSystems Integration Workflow

1.  **Develop:** Write your logic in the `src/` folder of the respective package using TypeScript.
2.  **Compile:** Check the `dist/` folder for the compiled `.js` or `.css` file.
3.  **Deploy:** \* Open the compiled file in your editor.

    - **Copy** the entire content.
    - **Paste** it into the corresponding **Script** or **Style Sheet** editor in OutSystems Service Studio.

> **Note:** JavaScript is compiled into **IIFE** (Immediately Invoked Function Expression) format. This ensures that when you paste the code into OutSystems, it executes correctly without manual wrapping and prevents variable collisions.
