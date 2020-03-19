import React from 'react';
import { Form, Input, Button, Switch } from 'antd';
import { MailOutlined, UserOutlined, LockOutlined, CheckSquareOutlined } from '@ant-design/icons';
import Router from 'next/router';
import LoginLayout from '../layouts/LoginLayout';

export default class RetrievePWD extends React.Component{
    goTochangePWD = () => {
        Router.push('/changePWD');
    }

    render() {
        return(
            <LoginLayout>
                <Form
                    name="register"
                    initialValues={{ remember: true }}>
                    <Form.Item>
                        <div className="retrieve">找回密码</div>
                    </Form.Item>
                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: 'Please input your Email!' }]}>
                        <Input prefix={<MailOutlined />} placeholder="请输入您的邮箱账号" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={this.goTochangePWD}>
                        下一步
                        </Button>
                    </Form.Item>
                </Form>
            </LoginLayout>
        )
    }
}