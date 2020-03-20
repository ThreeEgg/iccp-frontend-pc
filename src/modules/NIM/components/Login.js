/*
 * @Descripttion:
 * @version:
 * @Author: 毛翔宇
 * @Date: 2020-03-19 14:11:19
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-03-20 18:13:47
 * @FilePath: \PC端-前端\src\modules\NIM\components\Login.js
 */
import React from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Modal } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

import md5 from '../utils/md5';
import cookie from '../utils/cookie';
import config from '../configs';

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
    cookie.setCookie('uid', this.state.account.toLowerCase());
    cookie.setCookie('sdktoken', sdktoken);
    this.setState({
      visible: false,
    });
    // 提交sdk连接请求
    this.props.dispatch({ type: 'chat/connect',obj:{} })
  };
  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  componentDidMount = () => {
    if (!localStorage.imAccount || !localStorage.imToken) {
      this.setState({
        visible: true,
      });
    }
  };

  render() {
    return (
      <div>
        <Button type="primary" onClick={this.showLogin}>
          登录NIM
        </Button>
        <Modal
          title="登录NIM"
          visible={this.state.visible}
          okText="登录"
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
  chat:chat
}))(Login);
