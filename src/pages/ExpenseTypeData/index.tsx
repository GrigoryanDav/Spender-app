import { fetchExpenses } from "../../state-managment/slices/expenses"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../ts/interfaces/rootState"
import { useParams, Link } from "react-router-dom"
import { useEffect } from "react"
import { AppDispatch } from "../../state-managment/store"
import { Button } from "antd"
import { ROUTES } from "../../constants/routes"
import './index.css'

const ExpenseTypeData = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { expenseType } = useParams()
    const { expenses } = useSelector((store: RootState) => store.expenses)
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
                <div className="data_container">
                    <h3>{expenses[0].type}</h3>
                    <ul>
                        {expenses.map((expense, index) => (
                            <li key={index}>
                                <div>
                                    <div className="amount_description_container">
                                        <p className="data_amount">Amount: {expense.amount}</p>
                                        <p className="data_description">Description: {expense.description}</p>
                                    </div>
                                    <p className="data_time">Date: {new Date(expense.createdAt).toLocaleString()}</p>
                                </div>


                            </li>
                        ))}
                    </ul>
                    <Link to={ROUTES.CABINET}><Button>Cabinet</Button></Link>
                </div>
            ) : (
                <p>No expenses found.</p>
            )}
        </div>
    )
}

export default ExpenseTypeData