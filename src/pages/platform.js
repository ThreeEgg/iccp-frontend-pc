import React from 'react';
import api from '../services/api';
import { platformContentType } from '../common/enum';
import Platform from '../layouts/platformIndex';

export default class PlatformIntroduction extends React.Component {
  static async getInitialProps({ req, query }) {
    const fetch = require('isomorphic-unfetch');

    const requestUrl = 'http://221.215.57.110:9090/api' + api.listPlatformContent;
    //
    const platformIntroContentRes = await fetch(
      `${requestUrl}?languageId=0&pageNum=1&pageSize=1&type=${platformContentType.PLATFORMINTRO}`,
    );
    const platformIntroContent = await platformIntroContentRes.json();
    const platformIntro = platformIntroContent.data.items[0].content;

    return {
      // 关于我们
      platformIntro,
    };
  }

  render() {
    return (
      <Platform title="Platform Introduce" url="/images/ic_header_introduce.png">
        <div className="content-t flex flex-align">
          <p />
          <div className="flex flex-align">
            <img src="/images/ic_header_introduce_black.png" />
            <div>Platform Introduce</div>
          </div>
          <p />
        </div>
        <div
          className="platformCommonContent-m"
          dangerouslySetInnerHTML={{ __html: this.props.platformIntro }}
        />
        <div className="platformCommonContent-b">页脚信息</div>
      </Platform>
    );
  }
}
