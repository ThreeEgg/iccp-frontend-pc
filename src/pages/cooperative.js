import React from 'react';
import ContentLayout from '../layouts/ContentLayout';
import router from 'next/router';
import api from '../services/api';
import { platformContentType } from '../common/enum';
import './cooperative.less';

export default class Cooperative extends React.Component {
  static async getInitialProps({ req, query }) {
    const { pageNum = 1 } = query;
    const fetch = require('isomorphic-unfetch');

    const requestUrl = `${api.baseUrl}/api${api.listPlatformContent}`;
    //
    const cooperativeContentRes = await fetch(
      `${requestUrl}?languageId=0&pageNum=${pageNum}&pageSize=10&type=${
        platformContentType.PARTNER
      }`,
    );
    const cooperativeContent = await cooperativeContentRes.json();
    const list = cooperativeContent.data.items;

    return {
      list,
    };
  }

  onChange = page => {
    router.push('/cooperative?pageNum=' + page);
  };

  render() {
    const { pageNum, pageInfo } = this.props;
    return (
      <ContentLayout title="problems" url="/images/ic_header_problems.png">
        <div className="content-t flex flex-align">
          <p />
          <div className="flex flex-align">
            <img src="/images/ic_header_partner.png" />
            <div>Cooperative Partner</div>
          </div>
          <p />
        </div>
        <div className="problemsContent-m">
          {this.props.list.map(item => (
            <img key={item.id} src={item.image} />
          ))}
        </div>
      </ContentLayout>
    );
  }
}
