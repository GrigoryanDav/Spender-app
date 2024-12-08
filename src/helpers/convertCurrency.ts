export const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string, exchangeRates: Record<string, number>): number => {
    if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) return amount;

    const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
    return amount * rate;
};
