import { Form, Input, Button } from 'antd'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'


const Login = () => {
    return (
        <div>
            <Form layout='vertical'>
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
                    <Input type='email' placeholder='Email'/>
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

                <Button type='primary'>Sign In</Button>
                <Link to={ROUTES.REGISTER}><Button>Sign Up</Button></Link>
            </Form>
        </div>
    )
}

export default Login