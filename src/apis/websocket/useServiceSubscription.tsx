// useMovementSubscription.ts
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useWebSocket } from "./WebSocketProvider";
import type { Service } from "../../models/Service";
import type { EventWrapper } from "./EventWrapper";

const SERVICE_KEY = "service-history" as const;

export const useServiceSubscription = () => {
  const queryClient = useQueryClient();
  const ws = useWebSocket();

  const callbackRef = useRef<(payload: EventWrapper<Service>) => void>();

  if (!callbackRef.current) {
    callbackRef.current = (event: EventWrapper<Service>) => {
      const payload = event.message;
      queryClient.setQueryData([SERVICE_KEY], (oldData?: Service[]) => {
        if (!oldData) return [payload];

        const exists = oldData.some((s) => s.id === payload.id);
        if (exists) {
          return oldData.map((s) => (s.id === payload.id ? payload : s));
        }
        return [...oldData, payload];
      });
    };
  }

  useEffect(() => {
    if (!ws.isConnected) return;

    const callback = callbackRef.current!;
    const topics = ["/topic/servicios/update", "/topic/servicios/new"];

    // ✅ Suscribimos una vez por montaje
    topics.forEach((topic) => ws.subscribe(topic, callback));

    // 🔄 Cleanup: desuscribimos solo cuando el hook se desmonta o el socket cambia
    return () => {
      topics.forEach((topic) => ws.unsubscribe(topic, callback));
    };
  }, [ws, ws.isConnected]); // se re-suscribe si el socket cambia

  return null;
};
