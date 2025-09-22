import type { Category } from "./Category";
import type { Currency } from "./Currency";

export interface Expense {
  id: number;
  amount: number;
  description: string;
  dateTime: string;
  user: string;
  year: number;
  month: number;
  bank: string | null;
  category: Category | null;
  currency: Currency | null;
  type: string;
  cuotasTotales: number | null;
  cuotaActual: number | null;
}
