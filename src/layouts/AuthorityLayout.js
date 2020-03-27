import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getAuthorityToken } from '../common/authority';

export class AuthorityLayout extends Component {
  componentDidMount = () => {
    if (this.props.initAuthority) {
      return;
    }

    // 判断本地登录态
    if (getAuthorityToken()) {
      // 同步取出本地的用户、im信息
      this.props.dispatch({
        type: 'user/save',
        payload: {
          userInfo: localStorage.userInfo ? JSON.parse(localStorage.userInfo) : {},
          imInfo: localStorage.imInfo ? JSON.parse(localStorage.imInfo) : {},
          isLogin: localStorage.isLogin > 0,
        },
      });

      // 异步查询用户信息
      this.props.dispatch({
        type: 'user/getUserInfo',
      });
    }
  };

  render() {
    return <>{this.props.children}</>;
  }
}

export default connect(({ user }) => ({
  initAuthority: user.initAuthority,
}))(AuthorityLayout);
