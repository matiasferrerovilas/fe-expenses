const useLocalBackend = false;

const localBackend = {
  api: "http://localhost:8081/v1",
  keycloak: "http://auth.eva-core.com/"
};

const devBackend = {
  api: "http://192.168.1.100:8090/v1",
  keycloak: "http://auth.eva-core.com/"
};

window.env = {
  environment: "local",
  keycloak: {
    clientId: "fe-expenses",
    realm: "m2",
    url: useLocalBackend ? localBackend.keycloak : devBackend.keycloak
  },
  backend: useLocalBackend ? localBackend : devBackend
};
