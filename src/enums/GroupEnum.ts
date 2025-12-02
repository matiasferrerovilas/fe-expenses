export const GroupEnum = {
  DEFAULT: "DEFAULT",
} as const;
export type BankEnum = (typeof GroupEnum)[keyof typeof GroupEnum];
