import React, { Fragment } from 'react';
import { Button, Switch } from 'antd';
import Link from 'next/link';
import { connect } from 'react-redux';
import router from 'next/router';
import './Header.less';

class Header extends React.Component {
  logout = () => {
    this.props.dispatch({
      type: 'user/logout',
    });
  };

  gotoHome = () => {
    router.push('/');
  };

  render() {
    const { isLogin, userInfo } = this.props;

    return (
      <div className="header flex flex-align flex-justifyBetween">
        <div className="band flex flex-align" onClick={this.gotoHome}>
          <img className="logo" src="/logo-full.svg" alt="" />
          <div className="line" />
          <div className="platName">国际风险管理平台</div>
        </div>
        <div className="type">
          {!isLogin ? (
            <Fragment>
              <Button className="login-btn">
                <Link href="/login">
                  <a>登录</a>
                </Link>
              </Button>
              <Button type="primary">
                <Link href="/login?register=1">
                  <a>注册</a>
                </Link>
              </Button>
            </Fragment>
          ) : (
            <>
              <span>你好, {userInfo.name}</span>
              &nbsp; &nbsp;
              <Link href="/modifyPWD">
                <a>修改密码</a>
              </Link>
              &nbsp; &nbsp;
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
