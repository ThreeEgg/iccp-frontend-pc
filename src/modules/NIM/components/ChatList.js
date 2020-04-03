/*
 * @Descripttion:
 * @version:
 * @Author: 毛翔宇
 * @Date: 2020-03-12 18:04:56
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-04-03 14:23:27
 * @FilePath: \PC端-前端\src\modules\NIM\components\ChatList.js
 */
import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import ChatItem from './ChatItem';
import './ChatList.less';
import VirtualList from '../../../components/VirtualList';
import { Button } from 'antd';


export default class ChatList extends React.Component {
  //在这里进行类型检测(这里的名字不是随便自定义的，规定这样写的)
  static propTypes = {
    type: PropTypes.string,
    canLoadMore: PropTypes.bool,
    msglist: PropTypes.array,
    userInfo: PropTypes.object,
    myInfo: PropTypes.object,
    isHistory: PropTypes.bool,
  };
  //如果没有传值，可以给一个默认值
  static defaultProps = {
    msglist: [],
    userInfo: {},
    myInfo: {},
    isHistory: false,
  };
  state = {
    msgList: [],
    isFullImgShow: false,
    msgLoadedTimer: null,
  };
  async componentDidMount() {
    this.initMsgList()
  }
  async componentDidUpdate(prevProps, prevState) {
    // 监听会话改变
    if (prevProps.msglist !== this.props.msglist) {
      this.initMsgList()
    }
  }
  itemList = createRef();

  showFullImg = src => {
    this.props.dispatch('showFullscreenImg', {
      src,
    });
  };
  msgLoaded = () => {
    clearTimeout(this.state.msgLoadedTimer);
    this.state.msgLoadedTimer = setTimeout(() => {
      this.props.msgsLoaded();
    }, 20);
  };
  renderItem = (msg, index, measure) => {
    return <ChatItem
      type={this.props.type}
      rawMsg={msg}
      userInfo={this.props.userInfo}
      myInfo={this.props.myInfo}
      key={msg.idClient || index}
      isHistory={this.props.isHistory}
      measure={measure}
      msgLoaded={this.msgLoaded}
    />
  }
  initMsgList = () => {
    let msgList = [...this.props.msglist];
    let msg = {}
    msg.flow = 'onmore'
    msgList.splice(0, 0, msg)
    this.setState({
      msgList,
    },
      () => {
        this.scrollToBottom()
      })
  }
  scrollToBottom = () => {
    this.itemList.current.list.scrollToRow(this.state.msgList.length);
  }
  render() {
    const { msgList } = this.state;
    return (
      <div id="chat-list" className="chat-list">
        {/* <Button onClick={()=>{this.itemList.current.list.scrollToRow(0)}}>top</Button>
        <Button onClick={()=>{this.itemList.current.list.scrollToRow(msgList.length)}}>bottom</Button> */}
        <VirtualList
          ref={this.itemList}
          data={msgList}
          itemRender={this.renderItem}
        />
      </div>
    );
  }
}
