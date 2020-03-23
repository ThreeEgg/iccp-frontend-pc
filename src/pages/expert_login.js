import React from 'react';
import { Form, Input, Button, Switch } from 'antd';
import { MailOutlined, UserOutlined, LockOutlined, CheckSquareOutlined } from '@ant-design/icons';
import Router from 'next/router';
import { Tabs } from 'antd';
import './expert_index.less';
const { TabPane } = Tabs;

export default class extends React.Component {
  //注册昵称
  goToNickname = () => {
    Router.push('/expert_registerNickname');
  }
  goToMap = () => {
    Router.push('/map');
  }

  render() {
    return (
      <Tabs defaultActiveKey="1">
        {/* 注册 */}
        <TabPane tab="注册" key="2">
          <Form
            name="register"
            className="login-form"
            initialValues={{ remember: true }}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your Username!' }]}
            >
              <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your Password!' }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="请设置密码"
              />
            </Form.Item>
            <Form.Item
              name="confirm-password"
              rules={[{ required: true, message: 'Please confirm your Password!' }]}
            >
              <Input
                prefix={<CheckSquareOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="请确认密码"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" onClick={this.goToNickname}>
                立即注册
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
        {/* 登录 */}
        <TabPane tab="登录" key="1">
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}>
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your Username!' }]}
            >
              <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your Password!' }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="请输入密码"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button" onClick={this.goToMap}>
                立即登录
              </Button>
            </Form.Item>
            <Form.Item>
              <a className="login-form-forgot" href="/expert_retrievePWD">找回密码</a> 
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs> 
    )
  }
}
