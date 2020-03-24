/*
 * @Descripttion: 解决SDK无法调用外部dispatch的映射方法集合
 * @version: 
 * @Author: 毛翔宇
 * @Date: 2020-03-23 16:35:03
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-03-24 16:34:18
 * @FilePath: \PC端-前端\src\modules\NIM\dva\effects\extFunction.js
 */

export function* updateLoginExt({ isLogin }, { put }) {
  yield put({ type: 'updateLogin', isLogin });
}
export function* updateUserUIDExt({ loginInfo }, { put }) {
  yield put({ type: 'updateUserUID', loginInfo });
}
export function* updateCurrSessionExt({ currSessionId }, { put }) {
  yield put({ type: 'updateCurrSession', currSessionId });
}
export function* updateBlacklistExt({ blacks }, { put }) {
  yield put({ type: 'updateBlacklist', blacks });
}
export function* updateFriendsExt({ friends }, { put }) {
  yield put({ type: 'updateFriends', friends });
}
export function* updateUserInfoExt({ users }, { put }) {
  yield put({ type: 'updateUserInfo', users });
}
export function* updateMyInfoExt({ myInfo }, { put }) {
  yield put({ type: 'updateMyInfo', myInfo });
}
export function* updateSessionsExt({ sessions }, { put }) {
  yield put({ type: 'updateSessions', sessions });
}
export function* onRobotsExt({ robots }, { put }) {
  yield put({ type: 'updateRobots', robots });
}
export function* updateMsgsExt({ msgs }, { put,select }) {
  yield put({ type: 'updateMsgs', msgs });
  yield put({ type: 'updateMsgByIdClient', msgs });
  let tempSessionMap = {}
  msgs.forEach(msg => {
    tempSessionMap[msg.sessionId] = true
  })
  let msgsNew = yield select(state => state.chat.msgs);
  const currSessionId = yield select(state => state.chat.currSessionId);
  console.log(msgsNew);
  console.log(currSessionId);
  for (let sessionId in tempSessionMap) {
    msgsNew[sessionId].sort((a, b) => {
      if (a.time === b.time) {
        // 机器人消息，回复消息时间和提问消息时间相同，提问在前，回复在后
        if (a.type === 'robot' && b.type === 'robot') {
          if (a.content && a.content.msgOut) {
            return 1
          }
          if (b.content && b.content.msgOut) {
            return -1
          }
        }
      }
      return a.time - b.time
    })
    if (sessionId === currSessionId) {
      yield put({ type: 'updateCurrSessionMsgs', method: 'init'});
    }
  }
}
