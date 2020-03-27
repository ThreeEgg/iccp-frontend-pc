/*
 * @Descripttion:
 * @version:
 * @Author: 毛翔宇
 * @Date: 2020-03-12 18:04:56
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-03-27 09:13:21
 * @FilePath: \PC端-前端\src\modules\NIM\components\ChatList.js
 */
import React from 'react';
import PropTypes from 'prop-types';
import ChatItem from './ChatItem';
import './ChatList.less';

export default class ChatList extends React.Component {
  //在这里进行类型检测(这里的名字不是随便自定义的，规定这样写的)
  static propTypes = {
    type: PropTypes.string,
    canLoadMore: PropTypes.bool,
    isRobot: PropTypes.bool,
    msglist: PropTypes.array,
    userInfos: PropTypes.object,
    myInfo: PropTypes.object,
    isHistory: PropTypes.bool,
  };
  //如果没有传值，可以给一个默认值
  static defaultProps = {
    isRobot: false,
    msglist: [],
    userInfos: {},
    myInfo: {},
    isHistory: false,
  };
  state = {
    isFullImgShow: false,
    msgLoadedTimer: null,
  };

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
  render() {
    const { type, msglist, isRobot, userInfos, myInfo, isHistory, canLoadMore } = this.props;

    return (
      <ul id="chat-list" className="m-chat-list p-chat-list">
        <li className="u-msg item-time">
          ---- {canLoadMore ? '上拉加载更多' : '已无更多记录'} ----
        </li>
        {msglist.map((msg, index) => {
          return (
            <ChatItem
              type={type}
              rawMsg={msg}
              isRobot={isRobot}
              userInfos={userInfos}
              myInfo={myInfo}
              key={msg.idClient || index}
              isHistory={isHistory}
              msgLoaded={this.msgLoaded}
            />
          );
        })}
      </ul>
    );
  }
}
