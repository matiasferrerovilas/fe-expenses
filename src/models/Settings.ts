import type { CurrencyRecord } from "./Currency";

export interface IngresoSettingForm {
  amount: number;
  bank: string;
  group: string;
  currency: CurrencyRecord;
}
