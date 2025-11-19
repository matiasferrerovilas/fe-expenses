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

  const callbackRef =
    useRef<(event: EventWrapper<Service>) => void | null>(null);

  if (!callbackRef.current) {
    callbackRef.current = (event: EventWrapper<Service>) => {
      const { eventType, message: payload } = event;

      queryClient.setQueryData([SERVICE_KEY], (old?: Service[]) => {
        if (!old) return eventType === "SERVICE_DELETED" ? [] : [payload];

        switch (eventType) {
          case "SERVICE_DELETED":
            return old.filter((s) => s.id !== payload.id);

          case "SERVICE_UPDATED":
          case "SERVICE_PAID":
            return old.some((s) => s.id === payload.id)
              ? old.map((s) => (s.id === payload.id ? payload : s))
              : [...old, payload];

          default:
            return [...old, payload];
        }
      });
    };
  }

  useEffect(() => {
    if (!ws.isConnected) return;

    const callback = callbackRef.current!;
    const topics = [
      "/topic/servicios/update",
      "/topic/servicios/new",
      "/topic/servicios/remove",
    ];

    // ✅ Suscribimos una vez por montaje
    topics.forEach((topic) => ws.subscribe(topic, callback));

    // 🔄 Cleanup: desuscribimos solo cuando el hook se desmonta o el socket cambia
    return () => {
      topics.forEach((topic) => ws.unsubscribe(topic, callback));
    };
  }, [ws, ws.isConnected]); // se re-suscribe si el socket cambia

  return null;
};
