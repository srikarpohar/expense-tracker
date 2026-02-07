## Tailwind setup:

1. Install an esbuild plugin for tailwindcss like `esbuild-plugin-tailwindcss`.

```
pnpm add -D esbuild-plugin-tailwindcss
```

2. Import the tailwind plugin in **esbuild** config file and add the plugin in **plugins** section of the config.

```
import tailwindPlugin from "esbuild-plugin-tailwindcss";

tailwindPlugin({}), // add options if required.
```

3. Create a tailwind config file in the root directory and add the following contents as basic configuration:

```
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/index.html", // If you have an index.html file
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

4. Use **PostCSS** plugin to optimise, tansform CSS code unlocking Tailwind's core features like Just-In-Time (JIT) compilation, configuration customization, and production optimization. 

Create a postcss config file in the root directory and name it `postcss.config.js` with following content.

```
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

Create a plugin file for postcss with following contents.
```
import { readFile } from 'node:fs/promises';
import postcss from 'postcss';

export const postCssPlugin = ({
  plugins = []
} = {}) => {
    return {
        name: "postcss",
        setup(build) {
            build.onLoad({ filter: /\.css$/ }, async (args) => {
                const raw = await readFile(args.path, 'utf8');
                const source = await postcss(plugins).process(raw.toString(), {
                    from: args.path
                });
                return {
                    contents: source.css,
                    loader: 'css'
                };
            });
        }
    }
}
```