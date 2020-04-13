let initLang = 'en';

if (typeof window !== 'undefined') {
  const intl = require('react-intl-universal');
  initLang = intl.determineLocale({
    urlLocaleKey: 'lang',
    localStorageLocaleKey: 'lang',
  });
} else {
  // TODO: 暂不支持服务端渲染控制的国际化
  // initLang = 'en';
  // const urlParams = require('@/utils/getUrlParam').default;
  // if (urlParams.lang) {
  //   initLang = urlParams.lang === 'en' ? 'en' : 'zh-CN';
  // }
}

export default {
  lang: initLang,
};
