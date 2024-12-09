import { CurrencyCode } from "../enums/CurrencyCode";


export interface CurrencyState {
    currentCurrency: CurrencyCode;
    symbol: string;
}