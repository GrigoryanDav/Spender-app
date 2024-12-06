import { userProfileState } from './userProfileState';  
import { ExpensesState } from './expensesState';

export interface RootState {
  userProfile: userProfileState;
  expenses: ExpensesState;
}
