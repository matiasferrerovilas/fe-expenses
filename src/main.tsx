import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Keycloak from "keycloak-js";

import { ReactKeycloakProvider } from "@react-keycloak/web";
import App from "./App";

const keycloak = new Keycloak(window.env.keycloak);

createRoot(document.getElementById("root")!).render(
  <ReactKeycloakProvider
    authClient={keycloak}
    initOptions={{
      checkLoginIframe: false,
      enableLogging: true,
      onLoad: "login-required",
    }}
  >
    <StrictMode>
      <App />
    </StrictMode>
  </ReactKeycloakProvider>
);
