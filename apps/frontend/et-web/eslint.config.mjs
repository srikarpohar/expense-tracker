import tseslint from "typescript-eslint";
import prettierPlugin from "eslint-plugin-prettier";
import tsparser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.ts"],
    plugins: {
      "@typescript-eslint": tseslint,
      prettier: prettierPlugin,
    },
    languageOptions: {
      parser: tsparser,
      sourceType: "module",
    },
    ignores: ["./routeTree.gen.ts", "build/dist/index.js"],
    rules: {
      ...tseslint.configs.recommended.rules,
      ...prettierConfig.rules,
      "@/no-unused-vars": "warn",
      "no-console": "off",
      semi: ["error", "always"],
      quotes: ["error", "double"],
      "prettier/prettier": "error",
    },
  },
]);
