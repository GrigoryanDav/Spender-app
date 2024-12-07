import { CurrencyCode } from "../ts/enums/CurrencyCode"

export const CurrencySymbols: Record<CurrencyCode, string> = {
    [CurrencyCode.USD]: '$',
    [CurrencyCode.RUB]: '₽',
    [CurrencyCode.EUR]: '€',
    [CurrencyCode.GBP]: '£',
    [CurrencyCode.AMD]: '֏'
}