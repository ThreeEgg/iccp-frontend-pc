/*
 * @Descripttion: 解决SDK无法调用外部dispatch的映射方法集合
 * @version: 
 * @Author: 毛翔宇
 * @Date: 2020-03-23 16:35:03
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-03-31 10:21:30
 * @FilePath: \PC端-前端\src\modules\NIM\dva\effects\customFunction.js
 */
import { message } from 'antd'

import * as im from '../../../../services/im';

export function* checkFirstChatForCustomerService({ serviceAccid }, { call, select }) {
  const accid = yield select(state => state.chat.userUID);
  const res = yield call(im.checkFirstChatForCustomerService, { accid, serviceAccid });
  if (res.code === '0') {
    console.log(res.data.msg);
  } else {
    message.error(res.msg);
  }
}
export function* updateUsers(action, { put, call, select }) {
  const accid = yield select(state => state.chat.userUID);
  const res = yield call(im.recentChatList, { accid, pageNum: 0, pageSize: 100000 });
  if (res.code === '0') {
    const serviceInfo = res.data.serviceChatInfo;
    yield put({ type: 'updateServiceInfo', serviceInfo });
    const expertList = res.data.pagedItems && res.data.pagedItems.items;
    yield put({ type: 'updateExpertList', expertList });
    // 若客服信息不为空且客服会话为空则主动触发一次会话
    if (serviceInfo && !serviceInfo.lastChatTime) {
      // yield put({ type: 'checkFirstChatForCustomerService', serviceAccid: serviceInfo.accid });
    }
    // 若会话为空且客服信息不为空则主动触发一次会话
    const sessionlist = yield select(state => state.chat.sessionlist);
    if (sessionlist.length===0 && serviceInfo) {
      yield put({ type: 'checkFirstChatForCustomerService', serviceAccid: serviceInfo.accid });
    }
  } else {
    message.error(res.msg);
  }
}

export function* getTranslate({ idClient, callback }, { call }) {
  const res = yield call(im.getTranslate, { msgidClient: idClient });
  callback && callback(res);
}