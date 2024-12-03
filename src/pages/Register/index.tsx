import { Form, Input, Button } from "antd"
import { Link } from "react-router-dom"
import { ROUTES } from "../../constants/routes"

const Register = () => {
    return (
        <div>
            <Form layout="vertical">
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

                <Button type="primary">Sign Up</Button>
                <Link to={ROUTES.LOGIN}><Button>Sign In</Button></Link>
            </Form>
        </div>
    )
}

export default Register