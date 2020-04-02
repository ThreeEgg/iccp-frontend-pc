export default {
  namespace: 'im',
  state: {
    chatVisible: false,
    canShowChat: false,
  },
  effects: {
    *showChat({ }, { put }) {
      yield put({
        type: 'save',
        payload: {
          chatVisible: true,
          canShowChat: true,
        },
      });
    },

    *hideChat({ }, { put }) {
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
