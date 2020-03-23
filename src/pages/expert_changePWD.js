import React from 'react';
import { Form, Input, Button, Switch } from 'antd';
import { MailOutlined, UserOutlined, LockOutlined, CheckSquareOutlined } from '@ant-design/icons';
import Router from 'next/router';
import LoginLayout from '../layouts/expert_LoginLayout';

export default class expert_ChangePWD extends React.Component{
    render() {
        return(
            <expert_LoginLayout>
                <Form
                    name="register"
                    initialValues={{ remember: true }}>
                    <Form.Item>
                        <div className="retrieve">找回密码</div>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}>
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="请设置密码"/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}>
                        <Input
                            prefix={<CheckSquareOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="请确认密码"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            立即找回
                        </Button>
                    </Form.Item>
                </Form>
            </expert_LoginLayout>
        )
    }
}