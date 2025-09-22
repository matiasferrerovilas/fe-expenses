export const TypeEnum = {
  DEBITO: "DEBITO",
  CREDITO: "CREDITO",
} as const;
export type TypeEnum = (typeof TypeEnum)[keyof typeof TypeEnum];
