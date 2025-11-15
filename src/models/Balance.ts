export interface Balance {
  balance: number;
  symbol: string;
  year: number;
  month: number;
  type: string;
}

export interface BalanceResponse {
  GASTO: Balance[];
  INGRESO: Balance[];
}
