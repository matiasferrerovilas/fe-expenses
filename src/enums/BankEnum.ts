export const BankEnum = {
  BBVA: "BBVA",
  GALICIA: "GALICIA",
  SANTANDER_RIO: "SANTANDER RIO",
} as const;
export type BankEnum = (typeof BankEnum)[keyof typeof BankEnum];
