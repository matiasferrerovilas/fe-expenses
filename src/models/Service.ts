import type { Currency } from "./Currency";
import type { User } from "./User";

export interface Service {
  id: number;
  amount: number;
  description: string;
  date: string;
  users: User[];
  currency: Currency | null;
  lastPayment: Date | null;
  isPaid: boolean;
}
