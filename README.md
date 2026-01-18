# OutSystems Front-End Monorepo

This monorepo is a centralized development environment for managing high-performance CSS and JavaScript components for OutSystems applications. It leverages modern tooling to provide a premium local developer experience (DX) while ensuring the output is optimized for the OutSystems platform.

## 🚀 Purpose

OutSystems does not provide a CLI for direct asset synchronization. This project bridges that gap by allowing developers to:

- **Write Modern Code:** Use TypeScript (ESNext) and PostCSS.
- **Maintain 1-1 Mapping:** Every source file in `src/` maps to a single optimized file in `dist/`, making it easy to copy-paste into Service Studio.
- **Ensure Consistency:** Share linting (ESLint), formatting (Prettier), and build logic across multiple OutSystems modules/themes.
- **Performance First:** Use `esbuild` for ultra-fast compilation and minification.

## 🛠 Tech Stack

- **Runtime:** Node.js (ESM)
- **Package Manager:** pnpm Workspaces
- **Compiler:** [esbuild](https://esbuild.github.io/) (Configured for IIFE output)
- **Linter:** [ESLint](https://eslint.org/)
- **Formatter:** [Prettier](https://prettier.io/)
- **CSS Processor:** [PostCSS](https://postcss.org/)

## 📂 Project Structure

```text
├── packages/
│   ├── project-a/          # Specific OutSystems Application/Module
│   │   ├── src/            # Source TS/CSS files
│   │   └── dist/           # Compiled assets for OutSystems
│   └── project-b/          # Another Application
├── scripts/
│   ├── build-scripts.js    # Shared esbuild engine for JS compilation
│   └── build-styles.js     # Shared PostCSS engine for CSS compilation
├── eslint.config.mjs       # Shared ESLint configuration
├── stylelint.config.mjs    # Shared stylelint configuration
├── postcss.config.js       # Shared PostCSS configuration
└── package.json            # Monorepo configuration & shared dependencies
```

## 🏗 Getting Started

### Install Dependencies

From the root directory

```bash
pnpm install
```

### Developing

To work on a specific project, navigate to the package and use the available scripts:

```bash
cd packages/your-package-name
```

#### Scripts

For JavaScript/TypeScript compilation:

```bash
# Watch mode (automatically recompiles on file changes)
pnpm run watch:js

# Build once
pnpm run build:js
```

#### Styling

CSS compilation supports two modes:

```bash
# Development mode (watch for changes)
pnpm start:css

# Build mode (optimized for production)
pnpm build:css
```

### Code Quality

We use ESLint for linting and Prettier for code formatting.

```bash
pnpm run lint      # Check for linting errors
pnpm run format    # Auto-format all files with Prettier
```

### Editor Setup (VS Code) 🔧

#### Local Development

- Install the **ESLint** extension (dbaeumer.vscode-eslint) from the VS Code Marketplace.
- Install the **Prettier** extension (esbenp.prettier-vscode) from the VS Code Marketplace.
- Optional: enable format on save by adding to your workspace settings:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[typescript]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[css]": { "editor.defaultFormatter": "esbenp.prettier-vscode" }
}
```

#### Development Container (Docker)

This project includes Docker dev container configuration for VS Code:

- The dev container uses a **Node.js with TypeScript** image
- All necessary tools and dependencies are pre-installed
- To use it, open the project in VS Code and select "Reopen in Container" when prompted, or use the command palette (`Ctrl+Shift+P` → "Dev Containers: Reopen in Container")
- The container includes all extensions and VS Code settings configured for the project

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
    "watch:js": "node ../../scripts/build-scripts.js --watch",
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
