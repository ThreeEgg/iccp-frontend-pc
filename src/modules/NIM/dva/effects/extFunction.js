/*
 * @Descripttion: 解决SDK无法调用外部dispatch的映射方法集合
 * @version:
 * @Author: 毛翔宇
 * @Date: 2020-03-23 16:35:03
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-04-07 16:05:45
 * @FilePath: \PC端-前端\src\modules\NIM\dva\effects\extFunction.js
 */
import { formatUserInfo } from './userInfo';

export function* updateLoginExt({ isLogin }, { put }) {
  yield put({ type: 'updateLogin', isLogin });
}
export function* updateUserUIDExt({ loginInfo }, { put }) {
  yield put({ type: 'updateUserUID', loginInfo });
}
export function* updateBlacklistExt({ blacks }, { put }) {
  yield put({ type: 'updateBlacklist', blacks });
}
export function* updateFriendsExt({ friends, cutFriends }, { put }) {
  yield put({ type: 'updateFriends', friends, cutFriends });
}
export function* updateUserInfoExt({ users }, { put }) {
  yield put({ type: 'updateUserInfo', users });
}
export function* updateMyInfoExt({ myInfo }, { put }) {
  yield put({ type: 'updateMyInfo', myInfo });
}
export function* updateSessionsExt({ sessions }, { put, select }) {
  const sessionMap = yield select(state => state.chat.sessionMap);
  // 更新客服信息及专家列表
  yield put({
    type: 'updateUsers',
    callback: () => {
      window.dispatch({ type: 'chat/updateSessions', sessions });
      // 向后台更新会话已读状态
      sessions.forEach(item => {
        if (item.unread === 0 && sessionMap[item.id] && sessionMap[item.id].unread !== 0) {
          window.dispatch({ type: 'chat/receiveMsg', to: item.to });
        }
      });
    },
  });
}
export function* onRobotsExt({ robots }, { put }) {
  yield put({ type: 'updateRobots', robots });
}
export function* replaceMsgExt({ sessionId, idClient, msg }, { put }) {
  yield put({ type: 'replaceMsg', sessionId, idClient, msg });
}
export function* setNoMoreHistoryMsgsExt(action, { put }) {
  yield put({ type: 'setNoMoreHistoryMsgs' });
}
export function* updateSearchlistExt({ method, list }, { put }) {
  yield put({ type: 'updateSearchlist', method, list });
}
export function* onMsgExt({ msg }, { put, select }) {
  yield put({ type: 'updateMsgByIdClient', msgs: [msg] });
  yield put({ type: 'updateMsg', msg });
  const currSessionId = yield select(state => state.chat.currSessionId);
  if (msg.sessionId === currSessionId) {
    yield put({ type: 'updateCurrSessionMsgs', method: 'put', msg });
    // 发送已读回执
    yield put({ type: 'sendMsgReceipt' });
  }
  if (msg.scene === 'team' && msg.type === 'notification') {
    yield put({ type: 'onTeamNotificationMsg', msg });
  }
}
export function* updateMsgsExt({ msgs }, { put, select }) {
  yield put({ type: 'updateMsgs', msgs });
  yield put({ type: 'updateMsgByIdClient', msgs });
  let tempSessionMap = {};
  msgs.forEach(msg => {
    tempSessionMap[msg.sessionId] = true;
  });
  let msgsNew = yield select(state => state.chat.msgs);
  const currSessionId = yield select(state => state.chat.currSessionId);
  for (let sessionId in tempSessionMap) {
    msgsNew[sessionId].sort((a, b) => {
      if (a.time === b.time) {
        // 机器人消息，回复消息时间和提问消息时间相同，提问在前，回复在后
        if (a.type === 'robot' && b.type === 'robot') {
          if (a.content && a.content.msgOut) {
            return 1;
          }
          if (b.content && b.content.msgOut) {
            return -1;
          }
        }
      }
      return a.time - b.time;
    });
    if (currSessionId && sessionId === currSessionId) {
      yield put({ type: 'updateCurrSessionMsgs', method: 'init' });
    }
  }
}
export function* sendTipMsgDoneExt({ msg, tipMsg }, { put, select }) {
  let idClient = msg.deletedIdClient || msg.idClient;
  yield put({
    type: 'replaceMsg',
    sessionId: msg.sessionId,
    idClient,
    msg: tipMsg,
  });
  const currSessionId = yield select(state => state.chat.currSessionId);
  if (msg.sessionId === currSessionId) {
    yield put({
      type: 'updateCurrSessionMsgs',
      method: 'replace',
      idClient,
      msg: tipMsg,
    });
  }
}
// 更新当前会话列表的聊天记录，包括历史消息、单聊消息等，不包括聊天室消息
export function* updateCurrSessionMsgs(paylord, { put, select }) {
  let { method, msg, msgs, idClient } = paylord;
  if (method === 'destroy') {
    // 清空会话消息
    yield put({ type: 'destroyCurrSessionMsgs' });
  } else if (method === 'init') {
    // 初始化会话消息列表
    yield put({ type: 'initCurrSessionMsgs' });
    const currSessionMsgs = yield select(state => state.chat.currSessionMsgs);
    yield put({ type: 'checkTeamMsgReceipt', msgs: currSessionMsgs });
  } else if (method === 'put') {
    // 追加一条消息
    if (msg) {
      yield put({ type: 'putCurrSessionMsgs', msg });
      yield put({ type: 'checkTeamMsgReceipt', msgs: [msg] });
    }
  } else if (method === 'concat') {
    // 一般用于历史消息拼接
    yield put({ type: 'concatCurrSessionMsgs', msgs });
    const currSessionMsgs = yield select(state => state.chat.currSessionMsgs);
    yield put({ type: 'checkTeamMsgReceipt', msgs: currSessionMsgs });
  } else if (method === 'replace') {
    // 替换idClient的消息
    yield put({ type: 'replaceCurrSessionMsgs', msg, idClient });
  }
}
export function* onUpdateFriend({ friends }, { put, select }) {
  const nim = yield select(state => state.chat.nim);
  const users = yield select(state => state.chat.users);
  friends = nim.mergeFriends(friends, users).map(formatUserInfo);
  // 更新好友列表
  yield put({ type: 'updateFriends', friends });
  // 更新好友资料
  yield put({ type: 'updateUserInfo', users: friends });
}
