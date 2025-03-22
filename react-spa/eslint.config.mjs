import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

export default defineConfig([
    { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
    { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], languageOptions: { globals: globals.browser } },
    { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], plugins: { js }, extends: ["js/recommended"] },
    tseslint.configs.recommended,
    {
      files: ["**/*.{js,mjs,cjs,jsx,tsx}"],
      plugins: {
        react: pluginReact
      },
      settings: {
        react: {
          version: "19.0.0"
        }
      },
      extends: [pluginReact.configs.flat.recommended],
      rules: {
        "react/react-in-jsx-scope": "off" // Add to prevent tests causing errors with the statement: render(<App />);
      }
    },
]);