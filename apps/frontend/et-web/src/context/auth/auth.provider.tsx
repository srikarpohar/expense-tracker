import type { ILogoutUserResponseDTO, IUserPayload, LoginUserRequestDto, LoginUserResponseDto, VerifyTokenResponseDTO } from "expense-tracker-shared";
import { useState, type ReactNode } from "react";
import { axiosHttpApiRequestLayer } from "../../api-layer/base.service";
import { AuthContext } from "./auth.context";
import { useMutation, useQuery } from "@tanstack/react-query";
import { router } from "../../router";
import type { ILoginPageState } from "../../routes/(auth)/login";

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

  const logoutUser = async () => {
    try {
      const response = await axiosHttpApiRequestLayer.post<{}, ILogoutUserResponseDTO>("/auth/logout", {});
      if(response.statusCode == 201 && response.data.isLoggedOut) {
        console.log("User logged out successfully");
        setUserData(null);
      } else {
        console.log("Unexpected response while logging out user:", response);
      }
    } catch(error) {
      console.log(`Error while logging out user: ${error}`);
    } finally {
      router.navigate({
        to: "/login",
      });
    }
  }

  const loginUser = useMutation<LoginUserResponseDto, unknown, ILoginPageState, unknown>({
    mutationFn: async (data: ILoginPageState) => {
      // Perform login logic here, e.g., call an API
      const response = await axiosHttpApiRequestLayer.post<LoginUserRequestDto, LoginUserResponseDto>("/auth/login", {
        username: data.username,
        password: data.password,
      });

      // Done: store {{response.data}} (the token) in local storage or context
      console.log("Logging in with:", response.data);
      setUserData?.(response.data.payload);
      return response.data;
    },
    onSuccess: (response: LoginUserResponseDto) => {
      router.update({ context: { verifyTokenResponse: {payload: response.payload} } });
      router.navigate({
        to: "/dashboard",
      });
      console.log("Login successful", response);
    },
    onError: (error) => {
      router.update({ context: { verifyTokenResponse: null } });
      router.navigate({
        to: "/dashboard",
      });
      console.error("Login failed:", error);
    }
  });

  if(verifyTokenQuery.isPending) {
    return (
      <div>Checking if user has logged in....</div>
    )
  }

  return (
    <AuthContext.Provider value={{userData, setUserData, logoutUser, loginUser}}>
        {children}
    </AuthContext.Provider>
  );
}

// async (data: ILoginPageState) => {
//     try {
//       // Perform login logic here, e.g., call an API
//       const response = await axiosHttpApiRequestLayer.post<LoginUserRequestDto, LoginUserResponseDto>("/auth/login", {
//         username: data.username,
//         password: data.password,
//       });
  
//       // Done: store {{response.data}} (the token) in local storage or context
//       console.log("Logging in with:", response.data);
//       setUserData?.(response.data.payload);
//     } catch(error) {
//       console.log(`Error while logging out user: ${error}`);
//     } finally {
//       router.navigate({
//         to: "/login",
//       });
//     }
//   }