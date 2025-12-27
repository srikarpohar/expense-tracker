### Routing - Tanstack Router

1. Add @tanstack/router-plugin and @tanstack/router-cli as dev dependencies to the project.
```pnpm add -D @tanstack/router-plugin @tanstack/router-cli```

2. In ```esbuild.config.mjs``` update the following configuration in plugins.
```
tanstackRouter({
    target: 'react',
    autoCodeSplitting: true,
})
```

3. In package.json add a script to watch routes and generate src/routeTree.gen.ts file:
```
"scripts": {
  "watch:routes": "tsr watch",
  "watch:client": "node build/esbuild.config.dev.mjs",
  "dev": "npm-run-all -p watch:routes watch:client", // install npm-run-all globally and run watch:routes and watch:client parallely.
}
```


3. There are 2 types of routing methods in tanstack - file based and code based routing methods.

**File based routing** - Routes are take from folder structure. For example, adding ```edit.tsx``` in ```posts``` folder gives us a route of ```/posts/edit```.

**Code based routing** - Routes are organised based on the code. For example, check below code:
```
import { createRootRoute, createRoute } from '@tanstack/react-router'

const rootRoute = createRootRoute()

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
})

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'about',
})

const postsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'posts',
})

const postsIndexRoute = createRoute({
  getParentRoute: () => postsRoute,
  path: '/',
})

const postRoute = createRoute({
  getParentRoute: () => postsRoute,
  path: '$postId',
})

const postEditorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'posts/$postId/edit',
})

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'settings',
})

const profileRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: 'profile',
})

const notificationsRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: 'notifications',
})

const filesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'files/$',
})
```

Here, ```getParentRoute``` gives the segment of url based on the code written.

**Usage**: This project uses **file based routing system**.