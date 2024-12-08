import { Form, Input, Button, Typography, Progress } from "antd"
import { Link, useNavigate } from "react-router-dom"
import { ROUTES } from "../../constants/routes"
import { useState } from "react"
import { auth } from "../../services/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { db } from "../../services/firebase"
import { FIRESTORE_PATH_NAMES } from "../../constants/firestorePaths"
import { RegisterFormValues } from "../../ts/interfaces/RegisterFormValues"
import { passwordValidation } from '../../constants/passwordValidation'
import './index.css'

const { Title } = Typography

const Register = () => {
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm()
    const navigate = useNavigate()
    const [passwordStrength, setPasswordStrength] = useState<number>(0)

    const checkPasswordStrength = (value: string) => {
        let strength = 0
        if (value.length >= 1) strength += 20
        if (value.length >= 10) strength += 20
        if (/[A-Z]/.test(value)) strength += 20
        if (/[0-9]/.test(value)) strength += 20
        if (/[!@#$%^&*]/.test(value)) strength += 20

        setPasswordStrength(strength)
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        checkPasswordStrength(e.target.value.trim())
    }

    const handleRegister = async (values: RegisterFormValues) => {
        setLoading(true)
        const { firstName, lastName, email, password } = values
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password)
            const { uid } = response.user
            const createdDoc = doc(db, FIRESTORE_PATH_NAMES.REGISTERED_USERS, uid)
            await setDoc(createdDoc, {
                firstName, lastName, email, uid
            })
            navigate(ROUTES.LOGIN)
        } catch (error) {
            console.log('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="register_container">
            <Form layout="vertical" form={form} onFinish={handleRegister}>
                <Title level={3}>
                    Sign Up
                </Title>

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
                    <Input type="text" placeholder="First Name" />
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
                    <Input type="text" placeholder="Last Name" />
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
                    <Input type="email" placeholder="Email" />
                </Form.Item>

                <Form.Item
                    label='Password'
                    name='password'
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Password'
                        }, 
                        {
                            pattern: passwordValidation,
                            message: 'Password does not meet the criteria',
                        }
                    ]}
                >
                    <Input.Password placeholder="Password" onChange={handlePasswordChange}/>
                </Form.Item>

                {
                    form.getFieldValue('password') && (
                        <Progress 
                        percent={passwordStrength}
                        showInfo={false}
                        strokeColor={
                            passwordStrength < 40 ? 'red' : passwordStrength < 80 ? 'orange' : 'green'
                        }
                        />
                    )
                }

                {

                    form.getFieldValue('password') && (
                        <p style={{color : passwordStrength < 40 ? 'red' : passwordStrength < 80 ? 'orange' : 'green'}}>
                            {
                            passwordStrength < 40 ? 'Weak password' : passwordStrength < 80 ? 'Medium password' : 'Strong Password'
                        }
                        </p>
                    )
                }


                <div className="register_buttons_container">
                    <Button type="primary" htmlType="submit" loading={loading}>Sign Up</Button>
                    <hr />
                    <Link to={ROUTES.LOGIN}><Button>Sign In</Button></Link>
                </div>
            </Form>
        </div>
    )
}

export default Register