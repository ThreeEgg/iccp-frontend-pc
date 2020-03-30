import api from './api';
import request from './request';

export const getCountryList = async ({ id }) => {
  return request(api.getCountryList, {
    params: { id },
  });
};

export const getExpertList = async ({ countryCode, serviceTagIdList = [] }) => {
  return request(api.getExpertList, {
    params: {
      countryCode,
      serviceTagIdList,
    },
  });
};

export const getExpertIndividualIntroduce = async ({ userId }) => {
  return request(api.getExpertIndividualIntroduce, {
    params: {
      userId,
    },
  });
};

export const saveExpertIndividualIntroduce = async ({ introduction }) => {
  return request.post(api.saveExpertIndividualIntroduce, {
    data: introduction,
  });
};

export const getExpertActivityList = async ({ pageNum, pageSize, userId }) => {
  return request(api.getExpertActivityList, {
    params: {
      pageNum,
      pageSize,
      userId,
    },
  });
};

export const getExpertActivityById = async ({ articleId }) => {
  return request(api.getExpertActivityById, {
    params: {
      articleId,
    },
  });
};

export const saveExpertActivity = async ({ content }) => {
  return request.post(api.saveExpertActivity, {
    params: {
      content,
    },
  });
};

export const deleteExpertActivity = async ({ activityId }) => {
  return request(api.deleteExpertActivity, {
    params: {
      activityId,
    },
  });
};

export const getExpertArticleById = async ({ activityId }) => {
  return request(api.getExpertArticleById, {
    params: {
      activityId,
    },
  });
};

export const saveExpertArticle = async ({ content }) => {
  return request.post(api.saveExpertArticle, {
    params: {
      content,
    },
  });
};

export const deleteExpertArticle = async ({ articleId }) => {
  return request(api.deleteExpertArticle, {
    params: {
      articleId,
    },
  });
};

export const getAllServiceTagList = async ({ userId }) => {
  return request(api.getAllServiceTagList, {
    params: {
      userId,
    },
  });
};

export const saveServiceTagList = async ({ serviceIdList }) => {
  return request(api.saveServiceTagList, {
    params: {
      serviceIdList,
    },
  });
};

export const getExpertInformation = async ({ userId }) => {
  return request(api.getExpertInformation, {
    params: {
      userId,
    },
  });
};

export const saveExpertInformation = async ({ content }) => {
  return request.post(api.saveServiceTagList, {
    params: {
      content,
    },
  });
};

export const getExpertScheduleByGreenwich = async ({ timeZone, userId }) => {
  return request(api.getExpertScheduleByGreenwich, {
    params: {
      timeZone,
      userId,
    },
  });
};

export const saveExpertSchedule = async ({ schedule, startTime, timeZone, userId }) => {
  return request.post(api.saveExpertSchedule, {
    data: {
      // 日程表字符串
      schedule,
      userId,
      timeZone,
      // 开始时间，单位为秒
      startTime,
    },
  });
};
