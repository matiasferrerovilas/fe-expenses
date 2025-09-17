export const BankEnum = {
  BBVA: "BBVA",
  GALICIA: "GALICIA",
  HCBC: "HSBC",
  ICBC: "ICBC",
} as const;
export type BankEnum = (typeof BankEnum)[keyof typeof BankEnum];
