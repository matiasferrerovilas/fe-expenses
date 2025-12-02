import { useQuery } from "@tanstack/react-query";
import { getBalance } from "../BalanceApi";
import type { BalanceFilters } from "../../routes/balance";

const BALANCE_QUERY_KEY = "balance" as const;

export const useBalance = (filters: BalanceFilters) =>
  useQuery({
    queryKey: [BALANCE_QUERY_KEY, filters],
    queryFn: () => getBalance(filters),
    staleTime: 5 * 60 * 1000,
  });
