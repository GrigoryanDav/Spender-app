import { fetchExpenses } from "../../state-managment/slices/expenses"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../ts/interfaces/rootState"
import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { AppDispatch } from "../../state-managment/store"
import { useQueryParam } from "../../hooks/useQueryParam"
import { Button, Spin } from "antd"
import { ROUTES } from "../../constants/routes"
import { CurrencyCode } from "../../ts/enums/CurrencyCode"
import { CurrencySymbols } from "../../constants/currencySymbols"
import './index.css'

const ExpenseTypeData = () => {
    const { expenseType } = useParams<{ expenseType: string }>()
    const dispatch = useDispatch<AppDispatch>()
    const { getQueryParam } = useQueryParam()
    const { expenses, loading } = useSelector((store: RootState) => store.expenses)
    const { authUserInfo: { userData } } = useSelector((store: RootState) => store.userProfile)
    const currencyType = (getQueryParam('currency') as CurrencyCode) || CurrencyCode.AMD
    const symbol = getQueryParam('symbol') || CurrencySymbols.amd
    const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({})


    useEffect(() => {
        const handleFetch = () => {
            fetch(`https://open.er-api.com/v6/latest/${currencyType}`)
                .then((response) => response.json())
                .then((result) => {
                    setExchangeRates(result.rates)
                })
        }

        handleFetch()
    }, [currencyType])

    useEffect(() => {
        if (userData && userData.uid && expenseType) {
            dispatch(fetchExpenses({ uid: userData.uid, expenseType: expenseType }))
        }
    }, [dispatch, expenseType, userData])


    const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
        if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) return amount

        const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency]
        return amount * rate
    }

    if (loading || !exchangeRates || Object.keys(exchangeRates).length === 0) return (<div className="expenses-page-loading"><Spin size="large" /></div>)

    return (
        <div className="expenses-page">
            <h2>Your Expenses</h2>
            {expenses?.length > 0 ? (
                <div className="data_container">
                    <h3>{expenses[0].type}</h3>
                    <ul>
                        {expenses.map((expense, index) => {
                            const convertedAmount = convertCurrency(expense.amount, expense.currency.toUpperCase(), currencyType.toUpperCase())
                            return (
                                <li key={index}>
                                    <div>
                                        <div className="amount_description_container">
                                            <p className="data_amount">Amount: {convertedAmount?.toFixed(2)} {symbol}</p>
                                            <p className="data_description">Description: {expense.description}</p>
                                        </div>
                                        <p className="data_time">Date: {new Date(expense.createdAt).toLocaleString()}</p>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            ) : (
                <p>No expenses found.</p>
            )}
            <Link to={ROUTES.CABINET}><Button>Cabinet</Button></Link>
        </div>
    )
}

export default ExpenseTypeData