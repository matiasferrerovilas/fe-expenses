// src/hooks/WebSocketProvider.tsx
import { createContext, useContext, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useKeycloak } from "@react-keycloak/web";

export type EventCallback<T = any> = (payload: T) => void;

interface WebSocketContextProps {
  subscribe: <T = any>(topic: string, callback: EventCallback<T>) => void;
  unsubscribe: (topic: string, callback: EventCallback) => void;
}

const WebSocketContext = createContext<WebSocketContextProps | undefined>(
  undefined
);

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const clientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef<Map<string, Set<EventCallback>>>(new Map());
  const { keycloak } = useKeycloak();

  useEffect(() => {
    if (!keycloak.authenticated) return;

    console.log("Iniciando WebSocketProvider...");
    const token = keycloak.token;

    const baseUrl =
      window.location.hostname === "localhost"
        ? "http://localhost:8081"
        : "https://<tu-subdominio>.trycloudflare.com";

    const socketFactory = () =>
      new SockJS(`${baseUrl}/ws?access_token=${token}`);

    const client = new Client({
      webSocketFactory: socketFactory,
      reconnectDelay: 5000,
      debug: (str) => console.log("[STOMP]", str),
      onConnect: () => {
        console.log("✅ Conectado a WebSocket global");

        subscriptionsRef.current.forEach((callbacks, topic) => {
          client.subscribe(topic, (message) => {
            const payload = JSON.parse(message.body);
            callbacks.forEach((cb) => cb(payload));
          });
        });
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [keycloak.authenticated]);

  const subscribe = <T,>(topic: string, callback: EventCallback<T>) => {
    if (!subscriptionsRef.current.has(topic)) {
      subscriptionsRef.current.set(topic, new Set());
      clientRef.current?.subscribe(topic, (message) => {
        const payload = JSON.parse(message.body);
        subscriptionsRef.current.get(topic)?.forEach((cb) => cb(payload));
      });
    }
    subscriptionsRef.current.get(topic)?.add(callback);
  };

  const unsubscribe = (topic: string, callback: EventCallback) => {
    subscriptionsRef.current.get(topic)?.delete(callback);
  };

  return (
    <WebSocketContext.Provider value={{ subscribe, unsubscribe }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context)
    throw new Error("useWebSocket must be used within WebSocketProvider");
  return context;
};
