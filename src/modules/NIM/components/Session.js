/*
 * @Descripttion:
 * @version:
 * @Author: 毛翔宇
 * @Date: 2020-03-06 16:48:06
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-04-02 09:36:59
 * @FilePath: \PC端-前端\src\modules\NIM\components\Session.js
 */
import React from 'react';
import { connect } from 'react-redux';
import { Layout, Menu } from 'antd';
import config from '../configs';

class Session extends React.Component {
  state = {
    delSessionId: null,
    stopBubble: false,
  };
  // 进入该页面，文档被挂载
  async componentDidMount() {
  }
  async componentDidUpdate(prevProps, prevState) {
  }
  // 离开该页面，此时重置当前会话
  async componentWillUnmount() {
    // this.props.dispatch({ type: 'chat/resetCurrSession' });
  }
  // computed
  // sysMsgUnread = () => {
  //   let temp = this.props.sysMsgUnread;
  //   let sysMsgUnread = temp.addFriend || 0;
  //   sysMsgUnread += temp.team || 0;
  //   let customSysMsgUnread = this.props.customSysMsgUnread;
  //   return sysMsgUnread + customSysMsgUnread;
  // };
  // methods
  enterSysMsgs = () => {
    location.href = '#/sysmsgs';
  };
  enterChat = ({ item, key, keyPath, domEvent }) => {
    // 此时设置当前会话
    let session = this.props.sessionlist[key]
    if (session && session.id) {
      this.props.dispatch({ type: 'chat/setCurrSession', sessionId: session.id });
    }
  };
  enterMyChat = () => {
    // 我的手机页面
    this.props.dispatch({ type: 'chat/setCurrSession', sessionId: `p2p-${this.myPhoneId}` });
  };
  initSession = () => {
    // 发起会话
    this.props.dispatch({ type: 'chat/initSession', expertAccid: `4633e46abbef4c83bae2a3ab2713d7de` });
  };
  render() {
    const { chat } = this.props;
    const { myInfo, userInfos, currSessionMsgs, sessionlist } = chat;
    return (
      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={['-1']}
      >
        {sessionlist.map((session, index) => (
          session.show &&
          <Menu.Item key={index} onClick={this.enterChat} className='nav-item' data-session={session.id}>
            <img className='nav-avatar' src={session.avatar} />
            <span className='nav-info' >
              <span className='nav-name' >
                {session.name}
              </span>
              <span className='nav-time' >
                {session.updateTimeShow}
              </span>
              <span className='nav-text' >
                {session.lastMsgShow}
              </span>
              {session.unread > 0 &&
                <span className='nav-unread' >
                  {session.unread}
                </span>
              }
            </span>
          </Menu.Item>
        ))}
        {/* <Menu.Item onClick={this.initSession} className='nav-item'>
          <span className='nav-info' >
            <span className='nav-name'>
              发起新会话
                </span>
          </span>
        </Menu.Item> */}
      </Menu>
    );
  }
}

// export default Chat;
export default connect(({ chat }) => ({
  chat,
  currSessionId: chat.currSessionId,
  userUID: chat.userUID,
  sessionlist: chat.sessionlist,
  myInfo: chat.myInfo,
  userInfos: chat.userInfos,
  robotInfos: chat.robotInfos,
  customSysMsgUnread: chat.customSysMsgUnread,
  sysMsgUnread: chat.sysMsgUnread,
  teamlist: chat.teamlist,
}))(Session);
