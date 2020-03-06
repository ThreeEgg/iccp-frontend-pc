/*
 * @Descripttion: 
 * @version: 
 * @Author: 毛翔宇
 * @Date: 2020-03-06 16:48:06
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-03-06 17:33:03
 * @FilePath: \PC端-前端\src\pages\chat.js
 */
import React from 'react';
import { connect } from 'react-redux';
import dynamic from 'next/dynamic'
const LXChat = dynamic(
    import('../components/chat/LXChat'),
    {
      ssr: false   //这个要加上,禁止使用 SSR
    }
  )
class Chat extends React.Component {
  static async getInitialProps(props) {
    return {
    };
  }

  async componentDidMount() {
  }

  render() {
    return (
      <LXChat></LXChat>
    );
  }
}

// export default Chat;
export default connect(({ index, loading }) => ({ index, loading: loading.models.index }))(Chat);
