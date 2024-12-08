import { configureStore } from "@reduxjs/toolkit";
import userProfileReducer from '../slices/userProfile';
import expensesReducer from '../slices/expenses'
import financialDataReducer from '../slices/financialData'

export const store = configureStore({
    reducer: {
        userProfile: userProfileReducer,
        expenses: expensesReducer,
        financialData: financialDataReducer,
    }
})

export type AppDispatch = typeof store.dispatch