/*
 * @Descripttion:
 * @version:
 * @Author: 毛翔宇
 * @Date: 2020-03-06 16:48:06
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-03-20 18:03:07
 * @FilePath: \PC端-前端\src\modules\NIM\components\Chat.js
 */
import React from 'react';
import { connect } from 'react-redux';
import ChatList from './ChatList';
import ChatEditor from './ChatEditor';
import { Layout } from 'antd';

import util from '../utils';
import pageUtil from '../utils/page';
function InvalidHint(props) {
  const { teamInfo, scene, teamInvalid } = props;
  if (scene === 'team' && teamInvalid) {
    const name = teamInfo && teamInfo.type === 'normal' ? '讨论组' : '群';
    return "<div class='invalidHint'>您已退出该" + name + '</div>';
  }
  return '';
}
class Chat extends React.Component {
  // 进入该页面，文档被挂载
  async componentDidMount() {
    // 此时设置当前会话
    this.props.dispatch({ type: 'chat/setCurrSession', sessionId: this.sessionId() });
    pageUtil.scrollChatListDown();

    // 获取群成员
    if (this.scene === 'team') {
      var teamMembers = this.props.teamMembers[this.to];
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
  sessionId = () => {
    return 'p2p-123' || this.props.match.match.params.sessionId;
  };
  sessionName = () => {
    let sessionId = this.sessionId();
    let teamInfo = this.teamInfo();
    let user = null;
    if (/^p2p-/.test(sessionId)) {
      user = sessionId.replace(/^p2p-/, '');
      if (user === this.props.userUID) {
        return '我的手机';
      } else if (this.isRobot()) {
        return this.props.robotInfos[user].nick;
      } else {
        let userInfo = this.props.userInfos[user] || {};
        return util.getFriendAlias(userInfo);
      }
    } else if (/^team-/.test(sessionId)) {
      if (teamInfo) {
        // teamInfo中的人数为初始获取的值，在人员增减后不会及时更新，而teamMembers在人员增减后同步维护的人员信息
        var members = this.props.teamMembers && this.props.teamMembers[teamInfo.teamId];
        var memberCount = members && members.length;
        return teamInfo.name + (memberCount ? `(${memberCount})` : '');
      } else {
        return '群';
      }
    }
  };
  scene = () => {
    return util.parseSession(this.sessionId()).scene;
  };
  to = () => {
    return util.parseSession(this.sessionId()).to;
  };
  // 判断是否是机器人
  isRobot = () => {
    let sessionId = this.sessionId();
    let user = null;
    if (/^p2p-/.test(sessionId)) {
      user = sessionId.replace(/^p2p-/, '');
      if (this.props.robotInfos[user]) {
        return true;
      }
    }
    return false;
  };
  msglist = () => {
    let msgs = this.props.currSessionMsgs;
    return msgs;
  };
  teamInfo = () => {
    if (this.scene === 'team') {
      var teamId = this.sessionId().replace('team-', '');
      return this.props.teamlist.find(team => {
        return team.teamId === teamId;
      });
    }
    return undefined;
  };
  muteInTeam = () => {
    if (this.scene !== 'team') return false;
    var teamMembers = this.props.teamMembers;
    var Members = teamMembers && teamMembers[this.teamInfo().teamId];
    var selfInTeam =
      Members &&
      Members.find(item => {
        return item.account === this.props.userUID;
      });
    return (selfInTeam && selfInTeam.mute) || false;
  };
  teamInvalid = () => {
    if (this.scene === 'team') {
      return !(this.teamInfo() && this.teamInfo().validToCurrentUser);
    }
    return false;
  };
  sendInvalidHint = () => {
    if (this.scene === 'team' && this.teamInvalid()) {
      return `您已不在该${
        this.teamInfo() && this.teamInfo().type === 'normal' ? '讨论组' : '群'
      }，不能发送消息`;
    } else if (this.muteInTeam()) {
      return '您已被禁言';
    }
    return '无权限发送消息';
  };
  // methods
  onClickBack = () => {
    // location.href = '#/contacts'
    window.stopPlayAudio && window.stopPlayAudio();
    window.history.go(-1);
  };
  msgsLoaded = () => {
    pageUtil.scrollChatListDown();
  };
  enterNameCard = () => {
    if (/^p2p-/.test(this.sessionId())) {
      let account = this.sessionId().replace(/^p2p-/, '');
      if (account === this.props.userUID) {
        location.href = `#/general`;
        return;
      }
      location.href = `#/namecard/${account}`;
    }
  };
  onTeamManageClick = () => {
    if (this.teamInfo() && this.teamInfo().validToCurrentUser) {
      location.href = `#/teammanage/${this.teamInfo().teamId}`;
    } else {
      this.$toast('您已退出该群');
    }
  };
  onHistoryClick = () => {
    if (this.scene !== 'team' || (this.teamInfo() && this.teamInfo().validToCurrentUser)) {
      location.href = `#/chathistory/${this.sessionId()}`;
    } else {
      this.$toast('您已退出该群');
    }
  };
  render() {
    const { chat } = this.props;
    const { myInfo, userInfos, currSessionMsgs } = chat;
    return (
        <Layout className="site-layout" style={{ marginLeft: 200 }}>
          <InvalidHint
            teamInfo={this.teamInfo()}
            scene={this.scene()}
            teamInvalid={this.teamInvalid()}
          />
          <ChatList
            type="session"
            msglist={currSessionMsgs}
            userInfos={userInfos}
            myInfo={myInfo}
            isRobot={this.isRobot()}
            msgsLoaded={this.msgsLoaded()}
          />
          <ChatEditor
            type="session"
            scene={this.scene()}
            to={this.to()}
            isRobot={this.isRobot()}
            invalid={this.teamInvalid() || this.muteInTeam()}
            invalidHint={this.sendInvalidHint()}
            advancedTeam={this.teamInfo() && this.teamInfo().type === 'advanced'}
          />
        </Layout>
    );
  }
}

// export default Chat;
export default connect(({ chat }) => ({
  chat: chat,
  userUID: chat.userUID,
  teamMembers: chat.teamMembers,
  myInfo: chat.myInfo,
  userInfos: chat.userInfos,
  robotInfos: chat.robotInfos,
  currSessionMsgs: chat.currSessionMsgs,
  teamlist: chat.teamlist,
}))(Chat);
