import React from 'react';
import intl from 'react-intl-universal';
import { Tabs, Form, Input, Button } from 'antd';
import { MailOutlined, LockOutlined, CheckSquareOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import router from 'next/router';
import LoginLayout from '../../layouts/LoginLayout';
// import './login.less';
const { TabPane } = Tabs;

class Login extends React.Component {
  state = {
    lang: '',
  };

  loginFormRef = React.createRef();

  login = () => {
    const { password, userName } = this.loginFormRef.current.getFieldsValue();
    this.props.dispatch({
      type: 'user/login',
      payload: { password, userName, platform: 'expert' },
    });
  };

  componentDidMount = () => {
    this.setState({
      lang: intl.determineLocale({
        urlLocaleKey: 'lang',
        localStorageLocaleKey: 'lang',
      }),
    });
  };

  render() {
    return (
      <LoginLayout>
        <Tabs defaultActiveKey="login">
          {/* 登录 */}
          <TabPane tab="登录" key="login">
            <Form
              ref={this.loginFormRef}
              name="normal_login"
              className="login-form"
              initialValues={{ remember: true }}
            >
              <Form.Item
                name="userName"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入正确的邮箱' },
                  { min: 1, max: 30, message: '邮箱为1-30个字符' },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="site-form-item-icon" />}
                  placeholder="请输入邮箱"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 8, max: 20, message: '密码大于8位且小于20位' },
                ]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="请输入密码"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  onClick={this.login}
                >
                  立即登录
                </Button>
              </Form.Item>
              <Form.Item>
                <a className="login-form-forgot" href="/retrievePWD">
                  找回密码
                </a>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </LoginLayout>
    );
  }
}

export default connect(({ user }) => ({}))(Login);
