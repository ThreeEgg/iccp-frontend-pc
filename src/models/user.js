import router from 'next/router';
import { message } from 'antd';
import * as userService from '../services/user';
import { setAuthorityToken } from '../common/authority';

export default {
  namespace: 'user',
  state: {
    userInfo: {},
    imInfo: {},
    isLogin: false,
  },
  effects: {
    *getUserInfo({ payload }, { put, call }) {
      const res = yield call(userService.getUserInfo);

      if (res.code === '0') {
        const { baseInfo, imInfo, accessToken } = res.data;

        yield put({
          type: 'save',
          payload: {
            userInfo: baseInfo,
            imInfo,
            isLogin: true,
          },
        });

        // router.replace('/map');
      }
    },
    *login({ payload }, { put, call }) {
      const { password, platform = 'user', userName } = payload;
      const res = yield call(userService.login, { password, platform, userName });

      if (res.code === '0') {
        message.success('登录成功');
        const { baseInfo, imInfo, accessToken } = res.data;

        setAuthorityToken(accessToken);

        yield put({
          type: 'save',
          payload: {
            userInfo: baseInfo,
            imInfo,
            isLogin: true,
          },
        });

        router.replace('/');
      }
    },

    *register({ payload }, { call }) {
      const { email, password } = payload;
      const res = yield call(userService.registry, { email, password });

      if (res.code === '0') {
        message.success('注册成功');

        router.replace('/login');
      }
    },

    *requestEmailForResetPassword({ payload }, { call }) {
      const { email, callback } = payload;
      const res = yield call(userService.requestEmailForResetPassword, { email });

      if (res.code === '0') {
        message.success('找回密码的连接已发送至邮箱账号，请前往邮箱找回密码。');

        callback && callback();
      }
    },

    *resetPassword({ payload }, { call }) {
      const { newPassword, verifyCode } = payload;
      const res = yield call(userService.resetPassword, { newPassword, verifyCode });

      if (res.code === '0') {
        message.success('密码修改成功');

        router.replace('/');
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
