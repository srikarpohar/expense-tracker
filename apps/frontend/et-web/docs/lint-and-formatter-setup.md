### Linting and Formatting setup using ESLint and Prettier.

Maintaining clean code and structure to the code is important in a project. Linting tools like **eslint** and formatters like **Prettier** can be used to maintain them. In this doc, we will setup **eslint** and **prettier** configuration to an already existing React + Typescript + esbuild project.

1. Install ESLint and TypeScript Plugin

```
pnpm add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-plugin-prettier eslint-config-prettier
```

- `eslint` is the main ESLint package.
- `@typescript-eslint/parser` allows ESLint to parse TypeScript code.
- `@typescript-eslint/eslint-plugin` provides recommended TypeScript rules.

2. Run the ESLint initialization command to create the eslint.config.mjs file:

`npx eslint --init`

Options selected for this project:

```
✔ What do you want to lint? · javascript
✔ How would you like to use ESLint? · problems
✔ What type of modules does your project use? · esm
✔ Which framework does your project use? · react
✔ Does your project use TypeScript? · No / Yes
✔ Where does your code run? · browser
✔ Which language do you want your configuration file be written in? · js
ℹ The config that you've selected requires the following dependencies:

eslint, @eslint/js, globals, typescript-eslint, eslint-plugin-react
✔ Would you like to install them now? · No / Yes
✔ Which package manager do you want to use? · pnpm
```

3. Edit `eslint.config.mjs` file to configure ESLint for typescript:

```
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
  {
    files: ["**/*.ts"],

    languageOptions: {
      parser: tsparser,
      sourceType: "module",
    },

    plugins: {
      "@typescript-eslint": tseslint,
      prettier: prettierPlugin,
    },

    rules: {
      ...tseslint.configs.recommended.rules,
      ...prettierConfig.rules,
      "@typescript-eslint/no-unused-vars": "warn",
      "no-console": "warn",
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
      "prettier/prettier": "error",
    },
  },
];
```

4. Installing and Configuring Prettier
   Prettier ensures that your code follows a consistent style.

- `Prettier` is an opinionated code formatter that automatically ensures consistent code styling across your project. It supports JavaScript, TypeScript, HTML, CSS, JSON, and more.
- `eslint-config-prettier` disables ESLint rules that conflict with Prettier.
- `eslint-plugin-prettier` runs Prettier as an ESLint rule.

5. Create a `.prettierrc.json` file in your project root:

```
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "all"
}
```

6. To check linting and formatting, use following commands:

Linting - ```npx eslint .```
Formatting - ```npx prettier --write .```

Linting errors can be fixed by using ```npx eslint . --fix```

Update ```package.json``` with following scripts:
```
"scripts": {
  // other scripts.
  "eslint-check-only": "npx eslint .",
  "eslint-fix": "npx eslint . --fix",
  "prettier": "npx prettier --write ."
}
```

7. Install ESLint and Prettier extensions in VS Code.
Create an .vscode/settings.json with below code:
```
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": ["javascript", "typescript"]
}
```
Now, ESLint and Prettier will format your code automatically on save.
