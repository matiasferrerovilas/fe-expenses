import type { PageResponse } from "../models/BaseMode";
import type { Expense } from "../models/Expense";
import { api } from "./axios";

export async function getExpenseApi(page = 0, size = 10) {
  return await api
    .get<PageResponse<Expense>>("/expenses", {
      params: { page, size },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching pendings:", error);
      throw error;
    });
}
