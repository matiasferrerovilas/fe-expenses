export const ColorEnum = {
  ROJO_FALTA_PAGO: "#ffe6e6",
  ROJO_FALTA_PAGO_BORDE: "#ffa39e",
  VERDE_PAGADO: "#f0fff0",
  VERDE_PAGADO_BORDE: "#b7eb8f",
} as const;
export type ColorEnum = (typeof ColorEnum)[keyof typeof ColorEnum];
