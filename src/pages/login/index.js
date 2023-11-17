import { useState } from 'react';
import { Button, Checkbox, Form, Input, Col, Row } from 'antd';
import loginImage from '../../assets/img/login-image.png'
import './login.scss';

const LogIn = () => {

    const [ step, setStep ] = useState('login');
    const [ logInData, setLogInData ] = useState({});

    const onFinish = (values) => {
        setLogInData(values);
        setStep('authenticate');
    };

    const backToLogin = () => {
        setStep('login');
    }

    return (
        <div className="login-page">
            <div className='w-38'>
                <div className='login-left-section d-flex j-c-space-between flex-column'>
                    <div>
                        <p className='title'>Welcome to DSS Portal</p>
                        <p className='description'>DSS gives you the user friendly interface to manage your digital signage network with ease. </p>
                    </div>
                    <img src={loginImage} alt='trust images'></img>
                </div>
            </div>
            <div className='w-62'>
                <div className='login-right-section'>
                    {step === 'login' ?
                        <div>
                            <p className='login-title'>Login</p>
                            
                            <Form
                                name="basic"
                                labelCol={{
                                    span: 8,
                                }}
                                wrapperCol={{
                                    span: 24,
                                }}
                                style={{
                                    maxWidth: 485,
                                }}
                                initialValues={{
                                    username: logInData.username,
                                    password: logInData.password,
                                    remember: logInData.remember
                                }}
                                layout='vertical'
                                onFinish={onFinish}
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

                                <Row className='align-center check-section'>
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
                                    
                                    <Col span={7}>
                                        <a href='/' className='forgot'>Forgot password?</a>
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
                                </Form.Item>
                            </Form>
                        </div> :
                        <div className='authenticator-section'>
                            <p className='login-title'>Authenticator</p>
                            <p className='detail'>{logInData.username}</p>
                            <p className='enter-code'>Enter Code</p>
                            <p className='detail'>Enter the code displayed in the Microsoft Authenticator app on your mobile phone.</p>
                            <input placeholder='Code...' />
                            <div className='d-flex align-center j-c-space-between'>
                                <Button type="primary" onClick={backToLogin}>Back</Button>
                                <Button type="primary">Verify</Button>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div> 
    );
}

export default LogIn;
