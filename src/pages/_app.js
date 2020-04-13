import App from 'next/app';
import React from 'react';
import intl from 'react-intl-universal';
import { Provider } from 'react-redux';
import { Badge, ConfigProvider } from 'antd';
import antdZhLocale from 'antd/lib/locale/zh_CN';
import antdEnLocale from 'antd/lib/locale/zh_CN';
import 'normalize.css';
import global from '@/global';
import AuthorityLayout from '../layouts/AuthorityLayout';
import IMLayout from '../layouts/IMLayout';
import withDva from '../utils/withDva';
import './_app.less';

const buildId = process.env.BUILD_ID;

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
        lang: initLang,
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
        this.setState({ initDone: true, lang: global.initLang });
      });
  }

  render() {
    const { lang } = this.state;
    const { Component, pageProps, dvaStore } = this.props;

    return (
      <ConfigProvider locale={lang === 'en' ? antdEnLocale : antdZhLocale}>
        <Provider store={dvaStore}>
          <IMLayout>
            <AuthorityLayout>
              <Component {...pageProps} />
            </AuthorityLayout>
          </IMLayout>
          <BuildInfo />
        </Provider>
      </ConfigProvider>
    );
  }
}

export default withDva(MainApp);
