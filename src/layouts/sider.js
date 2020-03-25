import React from 'react';
import Router from 'next/router';
import { Menu } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { withRouter } from 'next/router';
import './sider.less';

const { SubMenu } = Menu;

const routerMap = {
  1: 'platform',
  2: 'business',
  3: 'problems',
  4: 'cooperative',
  5: 'classic',
  6: 'regulation',
};

class Sider extends React.Component {
  componentWillMount = () => {
    let activeKey;
    Object.entries(routerMap).find(([key, router]) => {
      if (this.props.router.pathname.match(router)) {
        activeKey = key;
        return true;
      }
    });

    let openKeys = [];
    if (activeKey <= 4) {
      openKeys.push('sub1');
    }
    if (activeKey > 4) {
      openKeys.push('sub2');
    }
    this.setState({
      activeKey,
      openKeys,
    });
  };
  // submenu keys of first level
  rootSubmenuKeys = ['sub1', 'sub2'];

  state = {
    openKeys: [],
    activeKey: null,
  };

  routerMap = routerMap;

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
    Router.push('/' + this.routerMap[res.key]);
  };

  render() {
    return (
      <Menu
        mode="inline"
        onClick={this.onClick}
        openKeys={this.state.openKeys}
        onOpenChange={this.onOpenChange}
        selectedKeys={[this.state.activeKey]}
        style={{ width: 240 }}
      >
        <SubMenu
          key="sub1"
          title={
            <span>
              <MailOutlined />
              <span>关于我们</span>
            </span>
          }
        >
          <Menu.Item key="1">平台介绍</Menu.Item>
          <Menu.Item key="2">业务介绍</Menu.Item>
          <Menu.Item key="3">常见问题</Menu.Item>
          <Menu.Item key="4">合作伙伴</Menu.Item>
        </SubMenu>
        <SubMenu
          key="sub2"
          title={
            <span>
              <AppstoreOutlined />
              <span>平台资讯</span>
            </span>
          }
        >
          <Menu.Item key="5">经典案例</Menu.Item>
          <Menu.Item key="6">条款规定</Menu.Item>
        </SubMenu>
      </Menu>
    );
  }
}

export default withRouter(Sider);
