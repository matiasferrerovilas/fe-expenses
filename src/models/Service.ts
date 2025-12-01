import type { Currency } from "./Currency";
import type { User } from "./User";

export interface Service {
  id: number;
  amount: number;
  description: string;
  group: string;
  date: string;
  users: User[];
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
