// src/App.tsx
import { createRootRoute, Outlet, useLocation, useRouter } from "@tanstack/react-router";
import logo from "../assets/logo.png"; // Import the logo image
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/auth/auth.context";

const App = () => {
  const { userData } = useContext(AuthContext);
  const router = useRouter();
  const pathname = useLocation({
    select: (location) => location.pathname,
  });
  const publicRoutes = ["/login", "/signup", "/dashboard"];

  useEffect(() => {
    if(!publicRoutes.includes(pathname)) {
      if(userData) {
        router.navigate({
          to: "/dashboard"
        })
      } else {
        router.navigate({
          to: "/login"
        })
      }
    }
  }, []);

  return (
    <Outlet />
  );
};

export const Route = createRootRoute({
  component: App,
})

export default App;
