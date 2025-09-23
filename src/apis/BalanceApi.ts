import type { Balance } from "../models/Balance";
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
    .get<Balance[]>("/balance", {
      params: { year, month, currencySymbol },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching expenses:", error);
      throw error;
    });
}
