import js from "@eslint/js";

export default [
  js.configs.recommended,
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
    files: ["**/*.ts"],
  }
];
