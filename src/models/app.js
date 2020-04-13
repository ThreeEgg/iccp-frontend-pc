import { message, Modal } from 'antd';
import global from '@/global';

export default {
  namespace: 'app',
  state: {
    lang: global.lang,
  },
  effects: {},
  reducers: {
    save(state, payload = {}) {
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
