import { Input, Button, Select, Form, notification } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, setDoc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore'
import { db } from '../../services/firebase'
import { ROUTES } from '../../constants/routes'
import { menuItems } from '../../constants/menuItems'
import { useQueryParam } from '../../hooks/useQueryParam'
import { MenuItem } from '../../ts/interfaces/menuItems'
import { ExpenseFormValues } from '../../ts/interfaces/expenseFormValues'
import { FIRESTORE_PATH_NAMES } from '../../constants/firestorePaths'
import { useSelector } from 'react-redux'
import { RootState } from '../../ts/interfaces/rootState'
import { ExpenseType } from '../../ts/types/expenseType'
import { CurrencySymbols } from '../../constants/currencySymbols'
import { CurrencyCode } from '../../ts/enums/CurrencyCode'
import './index.css'

const { Option } = Select

const Cabinet = () => {
    const navigate = useNavigate()
    const { getQueryParam, setQueryParam } = useQueryParam()
    const [expenseType, setExpenseType] = useState<ExpenseType | null>(null)
    const [buttonLoading, setButtonLoading] = useState<boolean>(false)
    const { authUserInfo: { userData } } = useSelector((store: RootState) => store.userProfile)
    const [form] = Form.useForm()
    const currencyType = (getQueryParam('currency') as CurrencyCode) || CurrencyCode.AMD
    const currencySymbol =  getQueryParam('symbol') || CurrencySymbols.amd

    const handleSelectChange = (value: ExpenseType) => {
        setExpenseType(value)
    }

    const handleExpense = async (values: ExpenseFormValues) => {
        setButtonLoading(true)
        console.log(values)
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
                currencySymbol: currencySymbol,
                currency: currencyType,
                description: values.description,
                createdAt: new Date().toISOString(),
                type: expenseType,
            }

            const expenseTypeKey = `${expenseType.toUpperCase()}_EXPENSE` as keyof typeof FIRESTORE_PATH_NAMES;
            console.log(expenseTypeKey)
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
        navigate(`${ROUTES.CABINET}/expense/${item.value}`)
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
                        <Input type='number' placeholder='Your Expense Amount' prefix={currencySymbol} />
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
                        </Select>
                    </Form.Item>

                    <Button type='primary' htmlType='submit' loading={buttonLoading}>Submit</Button>
                </Form>
            </div>
        </div>
    )
}

export default Cabinet