// AxiosInterceptorProvider.tsx - Espera en el interceptor, no en la UI
import { useEffect, useRef } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { api } from "./axios";

export function AxiosInterceptorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { keycloak, initialized } = useKeycloak();
  const isInterceptorMounted = useRef(false);

  useEffect(() => {
    // Evita montar múltiples veces
    if (isInterceptorMounted.current) return;

    const requestInterceptor = api.interceptors.request.use(
      async (config) => {
        // Espera a que Keycloak esté listo SOLO en el momento del request
        if (!initialized) {
          // Espera hasta 5 segundos a que Keycloak inicialice
          const timeout = 5000;
          const startTime = Date.now();

          while (!initialized && Date.now() - startTime < timeout) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }

          if (!initialized) {
            console.error("Timeout esperando inicialización de Keycloak");
            return Promise.reject(new Error("Keycloak no inicializado"));
          }
        }

        if (keycloak.authenticated && keycloak.token) {
          try {
            // Renueva si expira en menos de 30 segundos
            await keycloak.updateToken(30);
            config.headers.Authorization = `Bearer ${keycloak.token}`;
          } catch (error) {
            console.error("Error renovando token:", error);
            keycloak.login();
            return Promise.reject(error);
          }
        } else if (initialized && !keycloak.authenticated) {
          // Si ya está inicializado pero no autenticado, redirige
          keycloak.login();
          return Promise.reject(new Error("No autenticado"));
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          initialized &&
          keycloak.authenticated
        ) {
          originalRequest._retry = true;

          try {
            // Fuerza renovación
            await keycloak.updateToken(-1);

            if (keycloak.token) {
              originalRequest.headers.Authorization = `Bearer ${keycloak.token}`;
              return api(originalRequest);
            }
          } catch (refreshError) {
            console.error(
              "Error renovando token después de 401:",
              refreshError
            );
            keycloak.login();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    isInterceptorMounted.current = true;

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
      isInterceptorMounted.current = false;
    };
  }, [keycloak, initialized]);

  // Renderiza children inmediatamente, NO espera a Keycloak
  return <>{children}</>;
}
