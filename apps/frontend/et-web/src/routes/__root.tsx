// src/App.tsx
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import logo from "../assets/logo.png"; // Import the logo image

const App = () => {

  return (
    <Outlet />
  );
};

export const Route = createRootRoute({
  component: App,
})

export default App;
