import { userProfileState } from './userProfileState';  
import { ExpensesState } from './expensesState';
import { FinancialDataState } from './financialDataState';
import { CurrencyState } from './currencyState';

export interface RootState {
  userProfile: userProfileState;
  expenses: ExpensesState;
  financialData: FinancialDataState;
  currency: CurrencyState;
}
