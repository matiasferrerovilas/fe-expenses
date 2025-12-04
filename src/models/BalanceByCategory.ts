export interface BalanceByCategory {
  category: string;
  year: number;
  currencySymbol: string;
  total: number;
}
export interface BalanceByGroup {
  groupDescription: string;
  year: number;
  month: number;
  currencySymbol: string;
  total: number;
}
