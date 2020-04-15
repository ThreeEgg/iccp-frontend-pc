/*
 * @Descripttion: 
 * @version: 
 * @Author: 毛翔宇
 * @Date: 2020-04-02 18:58:04
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-04-03 17:20:13
 * @FilePath: \PC端-前端\src\layouts\IMLayout.js
 */
import React, { Component } from 'react';
import { Badge } from 'antd';
import { connect } from 'react-redux';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import { CloseOutlined, MinusOutlined } from '@ant-design/icons';
import './IMLayout.less';

const NIMChat = dynamic(import('../modules/NIM'), {
  ssr: false,
});

export class IMLayout extends Component {
  imLogin = () => {
    this.props.dispatch({
      type: 'im/connect',
    });
  }

  imLogout = () => {
    this.props.dispatch({
      type: 'im/logout',
    });
  }

  showChat = () => {
    this.props.dispatch({
      type: 'app/showChat',
    });
  }

  hideChat = () => {
    this.props.dispatch({
      type: 'app/hideChat',
    });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.isLogin !== this.props.isLogin) {
      // 判断当前是否为唯一窗口，是，则初始化IM，否则无视
      if (this.props.isLogin) {
        this.imLogin();
      } else {
        this.imLogout();
      }
    }
  }

  componentDidMount = () => {
    if (typeof window === 'undefined') {
      return;
    }
    // 提供dispatch注入
    window.dispatch = this.props.dispatch;
  }

  render() {
    const { unreadCount, canShowChat, chatVisible } = this.props;

    // FIXME: 此处根据路由隐藏逻辑不好维护，需要处理
    let chatIconVisible = true;
    if (typeof window !== 'undefined') {
      if (window.location.href.match(/login|retrievePWD|changePWD|modifyPWD|setProfile/)) {
        chatIconVisible = false;
      }
    }

    return (
      <>
        {this.props.children}
        {
          chatIconVisible ?
            <div className='im-entry' onClick={this.showChat}>
              <Badge count={unreadCount} />
            </div> : null
        }
        {
          chatVisible ?
            <div className={classNames('chat-global-container flex')}>
              <div className='chat-global-body flex-1'>
                {/* FIXME: 2020.4.2 此处需要做缓存，提高性能 */}
                {
                  canShowChat ? <NIMChat /> : null
                }
              </div>
              <div className="chat-global-navigator flex flex-column">
                <CloseOutlined className='close' onClick={this.hideChat} />

                <MinusOutlined className='min' onClick={this.hideChat} />
              </div>
            </div>
            : null
        }
      </>
    );
  }
}

export default connect(({ user, im, app }) => ({
  isLogin: user.isLogin,
  unreadCount: im.unreadCount,
  canShowChat: app.canShowChat,
  chatVisible: app.chatVisible,
}))(IMLayout);
