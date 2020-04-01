import React from 'react';
import Router from 'next/router';
import { Menu } from 'antd';
import { withRouter } from 'next/router';
import './SiderExpert.less';

const routerMap = {
  1: 'expert/home',
  2: 'expert/schedule',
  3: 'expert/activity',
  4: 'expert/article',
};

class SiderExpert extends React.Component {
  constructor(props) {
    super(props);

    let activeKey;
    Object.entries(routerMap).find(([key, router]) => {
      if (this.props.router.pathname.match(router)) {
        activeKey = key;
        return true;
      }
    });

    let openKeys = [];
    // if (activeKey <= 4) {
    //   openKeys.push('sub1');
    // }
    // if (activeKey > 4) {
    //   openKeys.push('sub2');
    // }

    this.state = {
      openKeys,
      activeKey,
    };
  }

  // submenu keys of first level
  // rootSubmenuKeys = ['sub1', 'sub2'];

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
      <div className="sider-expert-component">
        <Menu
          mode="inline"
          onClick={this.onClick}
          openKeys={this.state.openKeys}
          // onOpenChange={this.onOpenChange}
          selectedKeys={[this.state.activeKey]}
          style={{ width: 240 }}
        >
          <Menu.Item key="1">个人资料</Menu.Item>
          <Menu.Item key="2">日程安排</Menu.Item>
          <Menu.Item key="3">我的动态</Menu.Item>
          <Menu.Item key="4">我的文章</Menu.Item>
        </Menu>
      </div>
    );
  }
}

export default withRouter(SiderExpert);
