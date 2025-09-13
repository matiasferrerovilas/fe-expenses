import { useEffect } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { api } from "./axios";

export function AxiosInterceptorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { keycloak } = useKeycloak();

  useEffect(() => {
    const interceptor = api.interceptors.request.use((config) => {
      if (keycloak?.token) {
        config.headers.Authorization = `Bearer ${keycloak.token}`;
      }
      return config;
    });

    return () => {
      api.interceptors.request.eject(interceptor);
    };
  }, [keycloak]);

  return <>{children}</>;
}
