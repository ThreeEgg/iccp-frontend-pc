import React from 'react';
import { Form, Input, Button, Switch } from 'antd';
import { MailOutlined, UserOutlined, LockOutlined, CheckSquareOutlined } from '@ant-design/icons';
import Router from 'next/router';
import { connect } from 'react-redux';
import LoginLayout from '../layouts/LoginLayout';
import './login.less';

class ChangePWD extends React.Component {
  formRef = React.createRef();

  modifyPassword = () => {
    const { password: newPassword, oldPassword } = this.formRef.current.getFieldsValue();

    this.props.dispatch({
      type: 'user/modifyPassword',
      payload: { newPassword, oldPassword },
    });
  };

  render() {
    return (
      <LoginLayout>
        <Form ref={this.formRef} name="register" initialValues={{ remember: true }}>
          <Form.Item>
            <div className="retrieve">修改密码</div>
          </Form.Item>
          <Form.Item name="oldPassword" rules={[{ required: true, message: '请输入原密码' }]}>
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="原密码"
            />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入新密码' }]}>
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="新密码"
            />
          </Form.Item>
          <Form.Item
            name="confirm-password"
            dependencies={['password']}
            rules={[
              { required: true, message: '请再次输入您的新密码' },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('两次输入密码不一致');
                },
              }),
            ]}
          >
            <Input
              prefix={<CheckSquareOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="确认密码"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" onClick={this.modifyPassword}>
              修改密码
            </Button>
          </Form.Item>
        </Form>
      </LoginLayout>
    );
  }
}

export default connect(({}) => ({}))(ChangePWD);
