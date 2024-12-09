import { createSlice } from "@reduxjs/toolkit";
import { CurrencyCode } from "../../../ts/enums/CurrencyCode";
import { CurrencySymbols } from "../../../constants/currencySymbols";
import { CurrencyState } from "../../../ts/interfaces/currencyState";


const initialState: CurrencyState = {
    currentCurrency: CurrencyCode.AMD,
    symbol: CurrencySymbols[CurrencyCode.AMD],
}

const currencySlice = createSlice({
    name: 'currency',
    initialState,
    reducers: {
        setCurrency: (state, action) => {
            state.currentCurrency = action.payload.currency;
            state.symbol = action.payload.symbol;
        }
    },
})

export const { setCurrency } = currencySlice.actions
export default currencySlice.reducer