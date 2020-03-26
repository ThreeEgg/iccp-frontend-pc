import React from 'react';
import api from '../services/api';
import { platformContentType } from '../common/enum';
import Platform from '../layouts/platformIndex';

export default class Business extends React.Component {
  static async getInitialProps({ req, query }) {
    const fetch = require('isomorphic-unfetch');

    const requestUrl = 'http://221.215.57.110:9090/api' + api.listPlatformContent;
    //
    const BusinessContentRes = await fetch(
      `${requestUrl}?pageNum=1&pageSize=1&type=${platformContentType.BUSINESSINTRO}`,
    );
    const BusinessContent = await BusinessContentRes.json();
    const Business = BusinessContent.data.items[0].content;

    return {
      Business,
    };
  }

  render() {
    return (
      <Platform title="Platform Introduce" url="/images/ic_header_introduce.png">
        <div className="content-t flex flex-align">
          <p />
          <div className="flex flex-align">
            <img src="/images/ic_header_business_black.png" />
            <div>Business Introduce</div>
          </div>
          <p />
        </div>
        <div
          className="platformCommonContent-m"
          dangerouslySetInnerHTML={{ __html: this.props.Business }}
        />
        <div className="platformCommonContent-b">页脚信息</div>
      </Platform>
    );
  }
}
