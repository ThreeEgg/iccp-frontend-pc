import React, { createRef } from 'react';
import { connect } from 'react-redux';
import util from 'iccp-frontend-im/dist/utils';
import Link from 'next/link';
import { Popconfirm, Form, Input, message, Button } from 'antd';
import * as expertService from '@/services/expert';
import ChatList from './ChatList';
import ChatEditor from './ChatEditor';
import CaseInfo from './CaseInfo';
import { getResponseRateAverage } from '@/common/index';

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
    expertInfo: {},
  };

  // 表单
  formRef = createRef();

  // 进入该页面，文档被挂载
  async componentDidMount() {
    this.initSession();
    this.setMsgTranslateMap();
  }
  async componentDidUpdate(prevProps, prevState) {
    // 监听会话改变
    if (prevProps.currSessionId !== this.props.currSessionId) {
      this.initSession();
      this.setMsgTranslateMap();
    }
    // 监听会话对象改变
    if (prevProps.translateMap !== this.props.translateMap) {
      this.setMsgTranslateMap();
    }
  }
  // 离开该页面，此时重置当前会话
  async componentWillUnmount() {
    // this.props.dispatch({ type: 'im/resetCurrSession' });
  }
  // computed
  setMsgTranslateMap = () => {
    const { translateMap, currSessionId } = this.props;
    this.setState({
      msgTranslateMap: translateMap[currSessionId],
    });
  };
  // methods
  initSession = () => {
    const { currSessionId, serviceInfo } = this.props;
    if (currSessionId) {
      const { scene, to } = util.parseSession(currSessionId);
      let userInfo = {};
      let otherIsExpert = false;
      let hasCaseInfo = false;
      let canCaseInfoSave = false;
      let hasEvaluation = false;
      let user = null;
      const evaluation = {};
      if (/^p2p-/.test(currSessionId)) {
        user = currSessionId.replace(/^p2p-/, '');
        if (user === this.props.userUID) {
          userInfo.accid = user;
          userInfo.name = '我的手机';
          userInfo.image = '';
        } else if (serviceInfo && user === serviceInfo.accid) {
          userInfo = serviceInfo;
        } else {
          userInfo = this.props.iccpUserInfos[user];
          if (userInfo.userType === 'expert') {
            otherIsExpert = true;
            if (this.props.myInfo.type === 'user' || this.props.myInfo.type === 'guest') {
              hasEvaluation = true;
              hasCaseInfo = true;
              // 获取专家评价
              this.props.dispatch({
                type: 'im/getExpertUserRating',
                expertUserId: userInfo.userId,
                callback: (res) => {
                  if (res.code === '0') {
                    evaluation.service = res.data.attitudeRating;
                    evaluation.professional = res.data.skillRating;
                  } else {
                    message.error(res.msg);
                  }
                },
              });

              // FIXME: 2020/04/26 此处应该统一到状态机中，获取专家信息
              this.getExpertInfo(userInfo.userId);
            }
          } else if (userInfo.userType === 'user' || userInfo.userType === 'guest') {
            if (this.props.myInfo.type === 'expert') {
              hasCaseInfo = true;
              canCaseInfoSave = true;
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
        evaluation,
      });
    }
  };

  getExpertInfo = async (expertId) => {
    const expertInfoRes = await expertService.getExpertHomePage({ userId: expertId });

    if (expertInfoRes.code === '0') {
      this.setState({
        expertInfo: expertInfoRes.data,
      });
    }
  };

  onClickBack = () => {
    // location.href = '#/contacts'
    window.stopPlayAudio && window.stopPlayAudio();
    window.history.go(-1);
  };
  msgsLoaded = () => {};

  confirmEvaluation = () => {
    // 获取专家评价
    this.props.dispatch({
      type: 'im/saveExpertUserRating',
      expertUserId: this.state.userInfo.userId,
      attitudeRating: this.state.evaluation.service,
      skillRating: this.state.evaluation.professional,
      callback: (res) => {
        if (res.code === '0') {
          message.success(res.msg);
        } else {
          message.error(res.msg);
        }
      },
    });
  };

  evaluate = (item, data) => {
    const { evaluation } = this.state;
    evaluation[data] = item + 1;
    this.setState({
      evaluation,
    });
  };

  toggleCaseInfo = () => {
    const { caseInfoShow } = this.state;
    this.setState({
      caseInfoShow: !caseInfoShow,
    });
  };

  toggleOrder = () => {
    const { orderInfoShow } = this.state;
    this.setState({
      orderInfoShow: !orderInfoShow,
    });
  };

  saveOrder = async () => {
    const form = this.formRef.current;
    try {
      const values = await form.validateFields();
      this.setState({
        orderInfoShow: false,
      });
      this.props.dispatch({
        type: 'im/saveOrder',
        clientUserId: this.state.userInfo.userId,
        expertExplain: values.expertExplain,
        callback: (res) => {
          if (res.code === '0') {
            message.success('已向平台发送订单生成请求，请等待平台工作人员与您联系');
          } else {
            // message.error(res.msg)
          }
        },
      });
    } catch (errorInfo) {
      console.error(errorInfo);
    }
  };
  render() {
    const {
      userInfo,
      otherIsExpert,
      hasCaseInfo,
      hasEvaluation,
      scene,
      to,
      icon1,
      icon2,
      evaluation,
      caseInfoShow,
      orderInfoShow,
      canCaseInfoSave,
      msgTranslateMap,
      expertInfo,
    } = this.state;
    const { myInfo } = this.props;
    const Evaluation = (
      <div className="evaluate-box">
        <div className="evaluate-title">服务评价</div>
        <div className="evaluate-content">
          <span>服务态度</span>
          {[0, 1, 2].map((item) => (
            <img
              key={item}
              className={`evaluate-star ${evaluation.service > item ? '' : 'gray'}`}
              src={icon2}
              alt=""
              onClick={this.evaluate.bind(this, item, 'service')}
            />
          ))}
        </div>
        <div className="evaluate-content">
          <span>专业能力</span>
          {[0, 1, 2].map((item) => (
            <img
              key={item}
              className={`evaluate-star ${evaluation.professional > item ? '' : 'gray'}`}
              src={icon2}
              alt=""
              onClick={this.evaluate.bind(this, item, 'professional')}
            />
          ))}
        </div>
      </div>
    );

    let averageRate = 0;
    if (otherIsExpert) {
      const { attitudeRateAVG, skillRateAVG, responseSpeed } = expertInfo;
      let responseRateAVG = getResponseRateAverage(responseSpeed);
      averageRate = (attitudeRateAVG + skillRateAVG + responseRateAVG) / 3;
    }

    return (
      <div className="chat-box">
        {hasCaseInfo && (
          <CaseInfo
            canSave={canCaseInfoSave}
            collapsed={!caseInfoShow}
            userInfo={userInfo}
            myInfo={myInfo}
            toggleCaseInfo={this.toggleCaseInfo}
          />
        )}
        <div className="chat-main">
          <div className="chat-title">
            <div className="chat-expert flex flex-alignCenter">
              <div className="expert-name flex flex-column">
                <Link href={`/professor?id=${userInfo.userId}`}>
                  <a>{userInfo.name}</a>
                </Link>
                {otherIsExpert && (
                  <div className="expert-info flex flex-alignCenter">
                    <span>综合评分</span>
                    &nbsp;
                    {[0, 1, 2].map((item) => (
                      <img
                        key={item}
                        className={`evaluate-star ${averageRate >= item ? '' : 'gray'}`}
                        src={icon2}
                        alt=""
                      />
                    ))}
                  </div>
                )}
              </div>
              {hasEvaluation && (
                <Popconfirm
                  overlayClassName="chat-expert-evaluation-popover"
                  placement="bottom"
                  title={Evaluation}
                  onConfirm={this.confirmEvaluation}
                  okText="保存评分"
                  icon={<i />}
                >
                  <Button type="primary" size="small">
                    去评价
                  </Button>
                </Popconfirm>
              )}
            </div>
            {canCaseInfoSave && (
              <span className="expert-order" onClick={this.toggleOrder}>
                生成订单
              </span>
            )}
            {hasCaseInfo && (
              <span className="expert-case" onClick={this.toggleCaseInfo}>
                案件信息表
              </span>
            )}
            {orderInfoShow && (
              <Form name="orderForm" className="order-form" ref={this.formRef}>
                <Form.Item
                  name="expertExplain"
                  rules={[{ required: true, message: '请填写说明信息!' }]}
                >
                  <Input
                    maxLength="2000"
                    onPressEnter={this.saveOrder}
                    placeholder="请填写说明信息"
                    addonAfter={
                      <span className="save-order" onClick={this.saveOrder}>
                        生成
                      </span>
                    }
                  />
                </Form.Item>
              </Form>
            )}
          </div>
          <ChatList
            type="session"
            scene={scene}
            to={to}
            userInfo={userInfo}
            otherIsExpert={otherIsExpert}
            msgsLoaded={this.msgsLoaded}
            msgTranslateMap={msgTranslateMap}
          />
          <ChatEditor type="session" scene={scene} to={to} />
        </div>
      </div>
    );
  }
}

export default connect(({ im, user }) => ({
  im,
  user,
  currSessionId: im.currSessionId,
  userUID: im.userUID,
  myInfo: user.userInfo,
  serviceInfo: im.serviceInfo,
  iccpUserInfos: im.iccpUserInfos,
  translateMap: im.translateMap,
}))(Chat);
