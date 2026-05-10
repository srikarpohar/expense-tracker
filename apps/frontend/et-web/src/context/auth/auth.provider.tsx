import type { ILogoutUserResponseDTO, IUserPayload, LoginUserRequestDto, LoginUserResponseDto, VerifyTokenResponseDTO } from "expense-tracker-types";
import { useState, type ReactNode } from "react";
import { axiosHttpApiRequestLayer } from "../../api-layer/base.service";
import { AuthContext } from "./auth.context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "../../router";
import type { ILoginPageState } from "../../routes/(auth)/login";
import type { IApiResponse } from "../../types/api.types";

const AUTH_TOKEN_STORAGE_KEY = "authToken";
const VERIFY_TOKEN_RESPONSE_KEY = "verifyTokenResponse";
// const VERIFY_TOKEN_RESPONSE_UPDATED_AT_KEY = "verifyTokenResponseUpdatedAt";

const isBrowser = () => typeof window !== "undefined";

// const persistAuthToken = (token: string) => {
//   if (!isBrowser()) return;
//   window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
// };

// const clearAuthToken = () => {
//   if (!isBrowser()) return;
//   window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
// };

const persistVerifyTokenResponse = (response: VerifyTokenResponseDTO) => {
  if (!isBrowser()) return;
  const authTokenDuration = parseInt(process.env.REACT_APP_AUTH_TOKEN_DURATION || '0');
  window.localStorage.setItem(VERIFY_TOKEN_RESPONSE_KEY, JSON.stringify({
    ...response,
    expiryTime: Date.now() + authTokenDuration * 1000,
  }));
  // window.localStorage.setItem(VERIFY_TOKEN_RESPONSE_UPDATED_AT_KEY, Date.now().toString());
};

const clearVerifyTokenResponse = () => {
  if (!isBrowser()) return;
  window.localStorage.removeItem(VERIFY_TOKEN_RESPONSE_KEY);
  // window.localStorage.removeItem(VERIFY_TOKEN_RESPONSE_UPDATED_AT_KEY);
};

const readVerifyTokenResponseFromStorage = (): (VerifyTokenResponseDTO & { expiryTime: number }) | null => {
  if (!isBrowser()) return null;
  const storedValue = window.localStorage.getItem(VERIFY_TOKEN_RESPONSE_KEY);
  if (!storedValue) return null;
  try {
    const userData = JSON.parse(storedValue) as (VerifyTokenResponseDTO & { expiryTime: number });
    // Check if the token has expired from the token's expiry time.
    if (Date.now() > userData.expiryTime) {
      clearVerifyTokenResponse();
      return null;
    }

    return userData;
  } catch (error) {
    clearVerifyTokenResponse();
    return null;
  }
};

const getInitialVerifyTokenData = () => {
  const response = readVerifyTokenResponseFromStorage();
  if (!response) {
    return;
  }

  if (!isBrowser()) {
    return response;
  }

  // const updatedAtRaw = window.localStorage.getItem(VERIFY_TOKEN_RESPONSE_UPDATED_AT_KEY);
  // const updatedAt = updatedAtRaw ? Number(updatedAtRaw) : Date.now();
  return response;
};

const resetStoredAuthData = () => {
  // clearAuthToken();
  clearVerifyTokenResponse();
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<IUserPayload | null>(null);
  const queryClient = useQueryClient();

  const clearAuthState = () => {
    resetStoredAuthData();
    queryClient.removeQueries({ queryKey: ["verify-token"], exact: true });
  };

  const verifyToken = async (): Promise<VerifyTokenResponseDTO> => {
    try {
      const data = getInitialVerifyTokenData();
      let payload = data?.payload;
      if(payload) {
        setUserData({
          sub: payload.sub,
          username: payload.username,
          email: payload.email,
        });
        router.update({ context: { verifyTokenResponse: {payload} } });
        return {payload};
      }

      const response = await axiosHttpApiRequestLayer.get<any, VerifyTokenResponseDTO>("/auth/verify-token", {}, {});
      payload = response.data.payload;
      setUserData({
        sub: payload.sub,
        username: payload.username,
        email: payload.email,
      });
      router.update({ context: { verifyTokenResponse: response.data } });
      // persistVerifyTokenResponse(response.data);
      return response.data;
    } catch (error: any) {
      console.log(`Error while verifying token: ${error.message}`);
      setUserData(null);
      router.update({ context: { verifyTokenResponse: null } });
      resetStoredAuthData();
      throw error;
    }
  };

  const verifyTokenQuery = useQuery<VerifyTokenResponseDTO | undefined>({
    queryKey: ["verify-token"],
    queryFn: verifyToken,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60,
  });

  const logoutUser = async () => {
    try {
      const response = await axiosHttpApiRequestLayer.post<{}, ILogoutUserResponseDTO>("/auth/logout", {});
      if (response.statusCode == 201 && response.data.isLoggedOut) {
        console.log("User logged out successfully");
        setUserData(null);
      } else {
        console.log("Unexpected response while logging out user:", response);
      }
    } catch (error) {
      console.log(`Error while logging out user: ${error}`);
    } finally {
      clearAuthState();
      setUserData(null);
      router.navigate({
        to: "/login",
      });
    }
  };

  const loginUser = useMutation<LoginUserResponseDto, unknown, ILoginPageState, unknown>({
    mutationFn: async (data: ILoginPageState) => {
      // Perform login logic here, e.g., call an API
      const response = await axiosHttpApiRequestLayer.post<LoginUserRequestDto, LoginUserResponseDto>("/auth/login", {
        username: data.username,
        password: data.password,
      });

      // Done: store {{response.data}} (the token) in local storage or context
      console.log("Logging in with:", response.data);
      return response.data;
    },
    onSuccess: (response: LoginUserResponseDto) => {
      const cachedVerifyTokenResponse: IApiResponse<VerifyTokenResponseDTO> = {
        statusCode: 200,
        data: {
          payload: response.payload,
        },
        isLoading: false,
      };
      // Token is stored in httpOnly cookie by backend, no need to store in localStorage
      persistVerifyTokenResponse(cachedVerifyTokenResponse.data);
      queryClient.setQueryData(["verify-token"], cachedVerifyTokenResponse);
      setUserData(response.payload);
      router.update({ context: { verifyTokenResponse: cachedVerifyTokenResponse.data } });
      router.navigate({
        to: "/dashboard",
      });
      console.log("Login successful", response);
    },
    onError: (error) => {
      resetStoredAuthData();
      router.update({ context: { verifyTokenResponse: null } });
      router.navigate({
        to: "/dashboard",
      });
      console.error("Login failed:", error);
    },
  });

  if (verifyTokenQuery.isPending) {
    return <div>Checking if user has logged in....</div>;
  }

  return (
    <AuthContext.Provider value={{ userData, setUserData, logoutUser, loginUser }}>
      {children}
    </AuthContext.Provider>
  );
}

