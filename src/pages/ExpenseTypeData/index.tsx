import { fetchExpenses } from "../../state-managment/slices/expenses"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../ts/interfaces/rootState"
import { useParams } from "react-router-dom"
import { useEffect } from "react"
import { AppDispatch } from "../../state-managment/store"

const ExpenseTypeData = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { expenseType } = useParams()
    const { expenses, loading, error } = useSelector((store: RootState) => store.expenses)
    const { authUserInfo: { userData } } = useSelector((store: RootState) => store.userProfile)

    useEffect(() => {
        if (userData && userData.uid && expenseType) {
            dispatch(fetchExpenses({ uid: userData.uid, expenseType: expenseType }))
        }
    }, [dispatch, expenseType, userData])
    
    return (
        <div className="expenses-page">
            <h2>Your Expenses</h2>
            {expenses.length > 0 ? (
                <ul>
                    {expenses.map((expense, index) => (
                        <li key={index}>
                            <p>Amount: {expense.amount}</p>
                            <p>Description: {expense.description}</p>
                            <p>Type: {expense.type}</p>
                            <p>Date: {new Date(expense.createdAt).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No expenses found.</p>
            )}
        </div>
    )
}

export default ExpenseTypeData