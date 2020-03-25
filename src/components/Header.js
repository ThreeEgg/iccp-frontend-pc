import React from 'react';
import { Button, Switch } from 'antd';
import Link from 'next/link';
import { connect } from 'react-redux';
import './Header.less';

class Header extends React.Component {
  logout = () => {
    this.props.dispatch({
      type: 'user/logout',
    });
  };

  render() {
    const { isLogin, userInfo } = this.props;
    return (
      <div className="header">
        <img className="logo" src="/logo.svg" alt="" />
        <div className="line" />
        <div className="platName">国际风险管理平台</div>
        <div className="type">
          {!isLogin ? (
            <>
              <Button className="login-btn">
                <Link href="/login">登录</Link>
              </Button>
              <Button type="primary">
                <Link href="/login?register=1">注册</Link>
              </Button>
            </>
          ) : (
            <>
              <span style={{ display: 'inline-block', marginRight: 20 }}>
                你好, {userInfo.name}
              </span>
              <Link href="/changePassword">
                <a>修改密码</a>
              </Link>
              <a onClick={this.logout}>退出登录</a>
            </>
          )}
          <div className="line" />
          <span className="en">En</span>
          <Switch size="small" defaultChecked />
          <span className="cn">简中</span>
        </div>
      </div>
    );
  }
}

export default connect(({ user }) => ({
  isLogin: user.isLogin,
  userInfo: user.userInfo,
}))(Header);
