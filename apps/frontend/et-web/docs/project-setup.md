**Commands to generate project files(No framework setup).**

**React-Typescript-ESBuild**

1. Generate a default package.json file.
   `pnpm init`
   <br/>

2. Create source and assets directory alongside its files.

```
mkdir src
cd src
touch App.tsx
touch index.tsx index.html index.css
touch assets.d.ts
```

3. Create a folder for assets

```
mkdir assets
cd assets
touch logo.png
```

4. Create output directory(dist)

```
cd ../..
mkdir dist
```

After running all commands, project folder looks like this.

```
react-ts-esbuild/
├── dist/
├── src/
│   ├── App.tsx
│   └── index.tsx
│   └── index.html
│   └── index.css
│   └── assets.d.ts
│   ├── assets/
│   │   └── logo.png
└── package.json
```

5. Install react dependencies.

```
pnpm add react react-dom
pnpm add -D typescript esbuild live-server concurrently @types/react @types/react-dom
```

6. Create typescript configuration file.
   `npx tsc --init`

7. Add a default set of compiler options.

```
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "moduleResolution": "node",
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

8. Create a configuration file for esbuild - esbuild.config.mjs
   with default options.

```
touch esbuild.config.mjs

import esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['src/index.*'],
  outdir: 'dist',
  bundle: true, // Enable bundling
  format: 'esm', // Enable ES Modules
  minify: true, // Minify the output for production
  sourcemap: false, // Generate sourcemaps
  loader: {
    '.png': 'file', // Handle PNG images
    '.css': 'css', // Handle CSS files
    '.html': 'copy' // Handle HTML files
  },
  logLevel: 'info',
  entryNames: '[name]',
  assetNames: 'assets/[name]-[hash]',
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  external: ['node_modules/*'], // Exclude specific modules from being bundled (e.g., node_modules)
  plugins: [],
}).then(() => {
  console.log('Build complete.');
}).catch(() => process.exit(1));
```

9. Create sample code in index.html. This is the entry point where our React app will be injected. The div with id="root" is where the React component tree will be mounted.

```
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Expense tracker</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="./index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script src="./index.js"></script>
  </body>
</html>
```

10. Add following code in index.tsx

```
// index.tsx
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
```

11. Next, create the App component file.

```
// src/App.tsx
import logo from "./assets/logo.png"; // Import the logo image

const App = () => {
    return (
        <div>
          <h1>Hello, React + TypeScript + esbuild!</h1>
          <img src={logo} alt="Logo" /> {/* Use the imported logo here */}
        </div>
      );
};

export default App;
```

12. Add following code in index.css

```
body {
    font-family: Arial, sans-serif;
    padding: 2rem;
    background-color: #c96969;
}
```

13. Bundle images - To include images in your TypeScript + esbuild project, you need to configure esbuild to handle static assets like .png, .jpg, .svg, and more.

We imported logo.png in src/App.tsx file but it shows this error.

```
Cannot find module ‘./assets/logo.png’ or its corresponding type declarations.ts(2307)
```

To solve this, add the following to **assets.d.ts**:

```
declare module '*.png' {
    const value: string;
    export default value;
}
```

14. Add scripts in package.json

```
"scripts": {
    "build": "node build/esbuild.config.mjs",
    "dev:esbuild": "node build/esbuild.config.dev.mjs", // has watch and serve mode as well.
    <!-- "dev:serve": "live-server dist", -->
    <!-- "dev": "concurrently \"npm run dev:esbuild\" \"npm run dev:server\"" -->
}
```

15. Run the project using `pnpm run et-web dev`.

This command starts live-server, which serves your dist/ folder and opens the project in your default web browser at http://127.0.0.1:8080 (or another available port if that one’s taken).

16. Building the Project ⚒️ is required to ready your project for production. Use `pnpm run et-web build`.

Running npm run build will trigger esbuild to bundle and optimize your project for deployment.