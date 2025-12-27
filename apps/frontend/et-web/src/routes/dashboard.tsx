import { createFileRoute } from '@tanstack/react-router'
import { axiosHttpApiRequestLayer } from '../api-layer/base.service';

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
  beforeLoad: async (routeContext) => {
    // You can add authentication checks here
    const response = await axiosHttpApiRequestLayer.get("/dashboard", {});
    console.log("Navigating to /dashboard", response);
  }
})

function RouteComponent() {
  return <div>Hello "/dashboard"!</div>
}
