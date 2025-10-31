import dayjs from "dayjs";
import type { Movement } from "../models/Expense";
import { api } from "./axios";
import type { MovementFilters } from "../routes/movement";

export async function getExpenseApi({
  page = 0,
  size,
  filters,
}: {
  page?: number;
  size?: number;
  filters?: MovementFilters;
}) {
  const params: Record<string, any> = {
    page,
    size,
    ...(filters || {}),
  };

  Object.keys(params).forEach(
    (key) => params[key] == null && delete params[key]
  );

  return api
    .get("/expenses", {
      params,
      paramsSerializer: (params) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((v) => searchParams.append(key, v));
          } else {
            searchParams.append(key, value as any);
          }
        });
        return searchParams.toString();
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      console.error("Error fetching expenses:", error);
      throw error;
    });
}

export async function uploadExpenseApi(
  file: File,
  bank: string,
  group: string
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("bank", bank);
  formData.append("group", group);

  const response = await api.post("/expenses/import-file", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function uploadExpense(expense: CreateExpenseForm) {
  const payload = {
    amount: expense.amount,
    bank: expense.bank,
    description: expense.description,
    date: expense.date ? dayjs(expense.date).format("YYYY-MM-DD") : null,
    currency: expense.currency,
    type: expense.type,
    category: expense.category ? { description: expense.category } : null,
    cuotaActual: expense.cuotaActual ? expense.cuotaActual : null,
    cuotasTotales: expense.cuotasTotales ? expense.cuotasTotales : null,
  };
  const response = await api.post("/expenses", payload);

  return response.data;
}

export async function updateExpenseApi(expense: Movement) {
  const payload = {
    amount: expense.amount,
    bank: expense.bank,
    description: expense.description,
    date: expense.date ? dayjs(expense.date).format("YYYY-MM-DD") : null,
    currency: expense.currency?.symbol || null,
    type: expense.type,
    category: expense.category || null,
    cuotaActual: expense.cuotaActual ?? null,
    cuotasTotales: expense.cuotasTotales ?? null,
    year: expense.year,
    month: expense.month,
  };

  const response = await api.patch(`/expenses/${expense.id}`, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
}

export async function deleteExpenseApi(id: number) {
  const response = await api.delete(`/expenses/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
}
