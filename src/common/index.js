import { getAuthorityToken } from './authority';

export const getCommonHeader = () => {
  const header = {
    platform: 'pcweb',
    language: 'zh-CN',
    ua: window.navigator.userAgent,
    timezone: new Date().getTimezoneOffset() / 60,
  };

  const token = localStorage.getItem('accessToken');
  if (token) {
    header['x-auth-token'] = token;
  }
  return header;
};
