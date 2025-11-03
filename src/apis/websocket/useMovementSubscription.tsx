// useMovementSubscription.ts
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useWebSocket } from "./WebSocketProvider";
import type { Movement } from "../../models/Expense";
import type { PageResponse } from "../../models/BaseMode";

const EXPENSES_QUERY_KEY = "movement-history" as const;
const DEFAULT_PAGE_SIZE = 25;

// Singleton: mantiene estado entre instancias del hook
let subscriptionCount = 0;
let isSubscribed = false;

export const useMovementSubscription = () => {
  const queryClient = useQueryClient();
  const ws = useWebSocket();

  useEffect(() => {
    if (!ws.isConnected) {
      return;
    }

    // Incrementa el contador de referencias
    subscriptionCount++;

    // Solo suscribe si es la primera instancia
    if (!isSubscribed) {
      console.log(
        "📡 Primera instancia: Suscribiendo a /topic/movimientos/new"
      );

      const callback = (payload: Movement) => {
        console.log("📨 Nuevo movimiento recibido:", payload.id);

        // Actualiza TODAS las queries de movimientos en el cache
        const queries = queryClient.getQueriesData<PageResponse<Movement>>({
          queryKey: [EXPENSES_QUERY_KEY],
          exact: false,
        });

        queries.forEach(([queryKey, oldData]) => {
          if (!oldData) return;

          queryClient.setQueryData(queryKey, (old?: PageResponse<Movement>) => {
            if (!old) return old;

            const existingIndex = old.content.findIndex(
              (s) => s.id === payload.id
            );

            let content: Movement[];
            let totalElements = old.totalElements;

            if (existingIndex !== -1) {
              // Actualizar movimiento existente
              content = [
                ...old.content.slice(0, existingIndex),
                payload,
                ...old.content.slice(existingIndex + 1),
              ];
            } else {
              // Agregar nuevo movimiento solo si es la primera página (page = 0)
              const isFirstPage = Array.isArray(queryKey) && queryKey[1] === 0;

              if (isFirstPage) {
                content = [payload, ...old.content].slice(0, DEFAULT_PAGE_SIZE);
                totalElements = old.totalElements + 1;
              } else {
                // En otras páginas, solo incrementa el total
                content = old.content;
                totalElements = old.totalElements + 1;
              }
            }

            return {
              ...old,
              content,
              totalElements,
              totalPages: Math.ceil(totalElements / DEFAULT_PAGE_SIZE),
            };
          });
        });
      };

      ws.subscribe("/topic/movimientos/new", callback);
      isSubscribed = true;

      // Cleanup: solo se ejecuta cuando la ÚLTIMA instancia se desmonta
      return () => {
        subscriptionCount--;
        console.log(`📊 Referencias activas: ${subscriptionCount}`);

        if (subscriptionCount === 0) {
          console.log(
            "🔕 Última instancia: Des-suscribiendo de /topic/movimientos/new"
          );
          ws.unsubscribe("/topic/movimientos/new", callback);
          isSubscribed = false;
        }
      };
    } else {
      console.log(
        `📊 Instancia adicional detectada (total: ${subscriptionCount})`
      );

      // Cleanup para instancias adicionales
      return () => {
        subscriptionCount--;
        console.log(`📊 Referencias activas: ${subscriptionCount}`);
      };
    }
  }, [ws, ws.isConnected, queryClient]);
};
