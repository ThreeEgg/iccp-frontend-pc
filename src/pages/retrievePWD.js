import React from 'react';
import { Form, Input, Button, Switch } from 'antd';
import { MailOutlined, UserOutlined, LockOutlined, CheckSquareOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import LoginLayout from '../layouts/LoginLayout';
import './login.less';

class RetrievePWD extends React.Component {
  formRef = React.createRef();

  state = {
    hasSend: false,
    requestLoading: false,
  };

  requestEmailForResetPassword = () => {
    const { email } = this.formRef.current.getFieldsValue();

    this.setState({
      requestLoading: true,
    });
    this.props.dispatch({
      type: 'user/requestEmailForResetPassword',
      payload: {
        email,
        callback: () => {
          this.setState({
            hasSend: true,
            requestLoading: false,
          });
        },
      },
    });
  };

  render() {
    const { hasSend, requestLoading } = this.state;

    return (
      <LoginLayout>
        <Form ref={this.formRef} name="register">
          <Form.Item>
            <div className="retrieve">找回密码</div>
          </Form.Item>
          <Form.Item name="email" rules={[{ required: true, message: '请输入邮箱' }]}>
            <Input prefix={<MailOutlined />} placeholder="请输入您的邮箱账号" />
          </Form.Item>
          <Form.Item>
            <Button
              loading={requestLoading}
              type="primary"
              disabled={hasSend}
              onClick={this.requestEmailForResetPassword}
            >
              {!hasSend ? '发送验证码到邮箱' : '已发送至邮箱，请查收'}
            </Button>
          </Form.Item>
        </Form>
      </LoginLayout>
    );
  }
}

export default connect(({}) => ({}))(RetrievePWD);
