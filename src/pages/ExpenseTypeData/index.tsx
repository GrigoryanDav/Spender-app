import { fetchExpenses } from "../../state-managment/slices/expenses"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../ts/interfaces/rootState"
import { useParams, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { AppDispatch } from "../../state-managment/store"
import { Button, Spin } from "antd"
import { ROUTES } from "../../constants/routes"
import { convertCurrency } from "../../helpers/convertCurrency"
import './index.css'

const ExpenseTypeData = () => {
    const navigate = useNavigate()
    const { expenseType } = useParams<{ expenseType: string }>()
    const dispatch = useDispatch<AppDispatch>()
    const { expenses, loading } = useSelector((store: RootState) => store.expenses)
    const { authUserInfo: { userData } } = useSelector((store: RootState) => store.userProfile)
    const { exchangeRates, isLoading } = useSelector((store: RootState) => store.financialData)
    const { currentCurrency, symbol } = useSelector((store: RootState) => store.currency)


    useEffect(() => {
        if (userData && userData.uid && expenseType) {
            dispatch(fetchExpenses({ uid: userData.uid, expenseType: expenseType }))
        }
    }, [dispatch, expenseType, userData])


    const handleCabinetButton = () => {
        sessionStorage.removeItem('currentPath')
        navigate(ROUTES.CABINET)
    }

    if (loading || isLoading || !exchangeRates || Object.keys(exchangeRates).length === 0) return (<div className="expenses-page-loading"><Spin size="large" /></div>)

    return (
        <div className="expenses-page">
            <h2>{expenseType === "income" ? "Your Incomes" : "Your Expenses"}</h2>
            {expenses?.length > 0 ? (
                <div className="data_container">
                    <h3>{expenses[0].type}</h3>
                    <ul>
                        {expenses.map((expense, index) => {
                            const convertedAmount = convertCurrency(expense.amount, expense.currency.toUpperCase(), currentCurrency.toUpperCase(), exchangeRates)
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
                <p> {expenseType === 'income' ? 'No Incomes Found' : 'No Expenses Found'}</p>
            )}
            <Button onClick={handleCabinetButton}>Cabinet</Button>
        </div>
    )
}

export default ExpenseTypeData