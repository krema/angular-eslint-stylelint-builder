import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import unusedImportsPlugin from "eslint-plugin-unused-imports";

export default [
  js.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: [
          "tsconfig.json",
          "tsconfig.lib.json",
          "tsconfig.spec.json"
        ],
        createDefaultProgram: false,
        ecmaVersion: 2022,
        sourceType: "module"
      },
      globals: {
        NodeJS: "readonly",
        describe: "readonly",
        it: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        expect: "readonly",
        jest: "readonly",
        console: "readonly",
        process: "readonly"
      }
    },
    plugins: {
      "@typescript-eslint": tseslint,
      "unused-imports": unusedImportsPlugin,
      "prettier": prettierPlugin,
      "import": importPlugin
    },
    rules: {
      "prettier/prettier": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "_"
        }
      ],
      "@typescript-eslint/array-type": "error",
      "@typescript-eslint/ban-ts-comment": "off",
      "no-else-return": "error",
      "semi": ["error", "always"]
    },
    settings: {
      "import/resolver": {
        typescript: {}
      }
    }
  }
];
