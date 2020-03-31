/*
 * @Descripttion:
 * @version:
 * @Author: 毛翔宇
 * @Date: 2020-03-06 16:48:06
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-03-31 19:05:23
 * @FilePath: \PC端-前端\src\modules\NIM\index.js
 */
import React from 'react';
import { connect } from 'react-redux';
import Chat from './components/Chat';
import Session from './components/Session';
import Login from './components/Login';
import { Layout,Button } from 'antd';
const { Sider } = Layout;

import './index.less';
import CaseInfo from './components/CaseInfo';
function InvalidHint(props) {
  const { teamInfo, scene, teamInvalid } = props;
  if (scene === 'team' && teamInvalid) {
    const name = teamInfo && teamInfo.type === 'normal' ? '讨论组' : '群';
    return "<div class='invalidHint'>您已退出该" + name + '</div>';
  }
  return '';
}
class Index extends React.Component {
  state = {
    caseInfoShow:false
  };
  // 进入该页面，文档被挂载
  async componentDidMount() {
    // 提交sdk连接请求
    // this.props.dispatch({ type: 'chat/connect' })
    if (!window.dispatch) {
      window.dispatch = this.props.dispatch;
    }
  }
  async componentDidUpdate(prevProps, prevState) {
    // this.props.dispatch({ type: 'chat/updateRefreshState' })
  }
  // 离开该页面，此时重置当前会话
  async componentWillUnmount() {
  }
  // computed
  // methods
  render() {
    const { caseInfoShow } = this.state;
    const { chat } = this.props;
    const { currSessionId } = chat;
    return (
      <Layout style={{ height: '100%' }}>
        <Sider
          theme='light'
          width='280'
          style={{
            overflow: 'auto',
            height: '100%',
            position: 'fixed',
            left: 0,
          }}
        >
          <Session />
          <Login />
        <Button className='login' type="primary" onClick={() => this.setState({ caseInfoShow: !caseInfoShow })}>案件信息</Button>
        </Sider>
        <CaseInfo visible={caseInfoShow} />
        {currSessionId && <Chat />}
      </Layout>
    );
  }
}

export default connect(({ chat }) => ({
  chat,
  currSessionId: chat.currSessionId,
}))(Index);
