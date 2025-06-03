// eslint.config.js - Flat config format for ESLint 9+
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat();

export default [
  ...compat.extends("eslint:recommended"),
  {
    rules: {
      "no-else-return": "error",
      "semi": ["error", "always"]
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module"
    },
    linterOptions: {
      reportUnusedDisableDirectives: true
    },
    env: {
      es6: true
    }
  }
];
