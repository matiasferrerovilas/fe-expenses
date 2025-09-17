export const CurrencyEnum = {
  ARS: "ARS",
  USD: "USD",
} as const;
export type CurrencyEnum = (typeof CurrencyEnum)[keyof typeof CurrencyEnum];
