import React from 'react';
import { Form, Input, Button, Switch } from 'antd';
import { MailOutlined, UserOutlined, LockOutlined, CheckSquareOutlined } from '@ant-design/icons';
import Router from 'next/router';
import LoginLayout from '../layouts/LoginLayout';

export default class RegisterNickname extends React.Component{
    render() {
        return(
            <LoginLayout>
                <Form
                    name="basic"
                    initialValues={{ remember: true }}>
                    <Form.Item>
                        <div className="retrieve">怎么称呼您呢？</div>
                    </Form.Item>
                    <Form.Item
                        name="username"
                        rules={[{required: true,message: 'Please input your username!'}]}>
                        <Input className="userName" placeholder="请输入昵称" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                        完成并登录
                        </Button>
                    </Form.Item>
                </Form>
            </LoginLayout>
        )
    }
}