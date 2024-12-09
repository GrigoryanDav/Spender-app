import { Input, Button, Select, Form, notification } from 'antd'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { doc, setDoc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore'
import { db } from '../../services/firebase'
import { ROUTES } from '../../constants/routes'
import { menuItems } from '../../constants/menuItems'
import { MenuItem } from '../../ts/interfaces/menuItems'
import { ExpenseFormValues } from '../../ts/interfaces/expenseFormValues'
import { FIRESTORE_PATH_NAMES } from '../../constants/firestorePaths'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../ts/interfaces/rootState'
import { ExpenseType } from '../../ts/types/expenseType'
import { fetchAllExpenses, fetchAllIncomes } from '../../state-managment/slices/financialData'
import { fetchExpenses } from '../../state-managment/slices/expenses'
import { AppDispatch } from '../../state-managment/store'
import './index.css'

const { Option } = Select

const Cabinet = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const location = useLocation()
    const [expenseType, setExpenseType] = useState<ExpenseType | null>(null)
    const [buttonLoading, setButtonLoading] = useState<boolean>(false)
    const { authUserInfo: { userData } } = useSelector((store: RootState) => store.userProfile)
    const [form] = Form.useForm()
    const { currentCurrency, symbol } = useSelector((store: RootState) => store.currency)


    useEffect(() => {
        const savedPath = sessionStorage.getItem('currentPath')

        if (savedPath) {
            navigate(savedPath)
        } else {
            sessionStorage.setItem('currentPath', location.pathname)
        }
    }, [location, navigate])  

    const handleSelectChange = (value: ExpenseType) => {
        setExpenseType(value)
    }

    const handleExpense = async (values: ExpenseFormValues) => {
        setButtonLoading(true)
        try {
            if (!userData || !userData.uid) {
                throw new Error('User ID is not available')
            }

            if (!expenseType) {
                throw new Error('Expense type is required')
            }

            const { uid } = userData

            const expenseDataModel = {
                amount: values.expense,
                currencySymbol: symbol,
                currency: currentCurrency,
                description: values.description,
                createdAt: new Date().toISOString(),
                type: expenseType,
            }

            const expenseTypeKey = `${expenseType.toUpperCase()}_EXPENSE` as ExpenseType;
            const expenseDocRef = doc(db, FIRESTORE_PATH_NAMES[expenseTypeKey], uid)
            const expenseDocSnapshot = await getDoc(expenseDocRef)

            if (expenseDocSnapshot.exists()) {
                await updateDoc(expenseDocRef, {
                    expenses: arrayUnion(expenseDataModel)
                })
            } else {
                await setDoc(expenseDocRef, {
                    expenses: [expenseDataModel]
                })
            }

            dispatch(fetchExpenses({ uid: uid, expenseType: expenseType }))
            dispatch(fetchAllExpenses(currentCurrency))
            dispatch(fetchAllIncomes(currentCurrency))
            form.resetFields()
            notification.success({
                message: 'Your Expense successfully added'
            })
        } catch (error) {
            console.log('Expense Error:', error)
        } finally {
            setButtonLoading(false)
        }
    }

    const handleMenuClick = (item: MenuItem) => {
        const newPath = `${ROUTES.CABINET}/${item.value}`
        sessionStorage.setItem('currentPath', newPath)
        navigate(newPath)
    }

    return (
        <div className="cabinet_container">
            <div className='cabinet_menu_container'>
                {
                    menuItems.map((item: MenuItem) => {
                        return (
                            <div
                                key={item.value}
                                onClick={() => handleMenuClick(item)}
                            >
                                <span>{<item.icon />}</span>
                                <h2>{item.label}</h2>
                            </div>
                        )
                    })
                }
            </div>
            <div className='cabinet_form_container'>
                <Form layout='vertical' form={form} onFinish={handleExpense}>
                    <h3>Expense</h3>
                    <Form.Item
                        label='Your Expense Amount'
                        name='expense'
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Expense Amount'
                            }
                        ]}
                    >
                        <Input type='number' placeholder='Your Expense Amount' prefix={symbol} />
                    </Form.Item>

                    <Form.Item
                        label='Description'
                        name='description'
                        rules={[
                            {
                                required: true,
                                message: 'Please input Description'
                            }
                        ]}
                    >
                        <Input type='text' placeholder='Description' />
                    </Form.Item>

                    <Form.Item
                        label='Expense Type'
                        name='expenseType'
                        rules={[
                            {
                                required: true,
                                message: 'Please choose Expense Type'
                            }
                        ]}
                    >
                        <Select
                            placeholder='Choose Expense type'
                            onChange={handleSelectChange}
                        >
                            <Option value='car'>Car</Option>
                            <Option value='food'>Food</Option>
                            <Option value='shopping'>Shopping</Option>
                            <Option value='payments'>Payments</Option>
                            <Option value='gift'>Gift</Option>
                            <Option value='income'>Income</Option>
                        </Select>
                    </Form.Item>

                    <Button type='primary' htmlType='submit' loading={buttonLoading}>Submit</Button>
                </Form>
            </div>
        </div>
    )
}

export default Cabinet