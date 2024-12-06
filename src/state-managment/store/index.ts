import { configureStore } from "@reduxjs/toolkit";
import userProfileReducer from '../slices/userProfile';
import expensesReducer from '../slices/expenses'

export const store = configureStore({
    reducer: {
        userProfile: userProfileReducer,
        expenses: expensesReducer
    }
})

export type AppDispatch = typeof store.dispatch