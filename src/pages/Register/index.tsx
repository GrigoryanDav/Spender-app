import { Form, Input, Button } from "antd"
import { Link, useNavigate } from "react-router-dom"
import { ROUTES } from "../../constants/routes"
import { useState } from "react"
import { auth } from "../../services/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { RegisterFormValues } from "../../ts/interfaces/RegisterFormValues"

const Register = () => {
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm()
    const navigate = useNavigate()

    const handleRegister = async (values: RegisterFormValues) => {
        setLoading(true)
        const { email, password } = values
        try {
            await createUserWithEmailAndPassword(auth, email, password)
            navigate(ROUTES.LOGIN)
        } catch (error) {
            console.log('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <Form layout="vertical" form={form} onFinish={handleRegister}>
                <Form.Item
                    label='First Name'
                    name='firstName'
                    rules={[
                        {
                            required: true,
                            message: 'Please input your First Name'
                        }
                    ]}
                >
                    <Input type="text" placeholder="First Name"/>
                </Form.Item>

                <Form.Item
                    label='Last Name'
                    name='lastName'
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Last Name'
                        }
                    ]}
                >
                    <Input type="text" placeholder="Last Name"/>
                </Form.Item>

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
                    <Input type="email" placeholder="Email"/>
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
                    <Input.Password placeholder="Password"/>
                </Form.Item>

                <Button type="primary" htmlType="submit" loading={loading}>Sign Up</Button>
                <Link to={ROUTES.LOGIN}><Button>Sign In</Button></Link>
            </Form>
        </div>
    )
}

export default Register