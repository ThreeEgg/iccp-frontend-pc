/*
 * @Descripttion:
 * @version:
 * @Author: 毛翔宇
 * @Date: 2020-03-19 14:11:19
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-03-20 09:58:08
 * @FilePath: \PC端-前端\src\modules\NIM\components\Login.js
 */
import React from 'react';
import { Form, Input, Button, Modal } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

import md5 from '../utils/md5';
import cookie from '../utils/cookie';
import config from '../configs';

export default class Login extends React.Component {
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
    if (this.account === '') {
      this.errorMsg = '帐号不能为空';
      return;
    } else if (this.password === '') {
      this.errorMsg = '密码不能为空';
      return;
    } else if (this.password.length < 6) {
      this.errorMsg = '密码至少需要6位';
      return;
    }
    this.errorMsg = '';
    // 本demo做一次假登录
    // 真实场景应在此向服务器发起ajax请求
    let sdktoken = md5(this.password);
    // 服务端帐号均为小写
    cookie.setCookie('uid', this.account.toLowerCase());
    cookie.setCookie('sdktoken', sdktoken);
    this.setState({
      visible: false,
    });
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
        <Button type="primary" onClick={this.showModal}>
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
            {/* <Form.Item>
              <img class="logo" src={logo} />
            </Form.Item> */}
            <Form.Item name="account" rules={[{ required: true, message: '请输入用户名!' }]}>
              <Input
                prefix={<MailOutlined className="site-form-item-icon" />}
                placeholder="请输入用户名"
              />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: '请输入密码!' }]}>
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="请输入密码"
              />
            </Form.Item>
            <Form.Item>
              {this.state.errorMsg ? <div class="error">{this.state.errorMsg}</div> : ''}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}
