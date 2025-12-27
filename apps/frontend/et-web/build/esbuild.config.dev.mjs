// let ctx = await esbuild
//   .context({
//     entryPoints: ["src/index.*"],
//     outdir: "build/dist",
//     jsx: "transform",
//     bundle: true, // Enable bundling
//     format: "esm", // Enable ES Modules
//     //   minify: true, // Minify the output for production
//     sourcemap: false, // Generate sourcemaps
//     loader: {
//       ".png": "file", // Handle PNG images
//       ".css": "css", // Handle CSS files
//       ".html": "copy", // Handle HTML files
//     },
//     logLevel: "info",
//     entryNames: "[name]",
//     assetNames: "assets/[name]-[hash]",
//     define: {
//       "process.env.NODE_ENV": '"dev"',
//     },
//     external: ["node_modules/*"], // Exclude specific modules from being bundled (e.g., node_modules)
//     plugins: [
//       postCssPlugin({
//         plugins: [
//           tailwindcss
//         ]
//       }),
//       tanstackRouter({
//         target: 'react',
//         autoCodeSplitting: true
//       }),
      
//     ],
//   })

// console.log("Build complete.");

// // Live reload
// // watch file changes
// await ctx.watch();

// console.log("Watching changes...");

// // serve from esbuild instead of another web server
// let { hosts, port } = await ctx.serve({
//   servedir: "build/dist",
//   port: 4200
// })

// console.log("Serving host", hosts[0], "at port", port);

// creating http server for SPA using esbuild for bundling.
// const BUILD_DIR = path.join(process.cwd(), 'build/dist');
// const INDEX_HTML = path.join(BUILD_DIR, 'index.html');
// const PORT = 3000;
// const HOST = "localhost";

// async function buildApp() {
//   try {
//     await esbuild.build({
//       entryPoints: ["src/index.*"],
//       outdir: "build/dist",
//       jsx: "transform",
//       bundle: true, // Enable bundling
//       format: "esm", // Enable ES Modules
//       //   minify: true, // Minify the output for production
//       sourcemap: false, // Generate sourcemaps
//       loader: {
//         ".png": "file", // Handle PNG images
//         ".css": "css", // Handle CSS files
//         ".html": "copy", // Handle HTML files
//       },
//       logLevel: "info",
//       entryNames: "[name]",
//       assetNames: "assets/[name]-[hash]",
//       define: {
//         "process.env.NODE_ENV": '"dev"',
//       },
//       external: ["node_modules/*"], // Exclude specific modules from being bundled (e.g., node_modules)
//       plugins: [
//         postCssPlugin({
//           plugins: [
//             tailwindcss
//           ]
//         }),
//         tanstackRouter({
//           target: 'react',
//           autoCodeSplitting: true
//         }),
//       ],
//     })
//     console.log("[esbuild] Build finished successfully")
//   } catch(error) {
//     console.error('[esbuild] Build failed:', error.message);
//   }
// }

// // Function to serve static files
// function serveStaticFile(filePath, res) {
//     const extname = path.extname(filePath);
//     let contentType = 'text/html';
//     switch (extname) {
//         case '.js':
//             contentType = 'text/javascript';
//             break;
//         case '.css':
//             contentType = 'text/css';
//             break;
//         case '.json':
//             contentType = 'application/json';
//             break;
//         case '.png':
//             contentType = 'image/png';
//             break;
//         case '.jpg':
//             contentType = 'image/jpg';
//             break;
//     }

//     fs.readFile(filePath, async (err, content) => {
//         if (err) {
//             if (err.code === 'ENOENT') {
//                 fs.readFile(INDEX_HTML, (err, content) => {
//                   if(err && err.code === "ENOENT") {
//                     res.writeHead(404);
//                     res.end(`File not found: ${filePath}`);
//                   }
//                   res.writeHead(200, { 'Content-Type': 'text/html' });
//                   res.end(content);
//                 })
//             } else {
//                 res.writeHead(500);
//                 res.end(`Server Error: ${err.code}`);
//             }
//         } else {
//             res.writeHead(200, { 'Content-Type': contentType });
//             res.end(content, 'utf-8');
//         }
//     });
// }

// // HTTP listener.
// const requestListener = function (req, res) {
//   // Determine file path, prioritizing dist over public for bundled assets
//   let filePath;
//   if (req.url === '/') {
//     filePath = path.join(BUILD_DIR, 'index.html');
//   } else {
//     filePath = path.join(BUILD_DIR, req.url);
//   }

//   serveStaticFile(filePath, res);
// };

// const server = http.createServer(requestListener);

// // Build the app first, then start the server
// buildApp().then(() => {
//     server.listen(PORT, HOST, () => {
//         console.log(`Server is running on http://${HOST}:${PORT}`);
//     });
// });

import { tanstackRouter } from '@tanstack/router-plugin/esbuild';
import tailwindPlugin from "esbuild-plugin-tailwindcss";
import dotenv from 'dotenv';
import {createServer} from "esbuild-server";

// Load environment variables from .env file
dotenv.config();

// Prepare the define object for esbuild
const define = {};
for (const k in process.env) {
  // Stringify all values to be inlined as string literals in the bundled code
  define[`process.env.${k}`] = JSON.stringify(process.env[k]);
}

const esbuildOptions = {
  entryPoints: ["src/index.tsx"],
  outdir: "build/dist",
  jsx: "transform",
  bundle: true, // Enable bundling
  format: "esm", // Enable ES Modules
  //   minify: true, // Minify the output for production
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
    }),
  ]
}

const serverOptions = {
  static: "build/dist",
  historyApiFallback: true,
  injectLiveReload: true,
  port: 4200
}

createServer(esbuildOptions, serverOptions).start();