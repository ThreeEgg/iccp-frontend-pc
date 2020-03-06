/*
 * @Descripttion: 
 * @version: 
 * @Author: 毛翔宇
 * @Date: 2020-03-06 15:20:05
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-03-06 17:48:37
 * @FilePath: \PC端-前端\src\components\chat\LXChat.js
 */
import React from 'react';
import Chat from 'chat-react';
import './LXChat.less'

export default class LXChat extends React.Component {
  state = {
    inputValue: '',
    messages: [{
      timestamp: 1545925494422,
      userInfo: {
        avatar: "http://img.binlive.cn/1.png",
        name: "游客1544365758856",
        userId: "1544365758856"
      },
      value: "hello~"
    }, {
      timestamp: 1545925534218,
      userInfo: {
        avatar: "http://img.binlive.cn/1.png",
        name: "游客1544365758856",
        userId: "1544365758856"
      },
      value: ":grinning:",
      error: true //设置消息状态为失败，显示错误状态图标
    }],
    timestamp: new Date().getTime()
  }
  setInputfoucs = () => {
    this.chat.refs.input.inputFocus();  //set input foucus
  }
  setScrollTop = () => {
    this.chat.refs.message.setScrollTop(1200);  //set scrollTop position
  }
  sendMessage = (v) => {
    const { value } = v;
    if (!value) return;
    const { messages = [] } = this.state;
    messages.push(v);
    this.setState({ messages, timestamp: new Date().getTime(), inputValue: '' });
  }
  render() {
    const { inputValue, messages, timestamp } = this.state;
    const userInfo = {
      avatar: "http://img.binlive.cn/6.png",
      userId: "59e454ea53107d66ceb0a598",
      name: 'ricky'
    };
    return (
      <Chat
        ref={el => this.chat = el}
        className="my-chat-box"
        dataSource={messages}
        userInfo={userInfo}
        value={inputValue}
        sendMessage={this.sendMessage}
        timestamp={timestamp}
        placeholder="请输入"
        messageListStyle={{ width: '100%', height: window.outerHeight }}
      />
    );
  }
}