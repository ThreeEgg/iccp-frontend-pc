const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));

const model = {
  namespace: 'index',
  state: {
    name: 'hopperhuang',
    count: 0,
    init: false,
  },
  reducers: {
    caculate(state, payload) {
      const { count } = state;
      const { delta } = payload;
      return { ...state, count: count + delta };
    },
  },
  effects: {
    *init(action, { put }) {
      yield delay(1500);
      yield put({ type: 'caculate', delta: 0 });
    },
    *calculateAsync({ delta }, { put }) {
      yield delay(500);
      yield put({ type: 'caculate', delta });
    },
  },
};

export default model;
