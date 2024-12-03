import { Form, Input, Button } from 'antd'


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
            </Form>
        </div>
    )
}

export default Login