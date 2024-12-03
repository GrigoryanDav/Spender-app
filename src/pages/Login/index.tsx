import { Form, Input, Button, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import './index.css'

const { Title } = Typography

const Login = () => {
    return (
        <div className='login_container'>
            <Form layout='vertical'>
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
                    <Button type='primary'>Sign In</Button>
                    <hr />
                    <Link to={ROUTES.REGISTER}><Button>Sign Up</Button></Link>
                </div>
            </Form>
        </div>
    )
}

export default Login