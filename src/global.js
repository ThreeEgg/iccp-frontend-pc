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

const setCurrSessionCallbackFunc = () => {
  //TODO
}
const goToLogInPageFunc = () => {
  //TODO
}
const showLoadingFunc = () => {
  //TODO
}
const hideLoadingFunc = () => {
  //TODO
}

export default {
  dispatch: null,
  nim: null,
  lang: initLang,
  
  // 设定当前会话后的回调函数
  setCurrSessionCallbackFunc,
  // 跳转到登陆页
  goToLogInPageFunc,
  // 显示加载
  showLoadingFunc,
  // 隐藏加载
  hideLoadingFunc,
};
