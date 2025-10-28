import type { Category } from "./Category";
import type { Currency } from "./Currency";
import type { UserGroup } from "./UserGroup";

export interface Expense {
  id: number;
  amount: number;
  description: string;
  date: string;
  user: string;
  year: number;
  month: number;
  bank: string | null;
  category: Category | null;
  currency: Currency | null;
  type: string;
  cuotasTotales: number | null;
  cuotaActual: number | null;
  userGroups: UserGroup[];
}
