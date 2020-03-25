import React from 'react';
import api from '../services/api';
import { platformContentType } from '../common/enum';
import Platform from '../layouts/platformIndex';

export default class RetrievePWD extends React.Component {
  static async getInitialProps({ req, query }) {
    const fetch = require('isomorphic-unfetch');

    const requestUrl = 'http://221.215.57.110:9090/api' + api.listPlatformContent;
    //
    const aboutUsContentRes = await fetch(
      `${requestUrl}?pageNum=1&pageSize=1&type=${platformContentType.PLATFORMINTRO}`,
    );
    const aboutUsContent = await aboutUsContentRes.json();
    const aboutUs = aboutUsContent.data.items[0].content;

    return {
      // 关于我们
      aboutUs,
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
          dangerouslySetInnerHTML={{ __html: this.props.aboutUs }}
        >
          {/* <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum
            laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin
            sodales pulvinar sic tempor.
          </p>
          <p>
            Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra
            justo commodo. Proin sodales pulvinar sic tempor。Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit
            amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar sic tempor.
          </p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <img src="/images/img_header_bg.png" />
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum
            laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin
            sodales pulvinar sic tempor.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum
            laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin
            sodales pulvinar sic tempor.
          </p> */}
        </div>
        <div className="platformCommonContent-b">页脚信息</div>
      </Platform>
    );
  }
}
