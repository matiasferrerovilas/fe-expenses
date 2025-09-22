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

export interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
}

export interface Category {
  id: number;
  description: string;
}
