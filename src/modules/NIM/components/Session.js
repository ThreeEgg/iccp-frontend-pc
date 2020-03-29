/*
 * @Descripttion:
 * @version:
 * @Author: 毛翔宇
 * @Date: 2020-03-06 16:48:06
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-03-29 15:31:40
 * @FilePath: \PC端-前端\src\modules\NIM\components\Session.js
 */
import React from 'react';
import { connect } from 'react-redux';
import util from '../utils';
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
    sessionlist: [],
  };
  // 进入该页面，文档被挂载
  async componentDidMount() {
    this.computedSessionlist()
  }
  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.sessionlist !== this.props.sessionlist) {
      this.computedSessionlist()
    }
  }
  // 离开该页面，此时重置当前会话
  async componentWillUnmount() {
    // this.props.dispatch({ type: 'chat/resetCurrSession' });
  }
  // computed
  sysMsgUnread = () => {
    let temp = this.props.sysMsgUnread;
    let sysMsgUnread = temp.addFriend || 0;
    sysMsgUnread += temp.team || 0;
    let customSysMsgUnread = this.props.customSysMsgUnread;
    return sysMsgUnread + customSysMsgUnread;
  };
  myPhoneId = () => {
    return `${this.props.userUID}`;
  };
  computedSessionlist = () => {
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
        // 去掉群聊
        return
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
    this.setState({
      sessionlist,
    }, () => {
      if (!this.props.currSessionId) {
        this.props.dispatch({ type: 'chat/setCurrSession', sessionId: `p2p-${this.myPhoneId()}` });
      }
    })
  };
  // methods
  enterSysMsgs = () => {
    location.href = '#/sysmsgs';
  };
  enterChat = ({ item, key, keyPath, domEvent }) => {
    // 此时设置当前会话
    let session = this.state.sessionlist[key]
    if (session && session.id) {
      this.props.dispatch({ type: 'chat/setCurrSession', sessionId: session.id });
    }
  };
  enterMyChat = () => {
    // 我的手机页面
    this.props.dispatch({ type: 'chat/setCurrSession', sessionId: `p2p-${this.myPhoneId}` });
  };
  render() {
    const { chat } = this.props;
    const { myInfo, userInfos, currSessionMsgs } = chat;
    return (
      <Menu 
      theme="light" 
      mode="inline" 
      defaultSelectedKeys={['-1']}
      >
        {this.state.sessionlist.map((session, index) => (
          <Menu.Item key={index} onClick={this.enterChat} className='nav-item' data-session={session.id}>
            {/* Id={} inlineDesc={session.lastMsgShow} */}
            <img className='nav-avatar' src={session.avatar} />
            <div className='nav-info' >
              <span className='nav-name' >
                {session.name}
              </span>
              <span className='nav-time' >
                {session.updateTimeShow}
              </span>
              <div className='nav-text' >
                {session.lastMsgShow}
              </div>
            </div>
          </Menu.Item>
        ))}
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
