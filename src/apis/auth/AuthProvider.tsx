import { useState, useEffect, useRef } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { AuthContext } from "./AuthContext";
import type { AuthContextState } from "./AuthContext";
import { getIsFirstLogin } from "../onboarding/OnBoarding";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { keycloak } = useKeycloak();

  const [state, setState] = useState<AuthContextState>({
    authenticated: false,
    firstLogin: false,
    loading: true,
  });

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!keycloak) {
      setState((s) => ({ ...s, loading: true }));
      return;
    }

    if (!keycloak.authenticated) {
      fetchedRef.current = false;
      setState({
        authenticated: false,
        firstLogin: false,
        loading: false,
      });
      return;
    }

    if (fetchedRef.current) return;
    fetchedRef.current = true;

    getIsFirstLogin()
      .then((value) => {
        setState({
          authenticated: true,
          firstLogin: value,
          loading: false,
        });
      })
      .catch(() => {
        setState({
          authenticated: true,
          firstLogin: false,
          loading: false,
        });
      });
  }, [keycloak]);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}
