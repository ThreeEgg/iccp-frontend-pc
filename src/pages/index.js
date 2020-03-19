import React from 'react';
import Link from 'next/link';
import intl from 'react-intl-universal';
import BasicLayout from '../layouts/BasicLayout';
import LoginLayout from '../layouts/LoginLayout';
import Header from '../components/Header';
import Login from './login';
import RetrievePWD from './retrievePWD';
import changePWD from './changePWD';
import { Tabs } from 'antd';
import './index.less';
const { TabPane } = Tabs;

export default class extends React.Component {
  static async getInitialProps({ req }) {
    const userAgent = req ? req.headers['user-agent'] : navigator.userAgent

    // 服务端请求
    const fetch = require('isomorphic-unfetch');
    const res = await fetch('http://gank.io/api/data/Android/10/1');
    const json = await res.json();
    return {
      stars: json.results[0].desc,
      userAgent,
    };
  }

  state = {
    lang: '',
  }

  changLang = () => {
    localStorage.lang = localStorage.lang == 'en-US' ? 'zh-CN' : 'en-US';
    window.location.reload();
  }

  componentDidMount = () => {
    this.setState({
      lang: intl.determineLocale({
        urlLocaleKey: 'lang',
        localStorageLocaleKey: 'lang'
      })
    });
  }

  render() {
    return (
        <LoginLayout >
            <Login />
        </LoginLayout>
    )
  }
}
