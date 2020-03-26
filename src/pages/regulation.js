import React from 'react';
import Platform from '../layouts/platformIndex';
import router from 'next/router';
import api from '../services/api';
import { platformContentType } from '../common/enum';
import { Pagination } from 'antd';
import ContentListItem from '../components/ListItem/ContentListItem';
import './regulation.less';

export default class Regulation extends React.Component {
  static async getInitialProps({ req, query }) {
    const { pageNum = 1 } = query;
    const fetch = require('isomorphic-unfetch');

    const requestUrl = 'http://221.215.57.110:9090/api' + api.listPlatformContent;
    //
    const regulationContentRes = await fetch(
      `${requestUrl}?languageId=0&pageNum=${pageNum}&pageSize=10&type=${
        platformContentType.CLAUSE
      }`,
    );
    const regulationContent = await regulationContentRes.json();
    const regulations = regulationContent.data.items;
    const pageInfo = regulationContent.data.pageInfo;

    return {
      regulations,
      pageInfo,
      pageNum: pageNum * 1,
    };
  }

  onChange = page => {
    router.push('/regulation?pageNum=' + page);
  };

  render() {
    const { pageNum, pageInfo } = this.props;

    return (
      <Platform title="Regulation" url="/images/ic_header_regulation.png">
        <div className="content-t flex flex-align">
          <p />
          <div className="flex flex-align">
            <img src="/images/ic_header_regulation_black.png" />
            <div>Regulation</div>
          </div>
          <p />
        </div>
        <div className="regulationContent-m">
          {this.props.regulations.map(item => (
            <ContentListItem key={item.id} title={item.title} content={item.content} />
          ))}
        </div>
        <div className="common-pagination">
          <Pagination
            current={pageNum}
            onChange={this.onChange}
            size="small"
            pageSize={10}
            total={pageInfo.totalResults}
          />
        </div>
      </Platform>
    );
  }
}
