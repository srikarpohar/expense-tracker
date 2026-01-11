import { createFileRoute } from '@tanstack/react-router'
import { axiosHttpApiRequestLayer } from '../api-layer/base.service';
import { useEffect, useContext } from 'react';
import { AuthContext } from '../context/auth/auth.context';

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent
})

function RouteComponent() {

  const {userData} = useContext(AuthContext);

  useEffect(() => {
    console.log("use effect");

    return () => {
      console.log("use effect cleanup");
    }
  }, []);

  return <div>Hello {userData?.username}!</div>
}
