import React from 'react';
import { Form, Input, Button, Switch } from 'antd';
import { MailOutlined, UserOutlined, LockOutlined, CheckSquareOutlined } from '@ant-design/icons';
import Router from 'next/router';
import { connect } from 'react-redux';
import LoginLayout from '../../layouts/LoginLayout';
import './login.less';

class ChangePWD extends React.Component {
  static async getInitialProps({ req, query }) {
    return {
      verifyCode: query.verifyCode,
    };
  }

  formRef = React.createRef();

  resetPassword = () => {
    const { password: newPassword } = this.formRef.current.getFieldsValue();
    const { verifyCode } = this.props;

    this.props.dispatch({
      type: 'expertUser/resetPassword',
      payload: { newPassword, verifyCode },
    });
  };

  render() {
    return (
      <LoginLayout>
        <Form ref={this.formRef} name="register" initialValues={{ remember: true }}>
          <Form.Item>
            <div className="retrieve">找回密码</div>
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
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
            <Button type="primary" htmlType="submit" onClick={this.resetPassword}>
              立即找回
            </Button>
          </Form.Item>
        </Form>
      </LoginLayout>
    );
  }
}

export default connect(({}) => ({}))(ChangePWD);
