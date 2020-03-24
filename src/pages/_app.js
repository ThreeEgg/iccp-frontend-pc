import App from 'next/app';
import React from 'react';
import intl from 'react-intl-universal';
import { Provider } from 'react-redux';
import { Badge } from 'antd';
import withDva from '../utils/withDva';
import './_app.less';

const buildId = process.env.BUILD_ID;

const locales = {
  'zh-CN': require('../locales/zh-CN.json'),
  'en-US': require('../locales/en-US.json'),
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
  state = { initDone: false };

  componentDidMount() {
    // 手动设置默认的语言为英文
    if (!localStorage.lang) {
      localStorage.lang = intl.determineLocale({
        urlLocaleKey: 'lang',
        localStorageLocaleKey: 'lang',
      });
    }
    this.loadLocales();
  }

  loadLocales() {
    intl
      .init({
        currentLocale: localStorage.lang,
        locales,
      })
      .then(() => {
        this.setState({ initDone: true });
      });
  }

  render() {
    const { Component, pageProps, dvaStore } = this.props;

    return (
      <Provider store={dvaStore}>
        <Component {...pageProps} />
        <BuildInfo />
      </Provider>
    );
  }
}

export default withDva(MainApp);
