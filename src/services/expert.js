import api from './api';
import request from './request';

// getExpertList: '/expert/list',
// getExpertIndividualIntroduce: '/expert/introduction',
// saveExpertIndividualIntroduce: '/expert/introduction/update',
// getExpertActivityList: '/expert/activity/list',
// getExpertActivityById: '/expert/activity/get',
// saveExpertActivity: '/expert/activity/create',
// deleteExpertActivity: '/expert/activity/delete',
// getExpertArticleById: '/expert/article/get',
// saveExpertArticle: '/expert/article/update',
// deleteExpertArticle: '/expert/article/delete',
// getAllServiceTagList: '/expert/service/list',
// getServiceTagList: '/expert/service/list',
// saveServiceTagList: '/expert/service/update',
// getExpertInfomation: '/expert/information',
// saveExpertInfomation: '/expert/information/update',
// getExpertScheduleByGreenwich: '/expert/schedule',
// saveExpertSchedule: '/expert/schedule/update',

export const getExpertList = async ({ countryCode, serviceTagIdList = [] }) => {
  return request(api.getExpertList, {
    params: {
      countryCode,
      password,
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

export const saveExpertIndividualIntroduce = async ({ content }) => {
  return request.post(api.saveExpertIndividualIntroduce, {
    params: {
      content,
    },
  });
};

export const getExpertActivityList = async ({ pageNo, pageSize, userId }) => {
  return request(api.getExpertActivityList, {
    params: {
      pageNo,
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

export const saveServiceTagList = async ({ userId }) => {
  return request(api.saveServiceTagList, {
    params: {
      userId,
    },
  });
};
