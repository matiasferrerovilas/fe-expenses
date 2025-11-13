// useMovementSubscription.ts
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useWebSocket } from "./WebSocketProvider";
import type { EventWrapper } from "./EventWrapper";
import type { GroupWithUsersrs } from "../../models/UserGroup";

const USER_GROUPS_QUERY_KEY = "user-groups" as const;

export const useGroupsSubscription = () => {
  const queryClient = useQueryClient();
  const ws = useWebSocket();

  const callbackRef =
    useRef<(payload: EventWrapper<GroupWithUsersrs[]>) => void>();

  if (!callbackRef.current) {
    callbackRef.current = (event: EventWrapper<GroupWithUsersrs[]>) => {
      const payload = event.message;
      queryClient.setQueryData([USER_GROUPS_QUERY_KEY], payload);
    };
  }

  useEffect(() => {
    if (!ws.isConnected) return;

    const callback = callbackRef.current!;
    const topics = ["/topic/groups/update, /topic/groups/new"];

    // ✅ Suscribimos una vez por montaje
    topics.forEach((topic) => ws.subscribe(topic, callback));

    // 🔄 Cleanup: desuscribimos solo cuando el hook se desmonta o el socket cambia
    return () => {
      topics.forEach((topic) => ws.unsubscribe(topic, callback));
    };
  }, [ws, ws.isConnected]); // se re-suscribe si el socket cambia

  return null;
};
