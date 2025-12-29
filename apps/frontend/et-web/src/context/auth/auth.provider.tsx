import type { IUserPayload } from "expense-tracker-shared";
import { useEffect, useState, type ReactNode } from "react";
import { axiosHttpApiRequestLayer } from "../../api-layer/base.service";
import { AuthContext } from "./auth.context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<IUserPayload | null>(null);

  useEffect(() => {
    axiosHttpApiRequestLayer.get<any, IUserPayload>("/auth/verify-token", {}).then(res => {
      setUserData(res.data);
    }).catch(error => {
      console.log(error);
      setUserData(null);
    });

    return () => {
      console.log("Use abort controller to stop call");
      setUserData(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{userData}}>
        {children}
    </AuthContext.Provider>
  );
}