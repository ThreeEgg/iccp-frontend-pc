import api from './api';
import request from './request';

export const requestIMId = async ({ guestId }) => {
  return request(api.requestIMId, {
    params: {
      guestId,
    },
  });
};

export const checkFirstChat = async ({ expertAccid, userAccid }) => {
  return request(api.checkFirstChat, {
    params: {
      expertAccid,
      userAccid,
    },
  });
};

export const checkFirstChatForCustomerService = async ({ accid, serviceAccid }) => {
  return request(api.checkFirstChatForCustomerService, {
    params: {
      accid,
      serviceAccid,
    },
  });
};

export const recentChatList = async ({ accid, pageNum, pageSize }) => {
  return request(api.recentChatList, {
    params: {
      accid,
      pageNum,
      pageSize,
    },
  });
};

export const receiveMsg = async ({ from, to }) => {
  return request(api.receiveMsg, {
    params: {
      fromAccount: from,
      toAccount: to,
    },
  });
};

export const getCaseInfo = async ({ caseId, clientUserId, expertUserId }) => {
  return request(api.getCaseInfo, {
    params: {
      caseId,
      clientUserId,
      expertUserId,
    },
  });
};

export const saveCaseInfo = async (extIccpCase) => {
  return request.post(api.saveCaseInfo, {
    data: extIccpCase,
  });
};

export const saveOrder = async ({ clientUserId, expertExplain }) => {
  return request.post(api.saveOrder, {
    params: {
      clientUserId,
      expertExplain,
    },
  });
};

export const customerEvaluationToExpert = async ({ attitudeRating, expertUserId, skillRating }) => {
  return request.post(api.customerEvaluationToExpert, {
    params: {
      attitudeRating,
      expertUserId,
      skillRating,
    },
  });
};

export const historyChatMsg = async ({ chatId, pageNum, pageSize }) => {
  return request.post(api.historyChatMsg, {
    params: {
      chatId,
      pageNum,
      pageSize,
    },
  });
};

export const downloadCaseBatch = async ({ caseId }) => {
  return request(api.downloadCaseBatch, {
    params: {
      caseId,
    },
    responseType: 'blob',
  });
};

export const getTranslate = async ({ msgidClient }) => {
  return request.post(api.getTranslate, {
    params: {
      msgidClient,
    },
  });
};

export const getExpertUserRating = async ({ expertUserId }) => {
  return request.post(api.getExpertUserRating, {
    params: {
      expertUserId,
    },
  });
};

export const saveExpertUserRating = async ({ expertUserId, attitudeRating, skillRating }) => {
  return request.post(api.saveExpertUserRating, {
    params: {
      expertUserId,
      attitudeRating,
      skillRating,
    },
  });
};
