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
    /** 有下一页 */
    hasNextPage: PropTypes.bool,
    /** 正在加载 */
    isNextPageLoading: PropTypes.bool,
    /** 加载下一页 */
    loadNextPage: PropTypes.func,
  };
  //如果没有传值，可以给一个默认值
  static defaultProps = {
    msglist: [],
    userInfo: {},
    myInfo: {},
    isHistory: false,
    hasNextPage: false,
    isNextPageLoading: false,
    loadNextPage: () => { },
  };
  state = {
    to:'',
    msgLoadedTimer: null,
  };
  async componentDidMount() {
  }
  async componentDidUpdate(prevProps, prevState) {
    // 监听会话对象改变
    if (prevProps.userInfo.userId !== this.props.userInfo.userId) {
      this.scrollToBottom();
    }
    // 监听会话改变
    if (prevProps.msglist !== this.props.msglist) {
      let prevLastMsg = prevProps.msglist[prevProps.msglist.length - 1];
      let lastMsg = this.props.msglist[this.props.msglist.length - 1];
      if (prevLastMsg && lastMsg){
        if(prevLastMsg.idClient !== lastMsg.idClient){
          this.scrollToBottom();
        }
        if(prevState.to !== lastMsg.to){
          this.scrollToBottom(lastMsg.to);
        }
      }
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
  scrollToBottom = (to) => {
    if(to){
      this.setState({
        to,
      })
    }
    this.itemList.current.list.scrollToRow(this.props.msglist.length);
  }
  render() {
    const { msglist, hasNextPage, isNextPageLoading } = this.props;
    return (
      <div id="chat-list" className="chat-list">
        {/* <Button onClick={()=>{this.itemList.current.list.scrollToRow(0)}}>top</Button>
        <Button onClick={()=>{this.itemList.current.list.scrollToRow(msgList.length)}}>bottom</Button> */}
        <VirtualList
          ref={this.itemList}
          data={msglist}
          itemRender={this.renderItem}
          hasNextPage={hasNextPage}
          isNextPageLoading={isNextPageLoading}
          loadNextPage={this.props.loadNextPage}
        />
      </div>
    );
  }
}
