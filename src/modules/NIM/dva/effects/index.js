// Action 提交的是 mutation，而不是直接变更状态。
// Action 可以包含任意异步操作。
import pageUtil from '../../utils/page';
import { updateBlack } from './blacks';
import { clearChatroomMembers, getChatroomInfo, getChatroomMembers, initChatroomInfos } from './chatroomInfos';
import { getChatroomHistoryMsgs, sendChatroomFileMsg, sendChatroomMsg, sendChatroomRobotMsg } from './chatroomMsgs';
import { addFriend, deleteFriend, updateFriend } from './friends';
import { initChatroomSDK, resetChatroomSDK } from './initChatroomSDK';
import { initNimSDK } from './initNimSDK';
import { continueRobotMsg, getHistoryMsgs, resetNoMoreHistoryMsgs, revocateMsg, sendFileMsg, sendMsg, sendMsgReceipt, sendRobotMsg, updateLocalMsg } from './msgs';
import { resetSearchResult, searchTeam, searchUsers } from './search';
import { deleteSession, resetCurrSession, setCurrSession } from './session';
import { deleteSysMsgs, markCustomSysMsgRead, markSysMsgRead, resetSysMsgs } from './sysMsgs';
import { checkTeamMsgReceipt, delegateTeamFunction, enterSettingPage, getTeamMembers, getTeamMsgReads, onTeamNotificationMsg } from './team';
import * as extFunction from './extFunction';
import * as customFunction from './customFunction';
/* 导出actions方法 */
import { hideFullscreenImg, showFullscreenImg } from './widgetUi';
import { message } from 'antd';
export default {
  *updateRefreshState(action, { put }) {
    yield put({ type: 'updateRefreshState' });
  },

  // UI 及页面状态变更
  showFullscreenImg,
  hideFullscreenImg,
  continueRobotMsg,
  *connectNim({ callback }, { put, select }) {
    let { force } = Object.assign({}, callback);
    const nim = yield select(state => state.chat.nim);
    // 操作为内容页刷新页面，此时无nim实例
    if (!nim || force) {
      let imInfo= JSON.parse(localStorage.imInfo);
      let loginInfo = {
        uid: imInfo.accid,
        sdktoken: imInfo.token,
      };
      if (!loginInfo.uid) {
        // 无localStorage，直接跳转登录页
        yield put({ type: 'updateLogin', isLogin:false });
        message.warning('无历史登录记录，请重新登录')
      } else {
        // 有cookie，重新登录
        yield put({ type: 'initNimSDK', loginInfo });
      }
    }
  },
  *connectChatroom({ callback }, { put, select }) {
    let { chatroomId } = Object.assign({}, callback);
    const nim = yield select(state => state.chat.nim);
    if (nim) {
      nim.getChatroomAddress({
        chatroomId,
        done: function getChatroomAddressDone(error, callback) {
          if (error) {
            message.error(error.message);
            location.href = '#/room';
            return;
          }
          put({ type: 'initChatroomSDK', callback });
        },
      });
    }
  },
  // 连接sdk请求，false表示强制重连
  *connect({ callback }, { put }) {
    let { type } = Object.assign({}, callback);
    // type 可为 nim chatroom
    type = type || 'nim';
    switch (type) {
      case 'nim':
        yield put({ type: 'connectNim', callback });
        break;
      case 'chatroom':
        yield put({ type: 'connectChatroom', callback });
        break;
    }
  },

  // 用户触发的登出逻辑
  *logout(action, { put, select }) {
    localStorage.imInfo = {}
    yield put({ type: 'disconnect' });
    yield put({ type: 'updateLogin', isLogin:false });
    // pageUtil.turnPage('', 'login');
  },

  // 平台自定义函数
  ...customFunction,
  // 解决SDK无法调用外部dispatch的映射方法集合start
  ...extFunction,
  // 解决SDK无法调用外部dispatch的映射方法集合end

  // 初始化 重新连接SDK
  initNimSDK,
  // 清空所有搜索历史纪录
  resetSearchResult,
  // 搜索用户信息
  searchUsers,
  // 更新黑名单
  updateBlack,
  // 更新好友
  addFriend,
  deleteFriend,
  updateFriend,
  // 删除会话
  deleteSession,
  // 设置当前会话
  setCurrSession,
  // 重置当前会话
  resetCurrSession,
  // 发送消息
  sendMsg,
  sendFileMsg,
  sendRobotMsg,
  // 发送消息已读回执
  sendMsgReceipt,
  // 消息撤回
  revocateMsg,
  // 更新本地消息
  updateLocalMsg,
  getHistoryMsgs,
  // 重置历史消息状态
  resetNoMoreHistoryMsgs,
  // 标记系统消息已读
  markSysMsgRead,
  markCustomSysMsgRead,
  resetSysMsgs,
  deleteSysMsgs,

  initChatroomSDK,
  initChatroomInfos,
  resetChatroomSDK,
  sendChatroomMsg,
  sendChatroomRobotMsg,
  sendChatroomFileMsg,
  getChatroomHistoryMsgs,
  getChatroomInfo,
  getChatroomMembers,
  clearChatroomMembers,

  // 搜索群
  searchTeam,
  // 代理sdk中的群方法
  delegateTeamFunction,
  // 处理群消息回调
  onTeamNotificationMsg,
  // 进入群信息设置页
  enterSettingPage,
  // 获取群成员
  getTeamMembers,
  // 群消息回执检查
  checkTeamMsgReceipt,
  // 查询群消息回执已读列表
  getTeamMsgReads,
};
