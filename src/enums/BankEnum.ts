export const BankEnum = {
  BBVA: "BBVA",
  GALICIA: "GALICIA",
  HCBC: "HSBC",
} as const;
export type BankEnum = (typeof BankEnum)[keyof typeof BankEnum];
