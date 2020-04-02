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
      type: 'chat/connect',
    });
  }

  imLogout = () => {
    this.props.dispatch({
      type: 'chat/logout',
    });
  }

  showChat = () => {
    this.props.dispatch({
      type: 'im/showChat',
    });
  }

  hideChat = () => {
    this.props.dispatch({
      type: 'im/hideChat',
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

    return (
      <>
        {this.props.children}
        <Badge count={unreadCount}>
          <div className='im-entry' onClick={this.showChat}></div>
        </Badge>
        {
          chatVisible ?
            <div className={classNames('chat-global-container flex')}>
              <div className='chat-global-body flex-1'>
                {/* FIXME: 2020.4.2 此处 */}
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

export default connect(({ user, chat, im }) => ({
  isLogin: user.isLogin,
  unreadCount: chat.unreadCount,
  canShowChat: im.canShowChat,
  chatVisible: im.chatVisible,
}))(IMLayout);
