/*
 * @Descripttion: 
 * @version: 
 * @Author: 毛翔宇
 * @Date: 2020-03-06 16:48:06
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-03-12 17:59:22
 * @FilePath: \PC端-前端\src\modules\NIM\pages\chat.js
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
function invalidHint(props) {
  const scene = props.scene;
  const teamInvalid = props.teamInvalid;
  if (scene === "team" && teamInvalid) {
    const name = props.teamInfo && props.teamInfo.type === 'normal' ? '讨论组' : '群';
    return "<div class='invalidHint'>您已退出该" + name + "</div>";
  }
  return "";
}
class Chat extends React.Component {
  static async getInitialProps(props) {
    return {
    };
  }

  async componentDidMount() {
  }
  render() {
    return (
      <template>
        <div class="g-inherit m-article">
          <div class="m-chat-main">
            <invalidHint scene={scene} teamInvalid={teamInvalid} teamInfo={teamInfo}/>
            <chat-list
              type="session"
        : msglist="msglist"
            :userInfos="userInfos"
            :myInfo="myInfo"
            :isRobot="isRobot"
            @msgs-loaded="msgsLoaded"
      ></chat-list>
          <chat-editor
            type="session"
        : scene="scene"
          :to="to"
          :isRobot="isRobot"
          :invalid="teamInvalid || muteInTeam"
          :invalidHint="sendInvalidHint"
          :advancedTeam="teamInfo && teamInfo.type === 'advanced'"
      ></chat-editor>
    </div>
  </div >
</template >

    );
  }
}

// export default Chat;
export default connect(({ index, loading }) => ({ index, loading: loading.models.index }))(Chat);
