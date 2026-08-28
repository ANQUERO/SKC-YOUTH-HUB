import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import importPlugin from "eslint-plugin-import";

export default [
  { ignores: ["dist"] },

  {
    files: ["**/*.{js,jsx}"],

    languageOptions: {
      ecmaVersion: "latest",
      globals: globals.browser,

      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: {
          jsx: true,
        },
        sourceType: "module",
      },
    },

    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      import: importPlugin,
    },

    settings: {
      "import/extensions": [".js", ".jsx"],
      "import/resolver": {
        typescript: {
          project: "./jsconfig.json",
        },
        node: {
          extensions: [".js", ".jsx", ".json"],
        },
      },
    },

    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      "no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^[A-Z_]",
          argsIgnorePattern: "^_",
        },
      ],

      "react-refresh/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
        },
      ],

      // Import checking
      "import/no-unresolved": "error",
      "import/no-duplicates": "error",
      "import/default": "error",
      "import/named": "error",
      "import/namespace": "error",
    },
  },

  {
    files: ["vite.config.js"],

    languageOptions: {
      globals: globals.node,
    },
  },

  {
    files: ["src/context/*.{js,jsx}"],

    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
];
