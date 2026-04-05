import { createRootRouteWithContext, Outlet, redirect } from "@tanstack/react-router";
import type { RouterContext } from "../routerContext";
import "../styles/index.css";

const PUBLIC_PATHS = new Set(["/login", "/signup"]);

const normalizePath = (value: string) => {
  if (!value || value === "/") {
    return "/";
  }
  return value.replace(/\/+$/, "");
};

const isPublicRoute = (pathname: string) => PUBLIC_PATHS.has(normalizePath(pathname));

const App = () => <Outlet />;

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: ({ context, location }) => {
    console.log("Checking context:", context);
    if (isPublicRoute(location.pathname)) {
      return;
    }

    if(normalizePath(location.pathname) === "/" && context.verifyTokenResponse) {
      throw redirect({
        to: "/dashboard",
      });
    }

    if (!context.verifyTokenResponse) {
      console.log("User is not authenticated. Redirecting to login page.");
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: App,
});

export default App;
