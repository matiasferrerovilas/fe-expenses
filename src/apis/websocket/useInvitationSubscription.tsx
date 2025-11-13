// useMovementSubscription.ts
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useWebSocket } from "./WebSocketProvider";
import type { EventWrapper } from "./EventWrapper";
import type { Invitations } from "../../models/UserGroup";

const INVITATIONS_GROUPS_QUERY_KEY = "invitations-groups" as const;

export const useInvitationSubscription = () => {
  const queryClient = useQueryClient();
  const ws = useWebSocket();

  const callbackRef = useRef<(payload: EventWrapper<Invitations[]>) => void>();

  if (!callbackRef.current) {
    callbackRef.current = (event: EventWrapper<Invitations[]>) => {
      const payload = event.message;
      queryClient.setQueryData([INVITATIONS_GROUPS_QUERY_KEY], payload);
    };
  }

  useEffect(() => {
    if (!ws.isConnected) return;

    const callback = callbackRef.current!;
    const topics = ["/topic/invitation/update", "/topic/invitation/new"];

    // ✅ Suscribimos una vez por montaje
    topics.forEach((topic) => ws.subscribe(topic, callback));

    // 🔄 Cleanup: desuscribimos solo cuando el hook se desmonta o el socket cambia
    return () => {
      topics.forEach((topic) => ws.unsubscribe(topic, callback));
    };
  }, [ws, ws.isConnected]); // se re-suscribe si el socket cambia

  return null;
};
