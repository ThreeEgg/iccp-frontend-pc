export default {
  namespace: 'im',
  state: {
    chatVisible: false,
    canShowChat: false,
  },
  effects: {
    *showChat({}, { put, select }) {
      const { imLogin, userLogin } = yield select(({ chat, user }) => ({
        imLogin: chat.isLogin,
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
  },
};
