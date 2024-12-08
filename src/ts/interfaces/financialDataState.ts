export interface FinancialDataState {
    totalExpenses: number;
    totalIncomes: number;
    isLoading: boolean;
    exchangeRates: Record<string, number>;
    isExchangeRatesLoading: boolean;
}