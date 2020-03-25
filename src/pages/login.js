import React from 'react';
import intl from 'react-intl-universal';
import LoginLayout from '../layouts/LoginLayout';
import { Tabs, Form, Input, Button } from 'antd';
import { MailOutlined, LockOutlined, CheckSquareOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import router from 'next/router';
import './login.less';
const { TabPane } = Tabs;

class Login extends React.Component {
  static async getInitialProps({ req, query }) {
    // const userAgent = req ? req.headers['user-agent'] : navigator.userAgent

    // 服务端请求
    // const fetch = require('isomorphic-unfetch');
    // const res = await fetch('http://gank.io/api/data/Android/10/1');
    // const json = await res.json();
    return {
      // stars: json.results[0].desc,
      // userAgent,
      activeTab: query.register ? 'register' : 'login',
    };
  }

  state = {
    lang: '',
  };

  loginFormRef = React.createRef();
  registerFormRef = React.createRef();
  //注册昵称
  goToNickname = () => {
    // Router.push('/registerNickname');
  };
  goToMap = () => {
    // Router.push('/map');
  };

  login = () => {
    const { password, userName } = this.loginFormRef.current.getFieldsValue();
    this.props.dispatch({
      type: 'user/login',
      payload: { password, userName },
    });
  };

  register = () => {
    const { password, email } = this.registerFormRef.current.getFieldsValue();

    this.props.dispatch({
      type: 'user/register',
      payload: { password, email },
    });
  };

  changLang = () => {
    localStorage.lang = localStorage.lang == 'en-US' ? 'zh-CN' : 'en-US';
    window.location.reload();
  };

  onChangeTab = value => {
    if (value === 'login') {
      router.replace('/login');
    }
    if (value === 'register') {
      router.replace('/login?register=1');
    }
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
    const { activeTab, registerValidateStatus } = this.props;

    return (
      <LoginLayout>
        <Tabs activeKey={activeTab} onChange={this.onChangeTab}>
          {/* 注册 */}
          <TabPane tab="注册" key="register">
            <Form
              ref={this.registerFormRef}
              name="register"
              className="login-form"
              initialValues={{ remember: true }}
            >
              <Form.Item name="email" rules={[{ required: true, message: '请输入邮箱' }]}>
                <Input
                  prefix={<MailOutlined className="site-form-item-icon" />}
                  placeholder="请输入邮箱"
                />
              </Form.Item>
              <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="请设置密码"
                />
              </Form.Item>
              <Form.Item
                name="confirm-password"
                dependencies={['password']}
                rules={[
                  { required: true, message: '请再次输入您的密码' },
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
                  type="confirmPassword"
                  placeholder="请确认密码"
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" onClick={this.register}>
                  立即注册
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          {/* 登录 */}
          <TabPane tab="登录" key="login">
            <Form
              ref={this.loginFormRef}
              name="normal_login"
              className="login-form"
              initialValues={{ remember: true }}
            >
              <Form.Item name="userName" rules={[{ required: true, message: '请输入邮箱' }]}>
                <Input
                  prefix={<MailOutlined className="site-form-item-icon" />}
                  placeholder="请输入用户名"
                />
              </Form.Item>
              <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
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
