import type { PageResponse } from "../models/BaseMode";
import type { Expense } from "../models/Expense";
import { api } from "./axios";

export async function getExpenseApi({
  page = 0,
  size,
  paymentMethod,
  currencySymbol,
  bank,
  date,
}: {
  page?: number;
  size?: number;
  paymentMethod?: string[];
  currencySymbol?: string[];
  bank?: string[];
  date?: string;
}) {
  return api
    .get<PageResponse<Expense>>("/expenses", {
      params: {
        page,
        size,
        paymentMethod,
        currencySymbol,
        bank,
        date,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching expenses:", error);
      throw error;
    });
}

export async function uploadExpenseApi(file: File, bank: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("bank", bank);

  const response = await api.post("/expenses/import-file", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}
