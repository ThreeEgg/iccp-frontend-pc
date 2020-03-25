import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getAuthorityToken } from '../common/authority';

export class AuthorityLayout extends Component {
  componentDidMount = () => {
    // 判断登录态
    if (getAuthorityToken()) {
      this.props.dispatch({
        type: 'user/getUserInfo',
      });
    }
  };

  render() {
    return <>{this.props.children}</>;
  }
}

export default connect(({}) => ({}))(AuthorityLayout);
