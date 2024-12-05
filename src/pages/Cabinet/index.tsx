import { Input, Button, Select, Form, notification} from 'antd'
import { useState } from 'react'
import { menuItems } from '../../constants/menuItems'
import { MenuItem } from '../../ts/interfaces/menuItems'
import { ExpenseFormValues } from '../../ts/interfaces/expenseFormValues'
import './index.css'

const { Option } = Select

const Cabinet = () => {
    const [expenseType, setExpenseType] = useState<string | null>(null)
    const [buttonLoading, setButtonLoading] = useState<boolean>(false)
    const [form] = Form.useForm()

    const handleSelectChange = (value: string) => {
        setExpenseType(value)
    }

    const handleExpense = (values: ExpenseFormValues) => {
        setButtonLoading(true)
        try {

        } catch (error) {
            console.log('Expense Error:', error)
        } finally {
            setButtonLoading(false)
        }
    }

    return (
        <div className="cabinet_container">
            <div className='cabinet_menu_container'>
                {
                    menuItems.map((item: MenuItem) => {
                        return (
                            <div key={item.value}>
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
                        label='Your Expense'
                        name='expense'
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Expense'
                            }
                        ]}
                    >
                        <Input type='number' placeholder='Your Expense' />
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

                    <Button type='primary' htmlType='submit'>Submit</Button>
                </Form>
            </div>
        </div>
    )
}

export default Cabinet