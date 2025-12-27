import esbuild from "esbuild";
import { tanstackRouter } from '@tanstack/router-plugin/esbuild';
import tailwindPlugin from "esbuild-plugin-tailwindcss";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Prepare the define object for esbuild
const define = {};
for (const k in process.env) {
  // Stringify all values to be inlined as string literals in the bundled code
  define[`process.env.${k}`] = JSON.stringify(process.env[k]);
}

esbuild
  .build({
    entryPoints: ["src/index.*"],
    outdir: "build/dist",
    bundle: true, // Enable bundling
    format: "esm", // Enable ES Modules
    minify: true, // Minify the output for production
    sourcemap: false, // Generate sourcemaps
    loader: {
      ".png": "file", // Handle PNG images
      ".css": "css", // Handle CSS files
      ".html": "copy", // Handle HTML files
    },
    logLevel: "info",
    entryNames: "[name]",
    assetNames: "assets/[name]-[hash]",
    define: define,
    external: ["node_modules/*"], // Exclude specific modules from being bundled (e.g., node_modules)
    plugins: [
      tailwindPlugin({}),
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true
      })
    ],
  })
  .then(() => {
    console.log("Build complete.");
  })
  .catch(() => process.exit(1));
