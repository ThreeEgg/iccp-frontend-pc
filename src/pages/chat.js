/*
 * @Descripttion: 
 * @version: 
 * @Author: 毛翔宇
 * @Date: 2020-03-20 09:04:49
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-03-20 10:06:01
 * @FilePath: \PC端-前端\src\pages\chat.js
 */
import React from 'react';
import { connect } from 'react-redux';

import NIMChat from '../modules/NIM';

class Chat extends React.Component {
  static async getInitialProps(props) {

    return {
    };
  }

  async componentDidMount() {
    await this.props.dispatch({ type: 'index/init' });
  }

  render() {
    const { index, loading } = this.props;
    const { name, count } = index;
    // console.log('rendered!!');
    return (
      <NIMChat/>
    );
  }
}

// export default Home;
export default connect(({ index, loading }) => ({ index, loading: loading.models.index }))(Chat);
