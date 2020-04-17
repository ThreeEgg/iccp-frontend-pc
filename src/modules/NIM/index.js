/*
 * @Descripttion:
 * @version:
 * @Author: 毛翔宇
 * @Date: 2020-03-06 16:48:06
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-04-02 18:34:13
 * @FilePath: \PC端-前端\src\modules\NIM\index.js
 */
import React from 'react';
import { connect } from 'react-redux';
import Chat from './components/Chat';
import Session from './components/Session';
import Login from './components/Login';
import { Layout, Button } from 'antd';
const { Sider } = Layout;

import './index.less';

class Index extends React.Component {
  state = {
  };
  // 进入该页面，文档被挂载
  async componentDidMount() {
    if (!global.dispatch) {
      global.dispatch = this.props.dispatch;
    }
    // 提交sdk连接请求
    if (!this.props.isLogin) {
      this.props.dispatch({ type: 'im/connect' });
    }
  }
  async componentDidUpdate(prevProps, prevState) {
    // this.props.dispatch({ type: 'im/updateRefreshState' })
  }
  // 离开该页面，此时重置当前会话
  async componentWillUnmount() {
  }
  // computed
  // methods
  render() {
    const { currSessionId } = this.props;
    return (
      <Layout style={{ height: '100%' }} className='nim'>
        <Sider
          theme='light'
          width='280'
          style={{
            overflow: 'auto',
            height: '100%',
          }}
        >
          <Session />
          {/* <Login /> */}
        </Sider>
        {currSessionId && <Chat />}
      </Layout>
    );
  }
}

export default connect(({ im }) => ({
  isLogin: im.isLogin,
  currSessionId: im.currSessionId,
}))(Index);
