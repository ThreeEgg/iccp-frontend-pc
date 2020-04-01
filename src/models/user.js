import router from 'next/router';
import { message } from 'antd';
import Cookie from 'js-cookie';
import * as userService from '../services/user';
import { setAuthorityToken } from '../common/authority';

export default {
  namespace: 'user',
  state: {
    initAuthority: false,
    userInfo: {},
    imInfo: {},
    isLogin: false,
  },
  effects: {
    *getUserInfo({ payload }, { put, call }) {
      const res = yield call(userService.getUserInfo);

      if (res.code === '0') {
        const { baseInfo, imInfo, accessToken } = res.data;

        localStorage.userInfo = JSON.stringify(baseInfo);
        localStorage.imInfo = JSON.stringify(imInfo);
        localStorage.isLogin = 1;

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
        localStorage.userInfo = JSON.stringify(baseInfo);
        localStorage.imInfo = JSON.stringify(imInfo);
        localStorage.isLogin = 1;
        localStorage.platform = platform;

        Cookie.set('userId', baseInfo.userId);
        Cookie.set('token', accessToken);

        yield put({
          type: 'save',
          payload: {
            userInfo: baseInfo,
            imInfo,
            isLogin: true,
          },
        });

        if (localStorage.platform === 'expert') {
          return router.replace('/expert/home');
        }
        router.replace('/');
      }
    },

    *logout({ payload }, { put, call }) {
      // FIXME: 2020.4.1 wph 无法异步登出
      userService.logout();

      localStorage.removeItem('userInfo');
      localStorage.removeItem('imInfo');
      localStorage.removeItem('isLogin');
      localStorage.removeItem('accessToken');

      Cookie.remove('userId');
      Cookie.remove('token');

      yield put({
        type: 'save',
        payload: {
          userInfo: {},
          imInfo: {},
          isLogin: false,
        },
      });
      if (localStorage.platform === 'expert') {
        return router.replace('/expert/home');
      }
      router.replace('/');
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

        if (localStorage.platform === 'expert') {
          return router.replace('/expert/home');
        }
        router.replace('/');
      }
    },

    *modifyPassword({ payload }, { call }) {
      const { newPassword, oldPassword } = payload;
      const res = yield call(userService.modifyPassword, { newPassword, oldPassword });

      if (res.code === '0') {
        message.success('密码修改成功');

        if (localStorage.platform === 'expert') {
          return router.replace('/expert/home');
        }
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
