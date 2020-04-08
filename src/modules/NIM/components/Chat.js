/*
 * @Descripttion:
 * @version:
 * @Author: 毛翔宇
 * @Date: 2020-03-06 16:48:06
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-04-04 19:17:45
 * @FilePath: \PC端-前端\src\modules\NIM\components\Chat.js
 */
import React, { createRef } from 'react';
import { connect } from 'react-redux';
import ChatList from './ChatList';
import ChatEditor from './ChatEditor';
import CaseInfo from './CaseInfo';
import { Layout, Popconfirm, Form, Input, message, Button } from 'antd';
const { Header, Footer, Content } = Layout;
import util from '../utils';
import page from '../utils/page';
import Link from 'next/link';
class Chat extends React.Component {
  state = {
    scene: null,
    to: null,
    userInfo: {},
    otherIsExpert: false,
    hasCaseInfo: false,
    canCaseInfoSave: false,
    hasEvaluation: false,
    icon1: `/im/ic_im_evaluate.svg`,
    icon2: `/im/ic_im_star.svg`,
    evaluation: {
      service: 3,
      professional: 3,
    },
    caseInfoShow: false,
    orderInfoShow: false,
  };

  // 表单
  formRef = createRef();

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
      let otherIsExpert = false;
      let hasCaseInfo = false;
      let canCaseInfoSave = false;
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
              otherIsExpert = true
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
                canCaseInfoSave = true
              }
            }
          }
        }
      }
      this.setState({
        scene,
        to,
        userInfo,
        otherIsExpert,
        hasCaseInfo,
        canCaseInfoSave,
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
  openOrder = () => {
    this.setState({
      orderInfoShow: !this.state.orderInfoShow
    })
  }
  saveOrder = async () => {
    const form = this.formRef.current;
    try {
      const values = await form.validateFields();
      this.setState({
        orderInfoShow: false
      })
      this.props.dispatch({
        type: 'chat/saveOrder',
        clientUserId: this.state.userInfo.userId,
        expertExplain: values.expertExplain,
        callback: (res) => {
          if (res.code === '0') {
            console.log(res.msg);
            message.success('已向平台发送订单生成请求，请等待平台工作人员与您联系')
          } else {
            // message.error(res.msg)
          }
        },
      })
    } catch (errorInfo) {
    }


  }
  render() {
    const { userInfo, otherIsExpert, hasCaseInfo, hasEvaluation, scene, to, icon1, icon2, evaluation, caseInfoShow, orderInfoShow, canCaseInfoSave } = this.state;
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
          canSave={canCaseInfoSave}
          collapsed={!caseInfoShow}
          userInfo={userInfo}
          myInfo={myInfo}
          toggleCaseInfo={this.toggleCaseInfo}
        />}
        <div className="chat-main">
          <div className='chat-title'>
            <div className='chat-expert'>
              <span className='expert-name'>
                {userInfo.name}
              </span>
              {hasEvaluation && <Popconfirm overlayClassName='chat-expert-evaluation-popover' placement="bottom" title={
                Evaluation} onConfirm={this.confirmEvaluation} okText="保存评分" icon={<i />}>
                <img className="expert-evaluate" src={icon1} alt="" />
              </Popconfirm>}
            </div>
            {otherIsExpert &&
              <Link href={`/professor?id=${userInfo.userId}`}>
                <span className='expert-info'> 专家信息 </span>
              </Link>}
            {canCaseInfoSave && <span className='expert-order' onClick={this.openOrder}>生成订单</span>}
            {hasCaseInfo && <span className='expert-case' onClick={this.toggleCaseInfo}>案件信息表</span>}
            {orderInfoShow && <Form name="orderForm" className="order-form" ref={this.formRef}>
              <Form.Item name="expertExplain" rules={[{ required: true, message: '请输入专家说明!' }]}>
                <Input maxLength='2000' onPressEnter={this.saveOrder} placeholder="请输入专家说明" addonAfter={<span className='save-order' onClick={this.saveOrder} >生成</span>} />
              </Form.Item>
            </Form>
            }
          </div>
          <ChatList
            type="session"
            msglist={currSessionMsgs}
            userInfo={userInfo}
            otherIsExpert={otherIsExpert}
            myInfo={myInfo}
            msgsLoaded={this.msgsLoaded}
          />
          <ChatEditor
            type="session"
            scene={scene}
            to={to}
          />
        </div>
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
