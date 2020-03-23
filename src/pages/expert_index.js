import React from 'react';
import Link from 'next/link';
import intl from 'react-intl-universal';
import expert_BasicLayout from '../layouts/expert_BasicLayout';
import expert_LoginLayout from '../layouts/expert_LoginLayout';
import expert_Header from '../components/expert_Header';
import expert_Login from './expert_login';
import expert_RetrievePWD from './expert_retrievePWD';
import expert_changePWD from './expert_changePWD';
import { Tabs } from 'antd';
import './expert_index.less';
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
        <expert_LoginLayout >
            <expert_Login />
        </expert_LoginLayout>
    )
  }
}
