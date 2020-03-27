/*
 * @Descripttion:
 * @version:
 * @Author: 毛翔宇
 * @Date: 2020-03-12 18:04:56
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-03-27 16:56:38
 * @FilePath: \PC端-前端\src\modules\NIM\components\ChatEditor.js
 */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import config from '../configs';
import { message } from 'antd'

class ChatEditor extends React.Component {
  //在这里进行类型检测(这里的名字不是随便自定义的，规定这样写的)
  static propTypes = {
    type: PropTypes.string,
    scene: PropTypes.string,
    to: PropTypes.string,
    invalid: PropTypes.bool,
    invalidHint: PropTypes.string,
    advancedTeam: PropTypes.bool,
  };
  //如果没有传值，可以给一个默认值
  static defaultProps = {
    invalid: false,
    invalidHint: '您无权限发送消息',
    advancedTeam: false,
  };

  state = {
    isEmojiShown: false,
    msgToSent: '',
    icon1: `${config.resourceUrl}/im/chat-editor-1.png`,
    icon2: `${config.resourceUrl}/im/chat-editor-2.png`,
    icon3: `${config.resourceUrl}/im/chat-editor-3.png`,
    icon4: `https://yx-web-nosdn.netease.im/quickhtml%2Fassets%2Fyunxin%2Fdefault%2Fchat-editor-keyboard.png`,
    icon5: `https://yx-web-nosdn.netease.im/quickhtml%2Fassets%2Fyunxin%2Fdefault%2Fchat-editor-record.png`,
    sendTxt: true,
    recording: false,
    recordDisable: false,
    toRecordCount: 0,
    recordTime: 0,
    $recordTime: null,
    recordTimeout: '',
    recorder: null,
    audioContext: null,
  };

  componentDidMount = () => {
    try {
      this.setState({
        audioContext: new window.AudioContext(),
      });
    } catch (e) {
      this.setState({
        recordDisable: true,
      });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    // 监听输入框
    if (prevState.msgToSent !== this.state.msgToSent) {

    }
  }

  sendTextMsg = () => {
    let text = this.state.msgToSent;
    if (this.props.invalid) {
      message.error(this.props.invalidHint);
      return;
    }
    if (/^\s*$/.test(text)) {
      message.warning('请不要发送空消息');
      return;
    } else if (text.length > 800) {
      message.warning('请不要超过800个');
      return;
    }
    text = text.trim();
    if (this.props.type === 'session') {
      this.props.dispatch({
        type: 'chat/sendMsg',
        method: 'text',
        scene: this.props.scene,
        to: this.props.to,
        text: text,
      });
    } else if (this.props.type === 'chatroom') {
      this.props.dispatch({
        type: 'chat/sendChatroomMsg',
        method: 'text',
        text: text,
      });
    }
    this.setState({
      msgToSent: '',
    });
  };
  sendFileMsg = () => {
    if (this.state.invalid) {
      message.error(this.state.invalidHint);
      return;
    }
    let ipt = this.refs.fileToSent;
    if (ipt.value) {
      if (this.props.type === 'session') {
        this.props.dispatch({
          type: 'chat/sendFileMsg',
          scene: this.props.scene,
          to: this.props.to,
          fileInput: ipt,
        });
      } else if (this.props.type === 'chatroom') {
        this.props.dispatch({
          type: 'chat/sendChatroomFileMsg',
          fileInput: ipt,
        });
      }
    }
  }
  showEmoji = () => {
    debugger
    this.setState({
      isEmojiShown:true,
    });
  }
  hideEmoji = () => {
    this.setState({
      isEmojiShown:false,
    });
  }
  addEmoji = (emojiName) => {
    this.setState({
      msgToSent: this.state.msgToSent += emojiName,
    });
    this.hideEmoji();
  }
  render() {
    return (
      <div className="m-chat-editor">
        <div className="m-chat-editor-main">
          <span className="u-editor-input">
            <textarea value={this.state.msgToSent}
              onChange={e => {
                this.setState({
                  msgToSent: e.target.value,
                })
              }}></textarea>
          </span >
          <span className="u-editor-icon" onClick={this.showEmoji} >
            <i className="u-icon-img"><img src={this.state.icon1} /></i>
          </span >
          <span className="u-editor-icon">
            <i className="u-icon-img"><img src={this.state.icon2} /></i>
            <input type="file" ref="fileToSent" onChange={this.sendFileMsg} />
          </span>
          <span className="u-editor-send" onClick={this.sendTextMsg}> 发 送 </span >
        </div >
      </div >
    );
  }
}
export default connect(({ chat }) => ({
  chat,
}))(ChatEditor);
