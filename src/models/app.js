import { message, Modal } from 'antd';
import global from '@/global';

export default {
  namespace: 'app',
  state: {
    lang: global.lang,
    chatVisible: false,
    canShowChat: false,
  },
  effects: {
    *showChat({}, { put, select }) {
      const { imLogin, userLogin } = yield select(({ im, user }) => ({
        imLogin: im.isLogin,
        userLogin: user.isLogin,
      }));
      if (!imLogin) {
        return;
      }
      // 如果是游客打开的话，检测是否申请到accid，是则弹起，否则

      yield put({
        type: 'save',
        payload: {
          chatVisible: true,
          canShowChat: true,
        },
      });
    },

    *hideChat({}, { put }) {
      yield put({
        type: 'save',
        payload: {
          chatVisible: false,
        },
      });
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    setLang(state, { lang }) {
      Modal.confirm({
        title: '语言切换重启后起效',
        mask: false,
        confirmColor: '#1b2857',
        confirmText: '切换',
        onOk: () => {
          localStorage.setItem('lang', lang);
          message.loading('重启中');
          window.location.reload();
        },
      });
      return { ...state };
    },
  },
};
