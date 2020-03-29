/*
 * @Descripttion:
 * @version:
 * @Author: 毛翔宇
 * @Date: 2020-03-06 16:48:06
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-03-29 18:18:05
 * @FilePath: \PC端-前端\src\modules\NIM\components\Chat.js
 */
import React from 'react';
import { connect } from 'react-redux';
import ChatList from './ChatList';
import ChatEditor from './ChatEditor';
import { Layout } from 'antd';
const { Header, Footer, Content } = Layout;
import util from '../utils';
import page from '../utils/page';

class Chat extends React.Component {
  state = {
    sessionName: '',
    scene: null,
    to: null,
    userInfo: null,
    teamInfo: null,
    teamInvalid: false,
    muteInTeam: false,
    sendInvalidHint: '',
  };
  // 进入该页面，文档被挂载
  async componentDidMount() {

  }
  async componentDidUpdate(prevProps, prevState) {
    // 监听会话改变
    if (prevProps.currSessionId !== this.props.currSessionId) {
      this.initSession()
    }
  }
  // 离开该页面，此时重置当前会话
  async componentWillUnmount() {
    this.props.dispatch({ type: 'chat/resetCurrSession' });
  }
  // computed
  sessionName = (teamInfo) => {
    let sessionId = this.props.currSessionId;
    let user = null;
    if (/^p2p-/.test(sessionId)) {
      user = sessionId.replace(/^p2p-/, '');
      if (user === this.props.userUID) {
        return '我的手机';
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
  muteInTeam = (teamInfo) => {
    var teamMembers = this.props.teamMembers;
    var Members = teamMembers && teamMembers[teamInfo.teamId];
    var selfInTeam =
      Members &&
      Members.find(item => {
        return item.account === this.props.userUID;
      });
    return (selfInTeam && selfInTeam.mute) || false;
  };
  sendInvalidHint = (scene, teamInvalid, teamInfo, muteInTeam) => {
    if (scene === 'team' && teamInvalid) {
      return `您已不在该${
        teamInfo && teamInfo.type === 'normal' ? '讨论组' : '群'
        }，不能发送消息`;
    } else if (muteInTeam) {
      return '您已被禁言';
    }
    return '无权限发送消息';
  };
  // methods
  initSession = () => {
    if (this.props.currSessionId) {
      let scene = util.parseSession(this.props.currSessionId).scene
      let to = util.parseSession(this.props.currSessionId).to
      console.log(scene);
      console.log(to);
      let teamInfo = this.state.teamInfo
      let teamInvalid = this.state.teamInvalid
      let muteInTeam = this.state.muteInTeam
      if (scene === 'team') {
        var teamId = this.props.currSessionId.replace('team-', '');
        teamInfo = this.props.teamlist.find(team => {
          return team.teamId === teamId;
        });
        // 获取群成员
        var teamMembers = this.props.teamMembers[to];
        if (teamMembers === undefined || teamMembers.length < teamInfo.memberNum) {
          this.props.dispatch({ type: 'chat/getTeamMembers', to });
        }
        teamInvalid = !(teamInfo && teamInfo.validToCurrentUser)
        muteInTeam = this.muteInTeam(teamInfo);
      }
      let sessionName = this.sessionName(teamInfo);
      let sendInvalidHint = this.sessionName(scene, teamInvalid, teamInfo, muteInTeam);
      this.setState({
        scene,
        to,
        teamInfo,
        sessionName,
        teamInvalid,
        muteInTeam,
        sendInvalidHint,
      })
    }
  };
  onClickCase = () => {
  };
  onClickBack = () => {
    // location.href = '#/contacts'
    window.stopPlayAudio && window.stopPlayAudio();
    window.history.go(-1);
  };
  msgsLoaded = () => {
    page.scrollChatListDown();
  };
  enterNameCard = () => {
    if (/^p2p-/.test(this.props.currSessionId)) {
      let account = this.props.currSessionId.replace(/^p2p-/, '');
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
    if (this.state.scene !== 'team' || (this.teamInfo() && this.teamInfo().validToCurrentUser)) {
      location.href = `#/chathistory/${this.props.currSessionId}`;
    } else {
      this.$toast('您已退出该群');
    }
  };
  render() {
    const { teamInfo, scene, to, teamInvalid, muteInTeam, sendInvalidHint, sessionName } = this.state;
    const { chat } = this.props;
    const { myInfo, userInfos, currSessionMsgs } = chat;
    return (
      <div className="chat-box">
        <div className='chat-title'>
          <div className='chat-expert'>
            <span className='expert-name'>
              {sessionName}
            </span>
            <span className="expert-like" />
            {/* <img className="expert-like" src='/public/im/ic_im_evaluate.svg' alt="" /> */}
          </div>
          <span className='expert-info'>
            专家信息
          </span>
          <span className='expert-case' onClick={this.onClickCase}>案件信息表</span>
        </div>
        <ChatList
          type="session"
          msglist={currSessionMsgs}
          userInfos={userInfos}
          myInfo={myInfo}
          msgsLoaded={this.msgsLoaded}
        />
        <ChatEditor
          type="session"
          scene={scene}
          to={to}
          invalid={teamInvalid || muteInTeam}
          invalidHint={sendInvalidHint}
          advancedTeam={teamInfo && teamInfo.type === 'advanced'}
        />
      </div>
    );
  }
}

// export default Chat;
export default connect(({ chat }) => ({
  chat,
  currSessionId: chat.currSessionId,
  userUID: chat.userUID,
  sessionId: chat.sessionId,
  teamMembers: chat.teamMembers,
  myInfo: chat.myInfo,
  userInfos: chat.userInfos,
  currSessionMsgs: chat.currSessionMsgs,
  teamlist: chat.teamlist,
}))(Chat);
