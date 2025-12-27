import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import {routeTree} from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";

// if(process.env.NODE_ENV == "dev") {
//     new EventSource('/esbuild').addEventListener('change', () => location.reload())
// }

// Create router with route tree generated from file based router exported from routeTree.gen.ts.
const router = createRouter({
    routeTree: routeTree
})

declare module '@tanstack/react-router' {
    interface Register {
        // This infers the type of our router and registers it across your entire project
        router: typeof router
    }
}

// Create a client
const queryClient = new QueryClient();

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
    <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}/>
    </QueryClientProvider>
);
