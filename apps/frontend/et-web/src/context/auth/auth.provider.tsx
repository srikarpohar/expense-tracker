import type { IUserPayload, VerifyTokenResponseDTO } from "expense-tracker-shared";
import { useState, type ReactNode } from "react";
import { axiosHttpApiRequestLayer } from "../../api-layer/base.service";
import { AuthContext } from "./auth.context";
import { useQuery } from "@tanstack/react-query";
import { router } from "../../router";
import type { AxiosResponse } from "axios";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<IUserPayload | null>(null);

  const verifyTokenQuery = useQuery({
    queryKey: ["verify-token"],
    queryFn: async () => {
      try {
        const response = await axiosHttpApiRequestLayer.get<any, VerifyTokenResponseDTO>("/auth/verify-token", {}, {});
        setUserData({
          sub: response.data.payload.sub,
          username: response.data.payload.username
        });
        router.update({ context: { verifyTokenResponse: response.data } });
        return response;
      } catch(error: any) {
        console.log(`Error while verifying token: ${error.message}`);
        setUserData(null);
        router.update({ context: { verifyTokenResponse: null } });
        throw error;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 60,
  });

  if(verifyTokenQuery.isPending) {
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