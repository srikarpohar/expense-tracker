import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import type { RouterContext } from "./routerContext";

export const router = createRouter({
  routeTree,
  context: {
    verifyTokenResponse: undefined!,
  },
} as const);
