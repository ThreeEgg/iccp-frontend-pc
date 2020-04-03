/*
 * @Descripttion:
 * @version:
 * @Author: 毛翔宇
 * @Date: 2020-03-06 16:48:06
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-04-03 18:29:14
 * @FilePath: \PC端-前端\src\modules\NIM\components\Chat.js
 */
import React from 'react';
import { connect } from 'react-redux';
import ChatList from './ChatList';
import ChatEditor from './ChatEditor';
import CaseInfo from './CaseInfo';
import { Layout, Popconfirm, message } from 'antd';
const { Header, Footer, Content } = Layout;
import util from '../utils';
import page from '../utils/page';
class Chat extends React.Component {
  state = {
    scene: null,
    to: null,
    userInfo: {},
    isExpert: false,
    hasCaseInfo: false,
    hasEvaluation: false,
    icon1: `/im/ic_im_evaluate.svg`,
    icon2: `/im/ic_im_star.svg`,
    evaluation: {
      service: 3,
      professional: 3,
    },
    caseInfoShow: false,
  };
  // 进入该页面，文档被挂载
  async componentDidMount() {
    this.initSession()
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
  sessionName = () => {

  };
  // methods
  initSession = () => {
    if (this.props.currSessionId) {
      let scene = util.parseSession(this.props.currSessionId).scene
      let to = util.parseSession(this.props.currSessionId).to
      let sessionId = this.props.currSessionId;
      let userInfo = {};
      let isExpert = false;
      let hasCaseInfo = false;
      let hasEvaluation = false;
      let user = null;
      let evaluation = {}
      if (/^p2p-/.test(sessionId)) {
        user = sessionId.replace(/^p2p-/, '');
        if (user === this.props.userUID) {
          userInfo.accid = user
          userInfo.name = '我的手机'
          userInfo.image = ''
        } else {
          if (user === this.props.serviceInfo.accid) {
            userInfo = this.props.serviceInfo
          } else {
            userInfo = this.props.iccpUserInfos[user];
            if (userInfo.userType === 'expert') {
              isExpert = true
              if (this.props.myInfo.type === 'user' || this.props.myInfo.type === 'guest') {
                hasEvaluation = true
                hasCaseInfo = true
                // 获取专家评价
                this.props.dispatch({
                  type: 'chat/getExpertUserRating', expertUserId: userInfo.userId,
                  callback: (res) => {
                    if (res.code === '0') {
                      evaluation.service = res.data.attitudeRating
                      evaluation.professional = res.data.skillRating
                    } else {
                      message.error(res.msg)
                    }
                  },
                })
              }
            }
            else if (userInfo.userType === 'user' || userInfo.userType === 'guest') {
              if (this.props.myInfo.type === 'expert') {
                hasCaseInfo = true
              }
            }
          }
        }
      }
      this.setState({
        scene,
        to,
        userInfo,
        isExpert,
        hasCaseInfo,
        hasEvaluation,
      })
    }
  };
  onClickBack = () => {
    // location.href = '#/contacts'
    window.stopPlayAudio && window.stopPlayAudio();
    window.history.go(-1);
  };
  msgsLoaded = () => {
    page.scrollChatListDown();
  };

  confirmEvaluation = () => {
    // 获取专家评价
    this.props.dispatch({
      type: 'chat/saveExpertUserRating',
      expertUserId: this.state.userInfo.userId,
      attitudeRating: this.state.evaluation.service,
      skillRating: this.state.evaluation.professional,
      callback: (res) => {
        if (res.code === '0') {
          message.success(res.msg)
        } else {
          message.error(res.msg)
        }
      },
    })
  }

  evaluate = (item, data) => {
    let temp = { ...this.state.evaluation }
    temp[data] = item + 1;
    this.setState({
      evaluation: temp,
    })
  }
  toggleCaseInfo = () => {
    this.setState({
      caseInfoShow: !this.state.caseInfoShow
    })
  }
  saveOrder = () => {
    this.props.dispatch({
      type: 'chat/saveOrder',
      clientUserId: this.props.myInfo.userId,
      expertExplain:'',
      callback: (res) => {
        if (res.code === '0') {
          message.success(res.msg)
        } else {
          message.error(res.msg)
        }
      },
    })
  }
  render() {
    const { userInfo, isExpert, hasCaseInfo, hasEvaluation, scene, to, icon1, icon2, evaluation, caseInfoShow } = this.state;
    const { chat, user } = this.props;
    const { userInfo: myInfo } = user;
    const { currSessionMsgs, } = chat;
    let Evaluation = (
      <div className='evaluate-box'>
        <div className='evaluate-title'>服务评价</div>
        <div className='evaluate-content'>
          <span>服务态度</span>
          {[0, 1, 2].map(item => (
            <img key={item} className={`evaluate-star ${evaluation.service > item ? '' : 'gray'}`} src={icon2} alt="" onClick={this.evaluate.bind(this, item, 'service')} />
          ))}
        </div>
        <div className='evaluate-content'>
          <span>专业能力</span>
          {[0, 1, 2].map(item => (
            <img key={item} className={`evaluate-star ${evaluation.professional > item ? '' : 'gray'}`} src={icon2} alt="" onClick={this.evaluate.bind(this, item, 'professional')} />
          ))}
        </div>
      </div>
    );
    return (
      <div className="chat-box">
        {hasCaseInfo && <CaseInfo
          collapsed={!caseInfoShow}
          userInfo={userInfo}
          myInfo={myInfo}
          toggleCaseInfo={this.toggleCaseInfo}
        />}
        <div className='chat-title'>
          <div className='chat-expert'>
            <span className='expert-name'>
              {userInfo.name}
            </span>
            {hasEvaluation && <Popconfirm placement="bottom" title={
              Evaluation} onConfirm={this.confirmEvaluation} okText="保存评分" icon={<i />}>
              <img className="expert-evaluate" src={icon1} alt="" />
            </Popconfirm>}
          </div>
          {isExpert && <span className='expert-info'>
            专家信息
          </span>}
          {hasCaseInfo &&
            <span className='expert-order' onClick={this.saveOrder}>生成订单</span>}
          {hasCaseInfo &&
            <span className='expert-case' onClick={this.toggleCaseInfo}>案件信息表</span>}
        </div>
        <ChatList
          type="session"
          msglist={currSessionMsgs}
          userInfo={userInfo}
          isExpert={isExpert}
          myInfo={myInfo}
          msgsLoaded={this.msgsLoaded}
        />
        <ChatEditor
          type="session"
          scene={scene}
          to={to}
        />
      </div>
    );
  }
}

// export default Chat;
export default connect(({ chat, user }) => ({
  chat,
  user,
  currSessionId: chat.currSessionId,
  userUID: chat.userUID,
  sessionId: chat.sessionId,
  myInfo: user.userInfo,
  serviceInfo: chat.serviceInfo,
  iccpUserInfos: chat.iccpUserInfos,
  currSessionMsgs: chat.currSessionMsgs,
}))(Chat);
