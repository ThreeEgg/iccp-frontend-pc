import React, { Fragment } from 'react';
import { Button, Switch, Modal, Avatar, Menu, Dropdown } from 'antd';
import { ExclamationCircleOutlined, UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { connect } from 'react-redux';
import router, { withRouter } from 'next/router';
import intl from 'react-intl-universal';
import './Header.less';

class Header extends React.Component {
  logout = () => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      content: '是否要退出登录',
      okText: '是的',
      cancelText: '取消',
      onOk: () => {
        this.props.dispatch({
          type: 'user/logout',
        });
      },
    });
  };

  gotoHome = () => {
    router.push('/');
  };

  changeLang = flag => {
    this.props.dispatch({
      type: 'app/setLang',
      lang: flag ? 'zh-CN' : 'en',
    });
  };

  renderMenu = () => {
    return (
      <Menu>
        <Menu.Item>
          <Link href="/modifyPWD">
            <a>{intl.get('修改密码')}</a>
          </Link>
        </Menu.Item>
        {/* <Menu.Item>
          修改昵称
        </Menu.Item> */}
        <Menu.Item>
          <a onClick={this.logout}>{intl.get('退出登录')}</a>
        </Menu.Item>
      </Menu>
    );
  }

  render() {
    const { isLogin, userInfo, pathname = '', lang } = this.props;

    let isExpertPage = false;
    // TODO: 需要获取到pathname
    // // 如果专家端，则隐藏注册按钮
    // if (pathname.match('/expert')) {
    //   isExpertPage = true;
    // }

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
              {!isExpertPage ? (
                <Button type="primary">
                  <Link href="/login?register=1">
                    <a>注册</a>
                  </Link>
                </Button>
              ) : null}
            </Fragment>
          ) : (
              <Dropdown overlay={this.renderMenu()} placement="bottomCenter" overlayClassName='menu-overlay'>
                <span>
                  <Avatar size="small" icon={<UserOutlined />} />
              &nbsp; &nbsp;
                  <span>你好, {userInfo.name}</span>
                </span>
              </Dropdown>
            )}
          <div className="line" />
          <span className="en">En</span>
          <Switch size="small" checked={lang !== 'en'} onChange={this.changeLang} />
          <span className="cn">简中</span>
        </div>
      </div>
    );
  }
}

export default connect(({ user, app }) => ({
  isLogin: user.isLogin,
  userInfo: user.userInfo,
  lang: app.lang,
}))(withRouter(Header));
