import dayjs from "dayjs";
import type { PageResponse } from "../models/BaseMode";
import type { Expense } from "../models/Expense";
import type { CreateExpenseForm } from "../routes/expenses/live";
import { api } from "./axios";
import type { ExpenseToUpdate } from "../components/expenses/ExpenseTable";

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

export async function updateExpenseApi(expense: Expense) {
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

  console.log(payload);
  const response = await api.patch(`/expenses/${expense.id}`, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
}
