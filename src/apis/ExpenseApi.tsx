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
