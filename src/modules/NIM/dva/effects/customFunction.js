/*
 * @Descripttion: 解决SDK无法调用外部dispatch的映射方法集合
 * @version: 
 * @Author: 毛翔宇
 * @Date: 2020-03-23 16:35:03
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-04-03 18:26:32
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
    const serviceInfoOld = yield select(state => state.chat.serviceInfo);
    const iccpUserListOld = yield select(state => state.chat.iccpUserList);
    if (Object.keys(serviceInfoOld).length > 0 || iccpUserListOld.length > 0) {
      callback();
    }
  }
  const res = yield call(im.recentChatList, { accid, pageNum: 0, pageSize: 100000 });
  if (res.code === '0') {
    const serviceInfo = res.data.serviceChatInfo;
    yield put({ type: 'updateServiceInfo', serviceInfo });
    const iccpUserList = res.data.pagedItems && res.data.pagedItems.items;
    yield put({ type: 'updateiccpUserInfos', iccpUserList });
    // 若会话为空且客服信息不为空则主动触发一次会话
    const sessionlist = yield select(state => state.chat.sessionlist);
    if (sessionlist.length === 0 && serviceInfo) {
      yield put({ type: 'checkFirstChatForCustomerService', serviceAccid: serviceInfo.accid });
    }
    callback && callback();
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
  const res = yield call(im.saveCaseInfo, {
    extIccpCase,
  });
  callback && callback(res);
}

export function* fileUpload({
  clientUserId, expertUserId, file, fileName, filetype,
  callback }, { call }) {
  const res = yield call(common.fileUpload, {
    clientUserId, expertUserId, file, fileName, type: filetype,
  });
  callback && callback(res);
}

export function* downloadCaseBatch({ caseId, callback }, { call }) {
  const res = yield call(im.downloadCaseBatch, { caseId, });
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