import type { IUserPayload } from "expense-tracker-shared";
import { useEffect, useState, type ReactNode } from "react";
import { axiosHttpApiRequestLayer } from "../../api-layer/base.service";
import { AuthContext } from "./auth.context";
import { useQuery } from "@tanstack/react-query";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<IUserPayload | null>(null);

  useEffect(() => {
    console.log("auth provider use effect");
  }, []);

  const verifyTokenQuery = useQuery({
    queryKey: ["verify-token"],
    queryFn: async () => {
      let abortController = new AbortController();
      try {
        const response = await axiosHttpApiRequestLayer.get<any, IUserPayload>("/auth/verify-token", {}, {});
        setUserData(response.data);
        return response.data;
      } catch(error: any) {
        console.log(`Error while verifying token: ${error.message}`);
        setUserData(null);
        return null;
      }
    },
  });

  if(verifyTokenQuery.status == "pending") {
    return (
      <div>Checking if user has logged in....</div>
    )
  }

  return (
    <AuthContext.Provider value={{userData, setUserData}}>
        {children}
    </AuthContext.Provider>
  );
}