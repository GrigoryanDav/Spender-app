import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db } from "../../../services/firebase";
import { getDoc, doc } from "firebase/firestore";  // Используем getDoc для доступа к документу по userId
import { FIRESTORE_PATH_NAMES } from "../../../constants/firestorePaths";
import { convertCurrency } from "../../../helpers/convertCurrency";
import { RootState } from "../../../ts/interfaces/rootState";
import { FinancialDataState } from "../../../ts/interfaces/financialDataState";

const initialState: FinancialDataState = {
    totalExpenses: 0,
    totalIncomes: 0,
    isLoading: false,
    exchangeRates: {},
    isExchangeRatesLoading: false,
}

export const fetchExchangeRates = createAsyncThunk('financialData/fetchExchangeRates', async (currentCurrency: string) => {
    const response = await fetch(`${process.env.REACT_APP_CURRENCY_API_URL}/${currentCurrency.toUpperCase()}`)
    const data = await response.json()
    return data.rates
})

export const fetchAllExpenses = createAsyncThunk('financialData/fetchAllExpenses', async (currentCurrency: string, { rejectWithValue, getState, dispatch }) => {
    const state: RootState = getState() as RootState
    const userId = state.userProfile.authUserInfo.userData?.uid
    const exchangeRates = state.financialData.exchangeRates;

    if (Object.keys(exchangeRates).length === 0) {
        await dispatch(fetchExchangeRates(currentCurrency))
    }

    let totalAmount: number = 0
    const collections: string[] = [
        FIRESTORE_PATH_NAMES.CAR_EXPENSE,
        FIRESTORE_PATH_NAMES.SHOPPING_EXPENSE,
        FIRESTORE_PATH_NAMES.FOOD_EXPENSE,
        FIRESTORE_PATH_NAMES.PAYMENTS_EXPENSE,
        FIRESTORE_PATH_NAMES.GIFT_EXPENSE,
    ];

    for (const collectionName of collections) {
        try {
            if (!userId) {
                return rejectWithValue("User ID is not defined");
            }
            
            const docRef = doc(db, collectionName, userId);
            const docSnapshot = await getDoc(docRef);

            if (docSnapshot.exists()) {
                const expenses = docSnapshot.data()?.expenses;
                if (expenses && Array.isArray(expenses)) {
                    totalAmount += expenses.reduce((sum, expense) => {
                        const amount = +(expense.amount || 0)
                        const convertedAmount = convertCurrency(amount, expense.currency.toUpperCase(), currentCurrency.toUpperCase(), exchangeRates)
                        return sum += parseFloat(convertedAmount.toFixed(2))
                    }, 0)
                }
            }
        } catch (error) {
            return rejectWithValue(error)
        }
    }
    return totalAmount
})

export const fetchAllIncomes = createAsyncThunk('financialData/fetchAllIncomes', async (currentCurrency: string, { rejectWithValue, getState, dispatch }) => {
    const state: RootState = getState() as RootState
    const userId = state.userProfile.authUserInfo.userData?.uid
    const exchangeRates = state.financialData.exchangeRates;

    if (Object.keys(exchangeRates).length === 0) {
        await dispatch(fetchExchangeRates(currentCurrency))
    }

    let totalIncomeAmount: number = 0
    
    try {
        if (!userId) {
            return rejectWithValue("User ID is not defined");
        }

        const docRef = doc(db, FIRESTORE_PATH_NAMES.INCOME_EXPENSE, userId);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
            const incomes = docSnapshot.data()?.expenses;
            if (incomes && Array.isArray(incomes)) {
                totalIncomeAmount += incomes.reduce((sum, income) => {
                    const amount = +(income.amount || 0)
                    const convertedAmount = convertCurrency(amount, income.currency.toUpperCase(), currentCurrency.toUpperCase(), exchangeRates)
                    return sum += parseFloat(convertedAmount.toFixed(2))
                }, 0)
            }
        }
    } catch (error) {
        return rejectWithValue(error)
    }

    return totalIncomeAmount
})

const financialDataSlice = createSlice({
    name: 'financialData',
    initialState,
    reducers: {},
    extraReducers: (promise) => {
        promise
        .addCase(fetchExchangeRates.pending, (state) => {
            state.isExchangeRatesLoading = true
        })
        .addCase(fetchExchangeRates.fulfilled, (state, action) => {
            state.isExchangeRatesLoading = false
            state.exchangeRates = action.payload
        })
        .addCase(fetchExchangeRates.rejected, (state) => {
            state.isExchangeRatesLoading = false
        })
        .addCase(fetchAllExpenses.pending, (state) => {
            state.isLoading = true
        })
        .addCase(fetchAllExpenses.fulfilled, (state, action) => {
            state.isLoading = false
            state.totalExpenses = action.payload
        })
        .addCase(fetchAllExpenses.rejected, (state) => {
            state.isLoading = false
        })
        .addCase(fetchAllIncomes.pending, (state) => {
            state.isLoading = true
        })
        .addCase(fetchAllIncomes.fulfilled, (state, action) => {
            state.isLoading = false
            state.totalIncomes = action.payload
        })
        .addCase(fetchAllIncomes.rejected, (state) => {
            state.isLoading = false
        })
    }
})

export default financialDataSlice.reducer