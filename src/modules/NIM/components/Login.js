/*
 * @Descripttion:
 * @version:
 * @Author: 毛翔宇
 * @Date: 2020-03-19 14:11:19
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-03-25 16:21:52
 * @FilePath: \PC端-前端\src\modules\NIM\components\Login.js
 */
import React from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Modal } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

import md5 from '../utils/md5';
import config from '../configs';

function LoginButton(props) {
  const { isLogin, clickLogin, clickLogout } = props;
  if (isLogin) {
    return (
      <Button type="primary" danger onClick={clickLogout}>
        登出NIM
      </Button>
    )
  } else {
    return (
      <Button type="primary" onClick={clickLogin}>
        登录NIM
      </Button>
    )
  }
}

class Login extends React.Component {
  state = {
    logo: config.logo,
    account: '',
    password: '',
    errorMsg: '',
    visible: false,
  };
  static propTypes = {
    show: PropTypes.bool,
  };
  static defaultProps = {
    show: false,
  };

  showLogin = () => {
    this.setState({
      visible: true,
    });
  };

  logout = () => {
    this.props.dispatch({ type: 'chat/logout' })
  };
  login = e => {
    if (this.state.account === '') {
      this.setState({
        errorMsg: '帐号不能为空',
      });
      return;
    } else if (this.state.password === '') {
      this.setState({
        errorMsg: '密码不能为空',
      });
      return;
    } else if (this.state.password.length < 6) {
      this.setState({
        errorMsg: '密码至少需要6位',
      });
      return;
    }
    this.setState({
      errorMsg: '',
    });
    // 本demo做一次假登录
    // 真实场景应在此向服务器发起ajax请求
    let sdktoken = md5(this.state.password);
    // 服务端帐号均为小写
    localStorage.uid = this.state.account.toLowerCase();
    localStorage.sdktoken = sdktoken;
    // 提交sdk连接请求
    this.props.dispatch({ type: 'chat/connect' })
      .then((result) => {
        this.setState({
          visible: !this.props.isLogin,
        });
      })
  };
  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  componentDidMount = () => {
    // 提交sdk连接请求
    this.props.dispatch({ type: 'chat/connect' })
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.isLogin !== this.props.isLogin) {
      this.setState({
        visible: !this.props.isLogin,
      });
    }
  };

  render() {
    const { chat } = this.props;
    const { isLogin } = chat;
    return (
      <div>
        <LoginButton isLogin={isLogin} clickLogout={this.logout} clickLogin={this.showLogin} />
        <Modal
          title="登录NIM"
          visible={this.state.visible}
          okText="登录"
          cancelText="取消"
          closable={false}
          maskClosable={false}
          onOk={this.login}
          onCancel={this.handleCancel}
        >
          <Form name="login" className="login-form" initialValues={{ remember: true }}>
            <Form.Item>
              <img className="logo" src={this.state.logo} style={{ background: '#0091e4' }} />
            </Form.Item>
            <Form.Item name="account" rules={[{ required: true, message: '请输入用户名!' }]}>
              <Input
                prefix={<MailOutlined className="site-form-item-icon" />}
                placeholder="请输入帐号"
                value={this.state.account}
                onChange={e => {
                  this.setState({
                    account: e.target.value,
                  })
                }}
              />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: '请输入密码!' }]}>
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="请输入密码"
                value={this.state.password}
                onChange={e => {
                  this.setState({
                    password: e.target.value,
                  })
                }}
              />
            </Form.Item>
            <Form.Item>
              {this.state.errorMsg ? <div className="error">{this.state.errorMsg}</div> : ''}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default connect(({ chat }) => ({
  chat,
  isLogin: chat.isLogin
}))(Login);
