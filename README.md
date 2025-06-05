# Angular ESLint + Stylelint Builder

[![npm version](https://badge.fury.io/js/@krema%2Fangular-eslint-stylelint-builder.svg?icon=si%3Anpm)](https://badge.fury.io/js/@krema%2Fangular-eslint-stylelint-builder)
![integration test](https://github.com/krema/angular-eslint-stylelint-builder/actions/workflows/integration-test.yml/badge.svg)
![unit test](https://github.com/krema/angular-eslint-stylelint-builder/actions/workflows/unit-test.yml/badge.svg)

A unified Angular CLI builder for linting Angular projects with [ESLint](https://eslint.org/) and [Stylelint](https://stylelint.io/) in a single step.

---

## Version Compatibility

- **< 2.0.0**: Supports Angular **v9 – v16** and **Stylelint ≤ 15**
- **>= 2.0.0**: Supports Angular **v17 – v20** and **Stylelint 16+**

---

## Features

- Lint both TypeScript and stylesheets in one command
- Supports ESLint and Stylelint configuration and ignore patterns
- Output to file or console, with multiple formatter options
- Caching for faster linting
- Fine-grained control over warnings, errors, and exit codes

---

## Prerequisites

- Angular CLI project (v9+)
- ESLint and Stylelint installed and configured (e.g., `eslint.config.js` for flat config, or `.eslintrc` for legacy config, and `stylelint.config.js` for Stylelint)

---

## Installation

```bash
npm install --save-dev @krema/angular-eslint-stylelint-builder
```

---

## Usage

1. **Update your `angular.json`**

   Replace the default lint builder with this one:

   ```json
   "lint": {
     "builder": "@krema/angular-eslint-stylelint-builder:lint",
     "options": {
       "eslintFilePatterns": ["**/*.ts"],
       "stylelintFilePatterns": ["**/*.scss"]
     }
   }
   ```

2. **Run linting**

   ```bash
   ng lint
   ```

---

## Configuration Options

| Name                     | Default           | Description                                                                 | Required | Linter    |
|--------------------------|-------------------|-----------------------------------------------------------------------------|----------|-----------|
| **Basic configuration:** |
| `eslintFilePatterns`     | `[]`              | Files/globs for ESLint                                                      | Yes      | eslint    |
| `eslintConfig`           |                   | Path to ESLint config (supports both flat config `eslint.config.js` and legacy `.eslintrc.*`) | No       | eslint    |
| `stylelintFilePatterns`  | `[]`              | Files/globs for Stylelint                                                   | Yes      | stylelint |
| `stylelintConfig`        |                   | Path to Stylelint config (`stylelint.config.js` or legacy `.stylelintrc.*`)  | No       | stylelint |
| `noEslintrc`             | `false`           | Disable `.eslintrc.*` and `package.json` config                             | No       | eslint    |
| `fix`                    | `false`           | Auto-fix fixable issues                                                     | No       | both      |
| **Cache-related:**       |
| `eslintCache`            | `false`           | Enable ESLint cache                                                         | No       | eslint    |
| `stylelintCache`         | `false`           | Enable Stylelint cache                                                      | No       | stylelint |
| `eslintCacheLocation`    | `.eslintcache`    | ESLint cache file/directory                                                 | No       | eslint    |
| `stylelintCacheLocation` | `.stylelintcache` | Stylelint cache file/directory                                              | No       | stylelint |
| `eslintCacheStrategy`    | `metadata`        | ESLint cache strategy (`metadata` or `content`)                             | No       | eslint    |
| **File Enumeration:**    |
| `eslintIgnorePatterns`   | `[]`              | Glob patterns to ignore (ESLint 9+)                                         | No       | eslint    |
| `stylelintIgnorePatterns`| `[]`              | Glob patterns to ignore (Stylelint 16+)                                     | No       | stylelint |
| **Output:**              |
| `outputFile`             |                   | Write report to file instead of console                                     | No       | both      |
| `format`                 | `stylish`         | Output formatter (see [ESLint formatters](https://eslint.org/docs/user-guide/formatters/)) | No | both |
| `silent`                 | `false`           | Hide output text                                                            | No       | both      |
| **Handling warnings:**   |
| `quiet`                  | `false`           | Only show errors (ignore warnings)                                          | No       | both      |
| `maxWarnings`            | `-1`              | Max warnings before nonzero exit code                                       | No       | both      |
| `force`                  | `false`           | Succeed even if there are lint errors                                       | No       | both      |

---

## Example

```json
"lint": {
  "builder": "@krema/angular-eslint-stylelint-builder:lint",
  "options": {
    "eslintFilePatterns": ["src/**/*.ts"],
    "stylelintFilePatterns": ["src/**/*.scss"],
    "fix": true
  }
}
```

---

## License

MIT
