import { getAuthorityToken } from './authority';

export const getCommonHeader = () => {
  const header = {
    platform: 'pcweb',
    language: 'zh-CN',
    ua: window.navigator.userAgent,
    ip: '0.0.0.0',
    timezone: new Date().getTimezoneOffset() / 60,
  };

  const token = getAuthorityToken();
  if (token) {
    header['x-auth-token'] = token;
  }
  return header;
};
