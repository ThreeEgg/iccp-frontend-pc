import api from './api';
import request from './request';

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
