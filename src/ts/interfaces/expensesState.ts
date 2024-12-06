import { Expense } from "./expense";

export interface ExpensesState {
    expenses: Expense[];
    loading: boolean;
    error: string | null;
}