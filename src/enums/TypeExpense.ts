export const TypeEnum = {
  DEBITO: "DEBITO",
  CREDITO: "CREDITO",
  INGRESO: "INGRESO",
} as const;
export type TypeEnum = (typeof TypeEnum)[keyof typeof TypeEnum];
