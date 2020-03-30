import api from './api';
import request from './request';

/**
 *
 * @param {*} file File类型
 */
export const fileUpload = async ({ clientUserId, expertUserId, file, type }) => {
  return request.post(api.fileUpload, {
    data: {
      clientUserId,
      expertUserId,
      file,
      type,
    },
  });
};

export const getServiceList = async () => {
  return request(api.getServiceList);
};
