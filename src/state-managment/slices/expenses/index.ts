import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { db } from "../../../services/firebase";
import { FIRESTORE_PATH_NAMES } from "../../../constants/firestorePaths";
import { doc, getDoc, } from "firebase/firestore";
import { Expense } from "../../../ts/interfaces/expense";
import { ExpensesState } from "../../../ts/interfaces/expensesState";
import { ExpenseType } from "../../../ts/types/expenseType";


const initialState: ExpensesState = {
    expenses: [],
    loading: false,
    error: null
}

export const fetchExpenses = createAsyncThunk<Expense[], { uid: string; expenseType: string }, {rejectValue: string}>('data/fetchExpenses', async ({ uid, expenseType }, { rejectWithValue }) => {
    try {
        const expenseTypeKey = `${expenseType.toUpperCase()}_EXPENSE` as ExpenseType
        const expenseDocRef = doc(db, FIRESTORE_PATH_NAMES[expenseTypeKey], uid)
        const expenseDocSnapshot = await getDoc(expenseDocRef)

        if (expenseDocSnapshot.exists()) {
            const data = expenseDocSnapshot.data()
            return data.expenses as Expense[]
        } else {
            return []
        }
    } catch (error: any) {
        return rejectWithValue(error)
    }
})

const expensesSlice = createSlice({
    name: 'expenses',
    initialState,
    reducers: {},
    extraReducers: (promise) => {
        promise
        .addCase(fetchExpenses.pending, (state) => {
            state.loading = true
        })
        .addCase(fetchExpenses.fulfilled, (state, action: PayloadAction<Expense[]>) => {
            state.loading = false
            state.expenses = action.payload
        })
        .addCase(fetchExpenses.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Something went wrong'
        })
    }
})

export default expensesSlice.reducer