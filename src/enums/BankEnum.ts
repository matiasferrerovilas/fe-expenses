export const BankEnum = {
  BBVA: "BBVA",
  GALICIA: "GALICIA",
  SANTANDER_RIO: "SANTANDER RIO",
  BANCO_CIUDAD: "BANCO CIUDAD",
} as const;
export type BankEnum = (typeof BankEnum)[keyof typeof BankEnum];
