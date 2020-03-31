import api from './api';
import request from './request';

export const requestIMId = async ({ guestId }) => {
  return request(api.requestIMId, {
    params: {
      guestId,
    },
  });
};

export const checkFirstChat = async ({ expertImId, userImId }) => {
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

export const getCaseInfo = async ({ caseId, clientUserId, expertUserId }) => {
  return request(api.getCaseInfo, {
    params: {
      caseId,
      clientUserId,
      expertUserId,
    },
  });
};

export const saveCaseInfo = async ({
  ageOfAccount,
  caseId,
  caseIntroduction,
  clientUserId,
  companyAddress,
  companyName,
  contactInformation,
  country,
  creditor,
  currencyType,
  debtOfAmount,
  expertUserId,
  expertUserName,
  iccpCaseEnclosureList = [],
  isValid,
  obligor,
  obligorCountry,
}) => {
  return request.post(api.saveCaseInfo, {
    data: {
      ageOfAccount,
      caseId,
      caseIntroduction,
      clientUserId,
      companyAddress,
      companyName,
      contactInformation,
      country,
      creditor,
      currencyType,
      debtOfAmount,
      expertUserId,
      expertUserName,
      iccpCaseEnclosureList,
      isValid,
      obligor,
      obligorCountry,
    },
  });
};

export const saveOrder = async ({ clientUserId, expertExplain }) => {
  return request(api.saveOrder, {
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
  });
};

export const getTranslate = async ({ msgidClient }) => {
  return request.post(api.getTranslate, {
    params: {
      msgidClient,
    },
  });
};
