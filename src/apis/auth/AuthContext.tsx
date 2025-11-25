import { createContext } from "react";

export interface AuthContextState {
  authenticated: boolean;
  firstLogin: boolean;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextState>({
  authenticated: false,
  firstLogin: false,
  loading: true,
});
