import { useQuery } from "@tanstack/react-query";
import { getExpenseApi } from "../ExpenseApi";
import type { MovementFilters } from "../../routes/movement";

const MOVEMENT_QUERY_KEY = "movement-history" as const;

export const useMovement = (
  filters: MovementFilters,
  page: number,
  defaultPage: number
) =>
  useQuery({
    queryKey: [MOVEMENT_QUERY_KEY, page, filters],
    queryFn: () => getExpenseApi({ page, size: defaultPage, filters }),
    staleTime: Infinity,
  });
