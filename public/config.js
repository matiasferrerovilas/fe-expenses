const useLocalBackend = false; // Cambia este valor a `false` para apuntar a dev

const localBackend = {
  api: "http://localhost:8081/v1",
};

const devBackend = {
  api: "http://localhost:8081/v1",
};

window.env = {
  environment: "local",
  keycloak: {
    clientId: "fe-expenses",
    realm: "m2",
    url: "http://192.168.1.100:8080/"
  },
  backend: useLocalBackend ? localBackend : devBackend
};
