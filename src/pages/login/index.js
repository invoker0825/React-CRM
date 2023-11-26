import { useState } from 'react';
import { Button, Checkbox, Form, Input, Col, Row } from 'antd';
import {useNavigate} from 'react-router-dom';
import loginImage from '../../assets/img/login-image.png'
import './login.scss';

const LogIn = () => {
    const navigate = useNavigate()

    const [ step, setStep ] = useState('login');
    const [ logInData, setLogInData ] = useState({});

    const onFinishLogIn = (values) => {
        setLogInData(values);
        if (values.username === 'test@test.com' && values.password === 'test1234') setStep('authenticate');
    };

    const backToLogin = () => {
        setStep('login');
    }

    const onFinishAuth = (value) => {
        localStorage.setItem('logged', true);
        if (value.code === '123456') navigate('/dashboard');
    }

    return (
        <div className="login-page">
            <div className='left-blue'>
                <div className='login-left-section d-flex j-c-space-between flex-column'>
                    <div>
                        <p className='title'>Welcome to DSS Portal</p>
                        <p className='description'>DSS gives you the user friendly interface to manage your digital signage network with ease. </p>
                    </div>
                    <img src={loginImage} alt='trust images'></img>
                </div>
            </div>
            <div className='right-white'>
                <div className='login-right-section'>
                    {step === 'login' ?
                        <div>
                            <p className='logo-text'>EUMEDIA DMS</p>
                            <p className='login-title'>Login</p>
                            
                            <Form
                                name="login"
                                labelCol={{
                                    span: 8,
                                }}
                                wrapperCol={{
                                    span: 24,
                                }}
                                initialValues={{
                                    username: logInData.username,
                                    password: logInData.password,
                                    remember: logInData.remember
                                }}
                                layout='vertical'
                                onFinish={onFinishLogIn}
                                autoComplete="off"
                            >
                                <Form.Item
                                    label="Username"
                                    name="username"
                                    rules={[
                                        {
                                        required: true,
                                        type: "email",
                                        message: 'Please input your username!',
                                        },
                                    ]}
                                    className='form-input-section'
                                >
                                    <Input placeholder="Username"/>
                                </Form.Item>

                                <Form.Item
                                    label="Password"
                                    name="password"
                                    rules={[
                                        {
                                        required: true,
                                        message: 'Please input your password!',
                                        },
                                    ]}
                                    className='form-input-section'
                                >
                                    <Input.Password placeholder="Password"/>
                                </Form.Item>

                                <Row className='align-center check-section' justify={'space-between'}>
                                    <Col span={16}>
                                        <Form.Item
                                            name="remember"
                                            valuePropName="checked"
                                            wrapperCol={{
                                                span: 16,
                                            }}
                                            className='remember-check'
                                        >
                                            <Checkbox>Remember me</Checkbox>
                                        </Form.Item>
                                    </Col>
                                    
                                    <Col span={6}>
                                        <a href='/forgot' className='forgot'>Forgot password?</a>
                                    </Col>
                                </Row>

                                <Form.Item
                                    wrapperCol={{
                                        span: 16,
                                    }}
                                >
                                    <Button type="primary" htmlType="submit">
                                        Login
                                    </Button>
                                    <p className='signup-link'>Don't have an account?<span><a href='/'> Create free account</a></span></p>
                                </Form.Item>
                            </Form>
                            <p className='expire-warn'>Maintenance Date : Expired</p>
                        </div> :
                        <div className='authenticator-section'>
                            <p className='login-title'>Authenticator</p>
                            <p className='detail'>{logInData.username}</p>
                            <p className='enter-code'>Enter Code</p>
                            <p className='detail'>Enter the code displayed in the Microsoft Authenticator app on your mobile phone.</p>
                            
                            <Form
                                name="auth"
                                labelCol={{
                                    span: 8,
                                }}
                                wrapperCol={{
                                    span: 24,
                                }}
                                style={{
                                    maxWidth: 485,
                                }}
                                layout='vertical'
                                onFinish={onFinishAuth}                               
                                autoComplete="off"
                            >
                                <Form.Item
                                    label=""
                                    name="code"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your code!'
                                        },
                                    ]}
                                    className='form-input-section code-input'
                                >
                                    <Input placeholder="Code..."/>
                                </Form.Item>

                                <Form.Item
                                    wrapperCol={{
                                        span: 24,
                                    }}
                                >
                                    <div className='d-flex align-center j-c-space-between'>
                                        <Button type="primary" onClick={backToLogin}>Back</Button>
                                        <Button type="primary" htmlType="submit">Verify</Button>
                                    </div>
                                </Form.Item>
                            </Form>
                        </div>
                    }
                </div>
            </div>
        </div> 
    );
}

export default LogIn;
