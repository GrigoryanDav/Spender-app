import { Form, Input, Button, Typography, notification } from 'antd'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { useState } from 'react'
import { auth } from '../../services/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { LoginFormValues } from '../../ts/interfaces/LoginFormValues'
import { useDispatch} from 'react-redux'
import { fetchUserProfileInfo } from '../../state-managment/slices/userProfile'
import { AppDispatch } from '../../state-managment/store'
import './index.css'

const { Title } = Typography

const Login = () => {
    const dispatch = useDispatch<AppDispatch>()
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm()

    const handleLogin = async (values: LoginFormValues) => {
        setLoading(true)
        const { email, password } = values
        try {
            await signInWithEmailAndPassword(auth, email, password)
            form.resetFields()
            dispatch(fetchUserProfileInfo())
        } catch (error) {
            notification.error({
                message: 'Invalid Login Credentials'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='login_container'>
            <Form layout='vertical' form={form} onFinish={handleLogin}>
                <Title level={3}>
                    Sign In
                </Title>

                <Form.Item
                    label='Email'
                    name='email'
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Email'
                        }
                    ]}
                >
                    <Input type='email' placeholder='Email' />
                </Form.Item>

                <Form.Item
                    label='Password'
                    name='password'
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Password'
                        }
                    ]}
                >
                    <Input.Password placeholder='Password' />
                </Form.Item>

                <div className='login_buttons_container'>
                    <Button type='primary' htmlType='submit' loading={loading}>Sign In</Button>
                    <hr />
                    <Link to={ROUTES.REGISTER}><Button>Sign Up</Button></Link>
                </div>
            </Form>
        </div>
    )
}

export default Login