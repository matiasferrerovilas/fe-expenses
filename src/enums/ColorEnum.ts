export const ColorEnum = {
  ROJO_FALTA_PAGO: "#ffe6e6",
  ROJO_FALTA_PAGO_BORDE: "#ffa39e",
  VERDE_PAGADO: "#f0fff0",
  VERDE_PAGADO_BORDE: "#b7eb8f",
  FONDO_BOTON_ACTIVO: "#f5faff",

  TEXTO_ACTIVO_AZUL: "#1677ff",
} as const;
export type ColorEnum = (typeof ColorEnum)[keyof typeof ColorEnum];
