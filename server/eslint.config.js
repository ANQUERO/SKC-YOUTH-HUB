import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      "no-undef": "error",
      eqeqeq: "warn",
      curly: "warn",
      "no-multiple-empty-lines": ["warn", { max: 1 }],
      semi: ["warn", "always"],
      quotes: ["warn", "double"],
    },
  },
];
