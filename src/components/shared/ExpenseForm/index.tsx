import { Input, Button, Select, Form } from 'antd'
import { ExpenseFormProps } from '../../../ts/interfaces/expenseFormProps'; 
import { MenuItem } from '../../../ts/interfaces/menuItems'

const { Option } = Select

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onFinish, onSelectChange, form, buttonLoading, menuItems, symbol }) => {
    return (
        <Form layout='vertical' onFinish={onFinish} form={form}>
            <h3>Expense</h3>
            <Form.Item
                label='Your Expense Amount'
                name='expense'
                rules={[{ required: true, message: 'Please input your Expense Amount' }]}
            >
                <Input type='number' placeholder='Your Expense Amount' prefix={symbol} className='cabinet_expenseAmount_input' />
            </Form.Item>

            <Form.Item
                label='Description'
                name='description'
                rules={[{ required: true, message: 'Please input Description' }]}
            >
                <Input type='text' placeholder='Description' className='cabinet_description_input' />
            </Form.Item>

            <Form.Item
                label='Expense Type'
                name='expenseType'
                rules={[{ required: true, message: 'Please choose Expense Type' }]}
            >
                <Select placeholder='Choose Expense type' onChange={onSelectChange}>
                    {menuItems.map((item: MenuItem) => (
                        <Option key={item.value} value={item.value}>
                            <span>{<item.icon />}</span>
                            {item.label}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Button type='primary' htmlType='submit' loading={buttonLoading}>Submit</Button>
        </Form>
    )
}

export default ExpenseForm
