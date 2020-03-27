/*
 * @Descripttion: 
 * @version: 
 * @Author: 毛翔宇
 * @Date: 2020-03-18 13:42:19
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-03-27 10:06:57
 * @FilePath: \PC端-前端\src\modules\NIM\components\ChatItem.js
 */

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Modal } from 'antd';
const { confirm } = Modal;

import util from '../utils'
import config from '../configs'
import emojiObj from '../configs/emoji'

var audio = { // 正在播放音频的 audio、target
  $node: null,
  $audio: null,
  timeout: '',
  imgPlay0: 'https://yx-web-nosdn.netease.im/quickhtml%2Fassets%2Fyunxin%2Fdefault%2Fplay0.gif',
  imgPlay1: 'https://yx-web-nosdn.netease.im/quickhtml%2Fassets%2Fyunxin%2Fdefault%2Fplay1.gif'
}

class ChatItem extends React.Component {
  //在这里进行类型检测(这里的名字不是随便自定义的，规定这样写的)
  static propTypes = {
    rawMsg: PropTypes.object,
    userInfos: PropTypes.object,
    myInfo: PropTypes.object,
    isRobot: PropTypes.bool,
    isHistory: PropTypes.bool,
  };
  //如果没有传值，可以给一个默认值
  static defaultProps = {
    rawMsg: {},
    userInfos: {},
    myInfo: {},
    isRobot: false,
    isHistory: false,
  };
  state = {
    msg: '',
    isFullImgShow: false,
    msgUnRead: false,
  };
  componentWillMount() {
    this.computedItem()
  }
  componentDidMount() {
    let item = this.state.msg
    // window.stopPlayAudio = this.stopPlayAudio.bind(this)

    let media = null
    if (item.type === 'image') {
      // 图片消息缩略图
      media = new Image()
      media.src = item.file.url + '?imageView&thumbnail=180x0&quality=85'
    } else if (item.type === 'custom-type1') {
      // 猜拳消息
      media = new Image()
      media.className = 'emoji-middle'
      media.src = item.imgUrl
    } else if (item.type === 'custom-type3') {
      // 贴图表情
      media = new Image()
      media.className = 'emoji-big'
      media.src = item.imgUrl
    } else if (item.type === 'video') {
      if (/(mov|mp4|ogg|webm)/i.test(item.file.ext)) {
        media = document.createElement('video')
        media.src = item.file.url
        media.width = 640
        media.height = 480
        media.autoStart = false
        media.preload = 'metadata'
        media.controls = 'controls'
      } else {
        let aLink = document.createElement('a')
        aLink.href = item.file.url
        aLink.target = '_blank'
        aLink.innerHTML = `<i class="u-icon icon-file"></i>${video.name}`
        this.refs.mediaMsg.appendChild(aLink)
      }
    }
    if (media) {
      if (this.refs.mediaMsg) {
        this.refs.mediaMsg.appendChild(media)
      }
      media.onload = () => {
        this.props.msgLoaded();
      }
      media.onerror = () => {
        this.props.msgLoaded();
      }
    } else {
      this.props.msgLoaded();
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.rawMsg !== this.props.rawMsg) {
      let newCustom = this.props.rawMsg && this.props.rawMsg.localCustom
      if (!newCustom || !this.props.rawMsg || this.props.rawMsg.type !== 'audio') {
        return
      }
      let oldCustom = prevProps.rawMsg && oldprevProps.rawMsgVal.localCustom
      if (newCustom !== oldCustom) {
        this.computedItem()
      }
    }
  }

