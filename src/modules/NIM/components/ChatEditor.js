/*
 * @Descripttion:
 * @version:
 * @Author: 毛翔宇
 * @Date: 2020-03-12 18:04:56
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-04-04 19:14:54
 * @FilePath: \PC端-前端\src\modules\NIM\components\ChatEditor.js
 */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { message, Tooltip } from 'antd'

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
    scene: '',
    to: '',
    invalid: false,
    invalidHint: '您无权限发送消息',
    advancedTeam: false,
  };

  state = {
    isEmojiShown: false,
    msgToSent: '',
    icon1: `/im/ic_im_document.svg`,
    icon2: `/im/ic_im_star.svg`,
    icon3: ``,
    sendTxt: true,
    recording: false,
    recordDisable: false,
    toRecordCount: 0,
    recordTime: 0,
    $recordTime: null,
    recordTimeout: '',
    recorder: null,
    audioContext: null,
    ctrlDown: false,
  };

  componentDidMount = () => {
    // try {
    //   this.setState({
    //     audioContext: new window.AudioContext(),
    //   });
    // } catch (e) {
    //   this.setState({
    //     recordDisable: true,
    //   });
    // }
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
        type: 'im/sendMsg',
        method: 'text',
        scene: this.props.scene,
        to: this.props.to,
        text: text,
      });
    } else if (this.props.type === 'chatroom') {
      this.props.dispatch({
        type: 'im/sendChatroomMsg',
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
    let ipt = this.refs.fileToSent2;
    if (ipt.value) {
      if (this.props.type === 'session') {
        this.props.dispatch({
          type: 'im/sendFileMsg',
          scene: this.props.scene,
          to: this.props.to,
          fileInput: ipt,
        });
      } else if (this.props.type === 'chatroom') {
        this.props.dispatch({
          type: 'im/sendChatroomFileMsg',
          fileInput: ipt,
        });
      }
    }
  }
  sendCustomFileMsg = () => {
    if (this.state.invalid) {
      message.error(this.state.invalidHint);
      return;
    }
    let ipt = this.refs.fileToSent;
    if (ipt.value) {
      let file = ipt.files[0]
      // 大于50Mb不可上传
      if(file.size>52428800){
        message.error('上传文件不要大于50Mb');
        return
      }
      if (this.props.type === 'session') {
        this.props.dispatch({
          type: 'im/fileUpload',
          file,
          fileName: file.name,
          callback: (res) => {
            if (res.code === '0') {
              let type = 11 //'file'
              let pushContent = '[文件]' 
              let data = res.data;
              if (/(png|jpg|bmp|jpeg|gif)$/i.test(res.data.fileSuffix)) {
                type = 12 //'image'
                pushContent = '[图片]'
                let image = new Image();
                image.src = data.webUrl;
                image.onload = () => {
                  data.width=image.width
                  data.height=image.height
                  this.props.dispatch({
                    type: 'im/sendMsg',
                    method: 'custom',
                    scene: this.props.scene,
                    to: this.props.to,
                    pushContent,
                    content: {
                      type,
                      data:res.data
                    }
                  });
                }
                image.onerror = () => {
                  message.error('图片上传失败');
                }
              } else if (/\.(mov|mp4|ogg|webm)$/i.test(res.data.fileSuffix)) {
                type = 13 //'video'
                pushContent = '[视频]'
              }
              if(type!==12){
                this.props.dispatch({
                  type: 'im/sendMsg',
                  method: 'custom',
                  scene: this.props.scene,
                  to: this.props.to,
                  pushContent,
                  content: {
                    type,
                    data:res.data
                  }
                });
              }
            } else {
              // message.error(res.errorInfo);
            }
          },
        });
      } else if (this.props.type === 'chatroom') {
      }
    }
  }
  onKeyPress = (e) => {
    if (e.charCode === 13 && this.state.ctrlDown) {
      e.preventDefault();
      this.sendTextMsg();
    }
  }
  onKeyUp = (e) => {
    if (e.keyCode === 17 && this.state.ctrlDown) {
      this.setState({
        ctrlDown: false,
      });
    }
  }
  onKeyDown = (e) => {
    if (e.keyCode === 17 && !this.state.ctrlDown) {
      this.setState({
        ctrlDown: true,
      });
    }
  }
  showEmoji = () => {
    this.setState({
      isEmojiShown: true,
    });
  }
  hideEmoji = () => {
    this.setState({
      isEmojiShown: false,
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
      <div className="chat-editor">
        <div className="editor-tools">
          <span className="editor-tool">
            <i className="icon-img"><img src={this.state.icon1} /></i>
            <input className='editor-file' type="file" ref="fileToSent" onChange={this.sendCustomFileMsg} />
          </span>
          {/* 原生文件图片发送 */}
          {/* <span className="editor-tool">
            <i className="icon-img"><img src={this.state.icon1} /></i>
            <input className='editor-file' type="file" ref="fileToSent2" onChange={this.sendFileMsg} />
          </span> */}
        </div>
        <textarea className="editor-input"
          value={this.state.msgToSent}
          onChange={e => {
            this.setState({
              msgToSent: e.target.value,
            })
          }}
          placeholder='按如下方式描述更有利于描述清楚您的问题：&#10;公司名称：&#10;情况描述：'
          onKeyPress={this.onKeyPress}
          onKeyUp={this.onKeyUp}
          onKeyDown={this.onKeyDown}
        />
        <Tooltip placement="left" title='Ctrl+Enter发送'>
          <span className="editor-send" onClick={this.sendTextMsg}> 发 送 </span >
        </Tooltip>
      </div >
    );
  }
}
export default connect(({ im }) => ({
  im,
}))(ChatEditor);
