/*
 * @Descripttion:
 * @version:
 * @Author: 毛翔宇
 * @Date: 2020-03-06 16:48:06
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-03-26 11:19:01
 * @FilePath: \PC端-前端\src\modules\NIM\index.js
 */
import React from 'react';
import { connect } from 'react-redux';
import Chat from './components/Chat';
import Session from './components/Session';
import Login from './components/Login';
import { Layout } from 'antd';
const { Sider } = Layout;

import './index.less';
function InvalidHint(props) {
  const { teamInfo, scene, teamInvalid } = props;
  if (scene === 'team' && teamInvalid) {
    const name = teamInfo && teamInfo.type === 'normal' ? '讨论组' : '群';
    return "<div class='invalidHint'>您已退出该" + name + '</div>';
  }
  return '';
}
class Index extends React.Component {
  state = {
  };
  // 进入该页面，文档被挂载
  async componentDidMount() {
    // 提交sdk连接请求
    // this.props.dispatch({ type: 'chat/connect' })
    if(!window.dispatch){
      window.dispatch = this.props.dispatch;
    }
  }
  async componentDidUpdate(prevProps, prevState) {
    // this.props.dispatch({ type: 'chat/updateRefreshState' })
  }
  // 离开该页面，此时重置当前会话
  async componentWillUnmount() {
  }
  // computed
  // methods
  render() {
    const { chat } = this.props;
    const { myInfo, userInfos, currSessionMsgs } = chat;
    return (
      <Layout>
        <Sider
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
          }}
        >
          <Login />
          <Session />
        </Sider>
        <Chat/>
      </Layout>
    );
  }
}

export default connect(({ chat }) => ({
  chat,
  userUID: chat.userUID,
  teamMembers: chat.teamMembers,
  myInfo: chat.myInfo,
  userInfos: chat.userInfos,
  robotInfos: chat.robotInfos,
  currSessionMsgs: chat.currSessionMsgs,
  teamlist: chat.teamlist,
}))(Index);
