import React from 'react'
import { Result, Button } from 'antd';
import Router from 'next/router';

/**
 * 错误页面
 */
export default class Error extends React.Component {
  static getInitialProps({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    return { statusCode }
  }
  render() {
    return (
      <p>
        {this.props.statusCode
          ? <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={<Button type="primary" onClick={() => Router.replace('/')}>回到首页</Button>}
          />
          : 'An error occurred on client'}
      </p>
    )
  }
}
