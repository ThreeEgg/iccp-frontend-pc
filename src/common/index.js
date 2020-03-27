/*
 * @Descripttion: 
 * @version: 
 * @Author: 毛翔宇
 * @Date: 2020-03-27 17:29:30
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-03-27 18:30:24
 * @FilePath: \PC端-前端\src\common\index.js
 */
import { getAuthorityToken } from './authority';

export const getCommonHeader = () => {
  const header = {
    platform: 'pcweb',
    'x-language-id': 'cn',
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
