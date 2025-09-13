export {};
declare global {
  interface KeycloakConfig {
    clientId: string;
    realm: string;
    url: string;
  }

  interface BackendConfig {
    api: string;
  }

  interface Window {
    env: {
      environment: string;
      keycloak: KeycloakConfig;
      backend: BackendConfig;
    };
  }
}
