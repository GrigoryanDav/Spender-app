import { userProfileState } from './userProfileState';  
import { ExpensesState } from './expensesState';
import { FinancialDataState } from './financialDataState';

export interface RootState {
  userProfile: userProfileState;
  expenses: ExpensesState;
  financialData: FinancialDataState
}