  // computed
  msgUnRead = () => {
    var obj = !this.props.isHistory
      && this.state.msg.needMsgReceipt
      && this.state.msg.flow === 'out'
      && this.props.teamMsgReads.find(item => item.idServer === this.state.msg.idServer)
    this.setState({
      msgUnRead: obj ? parseInt(obj.unread) : -1
    })
  }
  // methods
  computedItem = () => {
    let item = Object.assign({}, this.props.rawMsg)
    // 标记用户，区分聊天室、普通消息
    if (this.props.type === 'session') {
      if (item.flow === 'in') {
        if (item.from !== this.props.userUID) {
          item.avatar = (this.props.userInfos[item.from] && this.props.userInfos[item.from].avatar) || config.defaultUserIcon
          // TODO
          item.link = `#/namecard/${item.from}`
          //todo  如果是未加好友的人发了消息，是否能看到名片
        } else {
          item.avatar = this.props.myInfo.avatar
        }
      } else if (item.flow === 'out') {
        item.avatar = this.props.myInfo.avatar
      }
    } else {
      // 标记时间，聊天室中
      item.showTime = util.formatDate(item.time)
    }
    if (item.type === 'timeTag') {
      // 标记发送的时间
      item.showText = item.text
    } else if (item.type === 'text') {
      // 文本消息
      item.showText = util.escape(item.text)
      if (/\[[^\]]+\]/.test(item.showText)) {
        let emojiItems = item.showText.match(/\[[^\]]+\]/g)
        emojiItems.forEach(text => {
          let emojiCnt = emojiObj.emojiList.emoji
          if (emojiCnt[text]) {
            item.showText = item.showText.replace(text, `<img class="emoji-small" src="${emojiCnt[text].img}">`)
          }
        })
      }
    } else if (item.type === 'custom') {
      let content = JSON.parse(item.content)
      // type 1 为猜拳消息
      if (content.type === 1) {
        let data = content.data
        let resourceUrl = config.resourceUrl
        // item.showText = `<img class="emoji-middle" src="${resourceUrl}/im/play-${data.value}.png">`
        item.type = 'custom-type1'
        item.imgUrl = `${resourceUrl}/im/play-${data.value}.png`
        // type 3 为贴图表情
      } else if (content.type === 3) {
        let data = content.data
        let emojiCnt = ''
        if (emojiObj.pinupList[data.catalog]) {
          emojiCnt = emojiObj.pinupList[data.catalog][data.chartlet]
          // item.showText = `<img class="emoji-big" src="${emojiCnt.img}">`
          item.type = 'custom-type3'
          item.imgUrl = `${emojiCnt.img}`
        }
      } else {
        item.showText = util.parseCustomMsg(item)
        if (item.showText !== '[自定义消息]') {
          item.showText += ',请到手机或电脑客户端查看'
        }
      }
    } else if (item.type === 'image') {
      // 原始图片全屏显示
      item.originLink = item.file.url
    } else if (item.type === 'video') {
      // ...
    } else if (item.type === 'audio') {
      item.width = (5.3 + Math.round(item.file.dur / 1000) * 0.03).toFixed(2) + 'rem'
      item.audioSrc = item.file.mp3Url
      item.showText = '<i>' + Math.round(item.file.dur / 1000) + '"</i> 点击播放'
      if (!this.isHistory && nim.useDb) {
        item.unreadAudio = !item.localCustom
      }
    } else if (item.type === 'file') {
      item.fileLink = item.file.url
      item.showText = item.file.name
    } else if (item.type === 'notification') {
      if (item.scene === 'team') {
        item.showText = util.generateTeamSysmMsg(item)
      } else {
        //对于系统通知，更新下用户信息的状态
        item.showText = util.generateChatroomSysMsg(item)
      }
    } else if (item.type === 'tip') {
      //对于系统通知，更新下用户信息的状态
      item.showText = item.tip
    } else if (item.type === 'robot') {
      let content = item.content || {}
      let message = content.message || []
      if (!content.msgOut) {
        // 机器人上行消息
        item.robotFlow = 'out'
        item.showText = item.text
      } else if (content.flag === 'bot') {
        item.subType = 'bot'
        message = message.map(item => {
          if (item.type === 'template') {
            // 在vuex(store/actions/msgs.js)中已调用sdk方法做了转换
            return item.content.json
          } else if (item.type === 'text' || item.type === 'answer') {
            // 保持跟template结构一致
            return [{
              type: 'text',
              text: item.content
            }]
          } else if (item.type === 'image') {
            // 保持跟template结构一致
            return [{
              type: 'image',
              url: item.content
            }]
          }
        })
        item.message = message
      } else if (item.content.flag === 'faq') {
        item.subType = 'faq'
        item.query = message.query
        let match = message.match.sort((a, b) => {
          // 返回最匹配的答案
          return b.score - a.score
        })
        item.message = match[0]
      }
    } else {
      item.showText = `[${util.mapMsgType(item)}],请到手机或电脑客户端查看`
    }
    this.setState({
      msg: item
    })
  }
  revocateMsg = (vNode) => {
    // 在会话聊天页
    if (this.props.currSessionId) {
      if (vNode && vNode.data && vNode.data.attrs) {
        let attrs = vNode.data.attrs
        if (attrs.type === 'robot') {
          return
        }
        // 自己发的消息
        if (attrs.flow === 'out') {
          let that = this
          confirm({
            title: '确定需要撤回消息?',
            icon: <ExclamationCircleOutlined />,
            content: '',
            onOk() {
              that.props.dispatch({
                type: 'chat/revocateMsg',
                idClient: attrs.idClient
              })
            },
            onCancel() {
            },
          });
        }
      }
    }
  }
  showFullImg = (src) => {
    this.props.dispatch({
      type: 'chat/showFullscreenImg',
      src
    })
  }

  render() {
    const { msg, msgUnRead } = this.state;
    const { type } = this.props;
    return (
      /* 信息类型*/
      <li className={
        `u-msg  
        ${msg.flow === 'out' && 'item-me'}
        ${msg.flow === 'in' && 'item-you'}
        ${msg.flow === 'timeTag' && 'item-time'}
        ${msg.flow === 'tip' && 'item-tip'}
        ${type === 'session' && 'session-chat'}
        `}>
        {/* 信息头信息 */}
        <div className={
          `${msg.type === 'tip' && 'tip'}
          ${msg.type === 'notification' && msg.scene === 'team' && 'notification'}
          `}>---- {msg.showText} ----</div>
        {(!['timeTag', 'tip', 'notification'].includes(msg.type) && (msg.flow === 'in' || msg.flow === 'out')) &&
          <div
          data-idclient={msg.idClient}
          data-time={msg.time}
          data-flow={msg.flow}
          data-type={msg.type}
            onClick={this.revocateMsg}
          >
            {/* 信息来源 */}
            {msg.avatar &&
              <a className="msg-head" href={msg.link}>
                <img className="icon u-circle" src={msg.avatar} />
              </a>
            }
            {!msg.avatar && msg.type !== 'notification' &&
              <p className="msg-user">
                <em>{msg.showTime}</em>{msg.from}
              </p>
            }
            {/* 信息内容 */}
            {msg.type === 'text' &&
              <span className="msg-text" dangerouslySetInnerHTML={{ __html: msg.showText }}></span>
            }
            {(msg.type === 'custom-type1' || msg.type === 'custom-type3' || msg.type === 'video') &&
              <span className="msg-text" ref="mediaMsg"></span>
            }
            {msg.type === 'image' &&
              <span className="msg-text" ref="mediaMsg" onClick={this.showFullImg.bind(this, msg.originLink)}></span>
            }
            {msg.type === 'audio' &&
              <span className={`msg-text msg-audio ${msg.unreadAudio && 'unreadAudio'}`} style={{ width: msg.width }} ref="mediaMsg" onClick={this.playAudio.bind(this, msg)} dangerouslySetInnerHTML={{ __html: msg.showText }}></span>
            }
            {msg.type === 'file' &&
              <span className="msg-text"><a href={msg.fileLink} target="_blank"><i class="u-icon icon-file"></i>{msg.showText}</a></span>
            }
            {msg.type === 'robot' &&
              <span className="msg-text">功能暂未开放</span>
            }
            {msg.type === 'notification' &&
              <span className="msg-text notify">{msg.showText}</span>
            }
            {!['text', 'custom-type1', 'custom-type3', 'video', 'image', 'audio', 'file', 'robot', 'notification'].includes(msg.type) &&
              <span className="msg-text" dangerouslySetInnerHTML={{ __html: msg.showText }}></span>
            }
            {/* 发送失败 */}
            {msg.status === 'fail' &&
              <span className="msg-failed"><i class="weui-icon-warn"></i></span>
            }
            {/* 回执标志 */}
            {msgUnRead >= 0 &&
              <span className="msg-unread">{msgUnRead && '未读'}</span>
            }
          </div>
        }
      </li >
    );
  }
}
export default connect(({ chat }) => ({
  chat,
  userUID: chat.userUID,
  teamMsgReads: chat.teamMsgReads,
  currSessionId: chat.currSessionId,
}))(ChatItem);