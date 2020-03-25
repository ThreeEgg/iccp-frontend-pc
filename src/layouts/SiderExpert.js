import React from 'react';
import Router from 'next/router';
import { Menu } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import './sider.less';

const { SubMenu } = Menu;

export default class Sider extends React.Component {
  // submenu keys of first level
  rootSubmenuKeys = ['sub1', 'sub2', 'sub3', 'sub4'];

  state = {
    openKeys: ['sub1'],
  };

  onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  };

  onClick = res => {
    //console.log(res.key);
    switch (res.key) {
      case '1':
        Router.push('/platform');
        break;
      case '2':
        Router.push('/business');
        break;
      case '3':
        Router.push('/problems');
        break;
      case '4':
        Router.push('/cooperative');
        break;
      case '5':
        Router.push('/classic');
        break;
      case '6':
        Router.push('/regulation');
        break;
    }
  };

  render() {
    return (
      <Menu
        mode="inline"
        onClick={this.onClick}
        openKeys={this.state.openKeys}
        onOpenChange={this.onOpenChange}
        style={{ width: 240 }}
      >
        <SubMenu
          key="sub1"
          title={
            <span>
              <MailOutlined />
              <span>个人资料</span>
            </span>
          }
        />
        <SubMenu
          key="sub2"
          title={
            <span>
              <MailOutlined />
              <span>日常安排</span>
            </span>
          }
        />
        <SubMenu
          key="sub3"
          title={
            <span>
              <MailOutlined />
              <span>我的动态</span>
            </span>
          }
        />
        <SubMenu
          key="sub4"
          title={
            <span>
              <MailOutlined />
              <span>我的文章</span>
            </span>
          }
        />
      </Menu>
    );
  }
}
