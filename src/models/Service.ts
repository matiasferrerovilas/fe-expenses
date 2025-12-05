import type { Currency } from "./Currency";

export interface Service {
  id: number;
  amount: number;
  description: string;
  group: string;
  date: string;
  user: string;
  currency: Currency | null;
  lastPayment: Date | null;
  isPaid: boolean;
}

export interface ServiceToUpdate {
  id: number;
  changes: ServiceToUpdateChanges;
}
export interface ServiceToUpdateChanges {
  amount: number;
  description: string;
  group: string;
  lastPayment: Date | null;
}
