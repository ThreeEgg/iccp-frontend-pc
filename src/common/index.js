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

export const getResponseRateAverage = responseSpeed => {
  let responseRateAVG = 1;
  // 1h以内为3分，24h以内为2分，24h以上为1分
  if (responseSpeed <= 3600) {
    responseRateAVG = 3;
  } else if (responseSpeed <= 86400) {
    responseRateAVG = 2;
  }
  return responseRateAVG;
};
