import type { BalanceResponse } from "../models/Balance";
import type {
  BalanceByCategory,
  BalanceByGroup,
} from "../models/BalanceByCategory";
import type { BalanceFilters } from "../routes/balance";
import { api } from "./axios";
type ParamsValue = string | number | boolean | undefined | null;
type ParamsObject = Record<string, ParamsValue | ParamsValue[]>;
export async function getBalance(filters: BalanceFilters) {
  try {
    const params = new URLSearchParams();

    if (filters.year) params.set("year", String(filters.year));
    if (filters.month) params.set("month", String(filters.month));
    if (filters.currency?.length)
      params.set("currencies", String(filters.currency));
    filters.groups?.forEach((g) => params.append("groups", String(g)));

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

export async function getBalanceWithCategoryByYear(filters: BalanceFilters) {
  console.log(filters);
  const params: ParamsObject = {
    ...(filters || {}),
  };

  Object.keys(params).forEach(
    (key) => params[key] == null && delete params[key]
  );

  return api
    .get<BalanceByCategory[]>("/balance/category", {
      params,
      paramsSerializer: (params) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((v) => searchParams.append(key, v));
          } else {
            searchParams.append(key, String(value));
          }
        });
        return searchParams.toString();
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching balances:", error);
      throw error;
    });
}

export async function getBalanceWithGroupByYearAndMonth({
  year,
  month,
}: {
  year: number;
  month: number;
}) {
  return api
    .get<BalanceByGroup[]>("/balance/group", {
      params: { year, month },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching balances:", error);
      throw error;
    });
}
