import { createContext } from "react";

export interface AuthContextState {
  authenticated: boolean;
  firstLogin: boolean;
  loading: boolean;
  completeOnboarding: () => void;
}

export const AuthContext = createContext<AuthContextState>({
  authenticated: false,
  firstLogin: false,
  loading: true,
  completeOnboarding: () => {},
});
