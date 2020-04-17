/*
 * @Descripttion:
 * @version:
 * @Author: 毛翔宇
 * @Date: 2020-03-24 17:11:25
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-04-07 09:41:03
 * @FilePath: \PC端-前端\src\modules\NIM\configs\index.js
 */
let config = {
  // 默认客服头像
  defaultServiceIcon: '/im/ic_im_service.svg',
  // 默认用户头像
  defaultUserIcon: '/im/ic_im_default.svg',
  // 默认本人头像
  defaultMeIcon: '/im/ic_im_me.svg',
  // 默认他人头像
  defaultClientIcon: '/im/ic_im_client.svg',
};

const env = 'online';

let appConfig = {
  // 用户的appkey
  // 用于在web demo中注册账号异步请求demo 服务器中使用
  test: {
    appkey: 'aa1e4938eb76eb6533267b3adc303bd6',
    postUrl: 'https://apptest.netease.im',
  },
  online: {
    appkey: 'aa1e4938eb76eb6533267b3adc303bd6',
    postUrl: 'https://app.netease.im',
  },
};

config = Object.assign(config, appConfig[env]);

export default config;
