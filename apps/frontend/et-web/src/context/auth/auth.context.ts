import type { IUserPayload, LoginUserResponseDto } from "expense-tracker-types";
import { createContext } from "react";
import type { ILoginPageState } from "../../routes/(auth)/login";
import type { UseMutationResult } from "@tanstack/react-query";

export interface IAuthContext {
  userData: IUserPayload | null;
  setUserData?: (userData: IUserPayload) => void;
  logoutUser?: () => void;
  loginUser?: UseMutationResult<
    LoginUserResponseDto,
    unknown,
    ILoginPageState,
    unknown
  >;
}

export const AuthContext = createContext<IAuthContext>({
  userData: null,
});
