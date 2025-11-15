import { useQuery } from "@tanstack/react-query";
import { getBalance } from "../BalanceApi";

const BALANCE_QUERY_KEY = "balance" as const;

export const useBalance = (year: number, month: number) =>
  useQuery({
    queryKey: [BALANCE_QUERY_KEY, year, month],
    queryFn: () =>
      getBalance({
        year,
        month,
      }),
    staleTime: 5 * 60 * 1000,
  });
