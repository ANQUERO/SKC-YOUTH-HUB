import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        process: "readonly",
        console: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        module: "readonly",
        require: "readonly",
      },
    },
    rules: {
      "no-unused-vars": ["warn", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }],
      "no-console": "off",
      "no-undef": "error",
      eqeqeq: "warn",
      curly: "warn",
      "no-multiple-empty-lines": ["warn", { max: 1 }],
      semi: ["warn", "always"],
      quotes: ["warn", "double"],
      "no-constant-binary-expression": "warn",
    },
  },
];