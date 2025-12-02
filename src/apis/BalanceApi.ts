import type { BalanceResponse } from "../models/Balance";
import type { BalanceByCategory } from "../models/BalanceByCategory";
import type { BalanceFilters } from "../routes/balance";
import { api } from "./axios";

export async function getBalance(filters: BalanceFilters) {
  try {
    const params = new URLSearchParams();

    if (filters.year) params.set("year", String(filters.year));
    if (filters.month) params.set("month", String(filters.month));
    if (filters.currency?.length)
      params.set("currencies", String(filters.currency));
    filters.groups?.forEach((g) => params.append("groups", String(g)));

    console.log("Params enviados:", params.toString());

    const { data } = await api.get<BalanceResponse>("/balance", {
      params,
      paramsSerializer: () => params.toString(), // 👈 Esto asegura formato correcto
    });

    return data;
  } catch (error) {
    console.error("Error fetching balance:", error);
    throw error;
  }
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
