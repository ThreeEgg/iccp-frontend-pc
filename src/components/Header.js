import React from 'react';
import { Button, Switch } from 'antd';
import Link from 'next/link';
import './Header.less';

export default class Header extends React.Component {
  render() {
    return (
      <div className="header">
        <img className="logo" src="/logo.svg" alt="" />
        <div className="line" />
        <div className="platName">国际风险管理平台</div>
        <div className="type">
          <Button className="login-btn">
            <Link href="/login">登录</Link>
          </Button>
          <Button type="primary">
            <Link href="/login?register=1">注册</Link>
          </Button>
          <div className="line" />
          <span className="en">En</span>
          <Switch size="small" defaultChecked />
          <span className="cn">简中</span>
        </div>
      </div>
    );
  }
}
