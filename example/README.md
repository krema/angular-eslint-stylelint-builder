# Example: Angular App Usage for angular-eslint-stylelint-builder

This folder contains an example Angular v20 app to demonstrate and test the builder library in a real project setup.

## Structure
- `app/` — Angular v20 application
  - `eslint.config.js` — ESLint config for the app
  - `stylelint.config.js` — Stylelint config for the app
  - `src/` — Angular source files

## How to Use
1. Build the builder library (from the project root):
   ```sh
   cd ../../
   pnpm build
   ```

2. Install dependencies for the Angular app:
   ```sh
   cd example/app
   pnpm install
   ```
3. Run the builder lint task in the Angular app:
   ```sh
   pnpm exec ng lint
   ```

This will lint both TypeScript/HTML (ESLint) and CSS (Stylelint) files using your builder.

---

You can add or modify files in `example/app/src/` to test linting functionality and error reporting.
