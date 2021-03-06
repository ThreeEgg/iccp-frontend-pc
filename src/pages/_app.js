import App from 'next/app';
import React from 'react';
import intl from 'react-intl-universal';
import { Provider } from 'react-redux';
import { Badge, ConfigProvider } from 'antd';
import antdZhLocale from 'antd/lib/locale/zh_CN';
import antdEnLocale from 'antd/lib/locale/en_US';
import 'moment/locale/zh-cn';
import moment from 'moment';
import 'normalize.css';
import global from '@/global';
import AuthorityLayout from '../layouts/AuthorityLayout';
import IMLayout from '../layouts/IMLayout';
import withDva from '../utils/withDva';
import { inject } from 'iccp-frontend-im/dist';
import * as commonService from '@/services/common';
import * as imService from '@/services/im';
// 全局注入样式
import '@/common/common.less';
import '@/common/custom.less';

const buildId = process.env.BUILD_ID;

// 启动im模块
inject({
  service: {
    common: commonService,
    im: imService,
  },
  global,
  storageApi: {
    set:
      typeof window !== 'undefined'
        ? window.localStorage.setItem.bind(window.localStorage)
        : () => {},
    get:
      typeof window !== 'undefined'
        ? window.localStorage.getItem.bind(window.localStorage)
        : () => '',
  },
});

const locales = {
  'zh-CN': require('../locales/zh-CN.json'),
  en: require('../locales/en.json'),
};

const BuildInfo = () => {
  let badgeTag = '';

  if (process.env.NODE_ENV == 'development') {
    badgeTag = <Badge status="processing" />;
  }

  if (process.env.NODE_ENV === 'production') {
    badgeTag = <Badge status="success" />;
  }

  return (
    <div
      style={{
        position: 'fixed',
        fontSize: 12,
        right: 30,
        bottom: 20,
        padding: '8px 16px',
        background: 'rgba(0,0,0,.2)',
        borderRadius: 4,
        pointerEvents: 'none',
        color: 'white',
        zIndex: 11,
      }}
    >
      {badgeTag}
      {buildId}
    </div>
  );
};

class MainApp extends App {
  state = { initDone: false, lang: 'en' };

  componentDidMount() {
    const intl = require('react-intl-universal');
    const initLang = intl.determineLocale({
      urlLocaleKey: 'lang',
      localStorageLocaleKey: 'lang',
    });
    global.lang = initLang;
    if (this.props.dvaStore) {
      this.props.dvaStore.dispatch({
        type: 'app/save',
        payload: {
          lang: initLang,
        },
      });
    }
    this.loadLocales(initLang);
  }

  loadLocales() {
    intl
      .init({
        currentLocale: global.lang,
        locales,
      })
      .then(() => {
        if (global.initLang == 'en') {
          moment.locale();
        } else {
          moment.locale('zh-cn');
        }
        this.setState({ initDone: true, lang: global.initLang });
      });
  }

  render() {
    const { lang } = this.state;
    const { Component, pageProps, dvaStore } = this.props;

    return (
      <ConfigProvider locale={lang === 'en' ? antdEnLocale : antdZhLocale}>
        <Provider store={dvaStore}>
          <BuildInfo />
          <IMLayout>
            <AuthorityLayout>
              <Component {...pageProps} />
            </AuthorityLayout>
          </IMLayout>
        </Provider>
      </ConfigProvider>
    );
  }
}

export default withDva(MainApp);
