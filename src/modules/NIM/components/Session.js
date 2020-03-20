/*
 * @Descripttion:
 * @version:
 * @Author: 毛翔宇
 * @Date: 2020-03-06 16:48:06
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-03-20 17:49:15
 * @FilePath: \PC端-前端\src\modules\NIM\components\Session.js
 */
import React from 'react';
import { connect } from 'react-redux';
import util from '../utils';
import pageUtil from '../utils/page';
import { Layout, Menu } from 'antd';
import config from '../configs';

class Session extends React.Component {
  state = {
    delSessionId: null,
    stopBubble: false,
    noticeIcon: config.noticeIcon,
    myPhoneIcon: config.myPhoneIcon,
    myGroupIcon: config.defaultGroupIcon,
    myAdvancedIcon: config.defaultAdvancedIcon,
  };
  // 进入该页面，文档被挂载
  async componentDidMount() {
    this.props.dispatch({ type: 'chat/showLoading' });
    // 此时设置当前会话
    this.props.dispatch({ type: 'chat/setCurrSession', sessionId: this.sessionId() });
    pageUtil.scrollChatListDown();

    setTimeout(() => {
      this.props.dispatch({ type: 'chat/hideLoading' });
    }, 1000);

    // 获取群成员
    if (this.scene === 'team') {
      var teamMembers = this.props.state.teamMembers[this.to];
      if (teamMembers === undefined || teamMembers.length < this.teamInfo().memberNum) {
        this.props.dispatch({ type: 'chat/getTeamMembers', to: this.to });
      }
    }
  }
  async componentDidUpdate(prevProps, prevState) {
    pageUtil.scrollChatListDown();
  }
  // 离开该页面，此时重置当前会话
  async componentWillUnmount() {
    this.props.dispatch({ type: 'chat/resetCurrSession' });
  }
  static async getInitialProps(props) {
    return {};
  }
  // computed
  sysMsgUnread = () => {
    let temp = this.props.sysMsgUnread;
    let sysMsgUnread = temp.addFriend || 0;
    sysMsgUnread += temp.team || 0;
    let customSysMsgUnread = this.props.customSysMsgUnread;
    return sysMsgUnread + customSysMsgUnread;
  };
  sessionId = () => {
    return 'p2p-123' || this.props.match.match.params.sessionId;
  };
  myPhoneId = () => {
    return `${this.props.userUID}`;
  };
  sessionlist = () => {
    let sessionlist = this.props.sessionlist.filter(item => {
      item.name = '';
      item.avatar = '';
      if (item.scene === 'p2p') {
        let userInfo = null;
        if (item.to !== this.myPhoneId()) {
          userInfo = this.props.userInfos[item.to];
        } else {
          // userInfo = this.myInfo
          // userInfo.alias = '我的手机'
          // userInfo.avatar = `${config.myPhoneIcon}`
          return false;
        }
        if (userInfo) {
          item.name = util.getFriendAlias(userInfo);
          item.avatar = userInfo.avatar;
        }
      } else if (item.scene === 'team') {
        let teamInfo = null;
        teamInfo = this.props.teamlist.find(team => {
          return team.teamId === item.to;
        });
        if (teamInfo) {
          item.name = teamInfo.name;
          item.avatar =
            teamInfo.avatar ||
            (teamInfo.type === 'normal' ? this.myGroupIcon : this.myAdvancedIcon);
        } else {
          item.name = `群${item.to}`;
          item.avatar = item.avatar || this.myGroupIcon;
        }
      }
      let lastMsg = item.lastMsg || {};
      if (lastMsg.type === 'text') {
        item.lastMsgShow = lastMsg.text || '';
      } else if (lastMsg.type === 'custom') {
        item.lastMsgShow = util.parseCustomMsg(lastMsg);
      } else if (lastMsg.scene === 'team' && lastMsg.type === 'notification') {
        item.lastMsgShow = util.generateTeamSysmMsg(lastMsg);
      } else if (util.mapMsgType(lastMsg)) {
        item.lastMsgShow = `[${util.mapMsgType(lastMsg)}]`;
      } else {
        item.lastMsgShow = '';
      }
      if (item.updateTime) {
        item.updateTimeShow = util.formatDate(item.updateTime, true);
      }
      return item;
    });
    return sessionlist;
  };
  // methods
  enterSysMsgs = () => {
    location.href = '#/sysmsgs';
  };
  enterChat = session => {
    if (session && session.id) location.href = `#/chat/${session.id}`;
  };
  enterMyChat = () => {
    // 我的手机页面
    location.href = `#/chat/p2p-${this.myPhoneId}`;
  };
  render() {
    const { chat, sessionlist } = this.props;
    const { myInfo, userInfos, currSessionMsgs } = chat;
    return (
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
        <Menu.Item key="1">
          <span className="nav-text">消息中心</span>
        </Menu.Item>
        <Menu.Item key="2">
          <span className="nav-text">我的手机</span>
        </Menu.Item>
        {sessionlist.map((session, index) => {
          return (
            <Menu.Item key={index + 3} sessionId={session.id} inlineDesc={session.lastMsgShow}>
              <span className="nav-text" onClick={this.enterChat(session)}>
                {session.name}
              </span>
            </Menu.Item>
          );
        })}
      </Menu>
    );
  }
}

// export default Chat;
export default connect(({ chat }) => ({
  chat: chat,
  userUID: chat.userUID,
  sessionlist: chat.sessionlist,
  myInfo: chat.myInfo,
  userInfos: chat.userInfos,
  robotInfos: chat.robotInfos,
  customSysMsgUnread: chat.customSysMsgUnread,
  sysMsgUnread: chat.sysMsgUnread,
  teamlist: chat.teamlist,
}))(Session);
