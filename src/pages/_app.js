import App from 'next/app';
import React from 'react';
import intl from 'react-intl-universal';
import { Provider } from 'react-redux';
import withDva from '../utils/withDva';
import './_app.less';

const locales = {
  'zh-CN': require('../locales/zh-CN.json'),
  'en-US': require('../locales/en-US.json'),
};

class MainApp extends App {
  state = { initDone: false }

  componentDidMount() {
    // 手动设置默认的语言为英文
    if (!localStorage.lang) {
      localStorage.lang = intl.determineLocale({
        urlLocaleKey: 'lang',
        localStorageLocaleKey: 'lang'
      });
    }
    this.loadLocales();
  }

  loadLocales() {
    intl.init({
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
      </Provider>
    );
  }
}

export default withDva(MainApp);
