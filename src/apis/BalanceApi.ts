import type { BalanceResponse } from "../models/Balance";
import type { BalanceByCategory } from "../models/BalanceByCategory";
import { api } from "./axios";

export async function getBalance({
  year,
  month,
  currencySymbol,
}: {
  year?: number;
  month?: number;
  currencySymbol?: string;
}) {
  return api
    .get<BalanceResponse>("/balance", {
      params: { year, month, currencySymbol },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching expenses:", error);
      throw error;
    });
}

export async function getBalanceWithCategoryByYear({ year }: { year: number }) {
  return api
    .get<BalanceByCategory[]>("/balance/category", {
      params: { year },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching balances:", error);
      throw error;
    });
}
