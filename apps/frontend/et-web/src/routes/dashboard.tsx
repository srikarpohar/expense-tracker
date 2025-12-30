import { createFileRoute } from '@tanstack/react-router'
import { axiosHttpApiRequestLayer } from '../api-layer/base.service';
import { useEffect } from 'react';

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent
})

function RouteComponent() {

  useEffect(() => {
    console.log("use effect");

    return () => {
      console.log("use effect cleanup");
    }
  }, []);

  return <div>Hello "/dashboard"!</div>
}
