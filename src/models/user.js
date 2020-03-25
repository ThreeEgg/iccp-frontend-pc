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
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
