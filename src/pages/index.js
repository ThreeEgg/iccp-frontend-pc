import React from 'react';
import Link from 'next/link';
import intl from 'react-intl-universal';
import BasicLayout from '../layouts/BasicLayout';
import { Button } from 'antd';
import './index.less';

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
      <BasicLayout>
        <div>
          <img className='logo' src="/logo.svg" alt="" />
        </div>
        <div>
          当前语言：{this.state.lang} <Button onClick={this.changLang}>切换</Button>
        </div>
        <div>
          国际化示例： {intl.get('home')}
        </div>
        <Link href="/home">
          <a>跳转页面</a>
        </Link>
        <p>客户端UA： {this.props.userAgent}</p>
        <p>服务端请求的数据： {this.props.stars}</p>
      </BasicLayout>
    )
  }
}
