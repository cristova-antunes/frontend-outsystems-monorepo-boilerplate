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
├── projects/
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
cd projects/your-package-name
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

## 📝 OutSystems Integration Workflow

1.  **Develop:** Write your logic in the `src/` folder of the respective package using TypeScript.
2.  **Compile:** Check the `dist/` folder for the compiled `.js` or `.css` file.
3.  **Deploy:** \* Open the compiled file in your editor.

    - **Copy** the entire content.
    - **Paste** it into the corresponding **Script** or **Style Sheet** editor in OutSystems Service Studio.

> **Note:** JavaScript is compiled into **IIFE** (Immediately Invoked Function Expression) format. This ensures that when you paste the code into OutSystems, it executes correctly without manual wrapping and prevents variable collisions.
