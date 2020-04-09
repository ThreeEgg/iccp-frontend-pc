/*
 * @Descripttion: 解决SDK无法调用外部dispatch的映射方法集合
 * @version: 
 * @Author: 毛翔宇
 * @Date: 2020-03-23 16:35:03
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-04-04 17:02:14
 * @FilePath: \PC端-前端\src\modules\NIM\dva\effects\customFunction.js
 */
import { message } from 'antd'

import * as im from '../../../../services/im';
import * as common from '../../../../services/common';

export function* checkFirstChatForCustomerService({ serviceAccid }, { call, select }) {
  const accid = yield select(state => state.chat.userUID);
  const res = yield call(im.checkFirstChatForCustomerService, { accid, serviceAccid });
  if (res.code === '0') {
    console.log(res.data.msg);
  } else {
    // message.error(res.errorInfo);
  }
}
export function* updateUsers({ callback }, { put, call, select }) {
  const accid = yield select(state => state.chat.userUID);
  if (callback) {
    const serviceInfo = yield select(state => state.chat.serviceInfo);
    const iccpUserInfos = yield select(state => state.chat.iccpUserInfos);
    if (Object.keys(serviceInfo).length > 0 || Object.keys(iccpUserInfos).length > 0) {
      callback();
    }
  }
  const res = yield call(im.recentChatList, { accid, pageNum: 0, pageSize: 100000 });
  if (res.code === '0') {
    const serviceInfo = res.data.serviceChatInfo;
    yield put({ type: 'updateServiceInfo', serviceInfo });
    const iccpUserList = res.data.pagedItems && res.data.pagedItems.items;
    yield put({ type: 'updateiccpUserInfos', iccpUserList });
    if (callback) {
      // 若客服会话为空则主动触发一次会话
      const hasServiceSession = yield select(state => state.chat.hasServiceSession);
      if (!hasServiceSession && serviceInfo) {
        yield put({ type: 'checkFirstChatForCustomerService', serviceAccid: serviceInfo.accid });
      }
      callback();
    }
  } else {
    // message.error(res.errorInfo);
  }
}

export function* saveOrder({ clientUserId, expertExplain, callback }, { call }) {
  const res = yield call(im.saveOrder, { clientUserId, expertExplain });
  callback && callback(res);
}

export function* getTranslate({ idClient, callback }, { call }) {
  const res = yield call(im.getTranslate, { msgidClient: idClient });
  callback && callback(res);
}

export function* getExpertUserRating({ expertUserId, callback }, { call }) {
  const res = yield call(im.getExpertUserRating, { expertUserId });
  callback && callback(res);
}

export function* saveExpertUserRating({
  expertUserId,
  attitudeRating,
  skillRating,
  callback }, { call }) {
  const res = yield call(im.saveExpertUserRating, {
    expertUserId,
    attitudeRating,
    skillRating,
  });
  callback && callback(res);
}

export function* getCaseInfo({
  clientUserId,
  expertUserId, callback }, { call }) {
  const res = yield call(im.getCaseInfo, {
    clientUserId,
    expertUserId,
  });
  callback && callback(res);
}


export function* saveCaseInfo({
  extIccpCase, callback }, { call }) {
  const res = yield call(im.saveCaseInfo,
    extIccpCase,
  );
  callback && callback(res);
}

export function* fileUpload({
  clientUserId, expertUserId, file, fileName, fileType,
  callback }, { call }) {
  const res = yield call(common.fileUpload, {
    clientUserId, expertUserId, file, fileName, type: fileType,
  });
  callback && callback(res);
}

export function* downloadCaseBatch({ caseId, callback }, { call }) {
  const res = yield call(im.downloadCaseBatch, { caseId, });
  callback && callback(res);
}

export function* receiveMsg({ to, callback }, { call, select }) {
  const from = yield select(state => state.chat.userUID);
  const res = yield call(im.receiveMsg, { from, to, });
  callback && callback(res);
}

export function* initSession({ expertAccid, callback }, { call, select }) {
  const userAccid = yield select(state => state.chat.userUID);
  const res = yield call(im.checkFirstChat, { expertAccid, userAccid });
  if (res.code === '0') {
    console.log(res.data.msg);
  } else {
    // message.error(res.errorInfo);
  }
  callback && callback();
}