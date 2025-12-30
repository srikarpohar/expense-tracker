import type { IUserPayload } from "expense-tracker-shared";
import { createContext } from "react";

export interface IAuthContext {
  userData: IUserPayload | null;
  setUserData?: (userData: IUserPayload) => void;
}

export const AuthContext = createContext<IAuthContext>({
  userData: null,
});
