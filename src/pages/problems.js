import React from 'react';
import api from '../services/api';
import { platformContentType } from '../common/enum';
import ContentLayout from '../layouts/ContentLayout';
import { Pagination } from 'antd';
import router from 'next/router';
import ContentListItem from '../components/ListItem/ContentListItem';
import './problems.less';

export default class Problems extends React.Component {
  static async getInitialProps({ req, query }) {
    const { pageNum = 1 } = query;
    const fetch = require('isomorphic-unfetch');

    const requestUrl = `${api.baseUrl}/api${api.listPlatformContent}`;
    //
    const problemContentRes = await fetch(
      `${requestUrl}?languageId=0&pageNum=${pageNum}&pageSize=10&type=${
        platformContentType.COMMONQUESTION
      }`,
    );
    const problemContent = await problemContentRes.json();
    const problems = problemContent.data.items;
    const pageInfo = problemContent.data.pageInfo;

    return {
      problems,
      pageInfo,
      pageNum: pageNum * 1,
    };
  }

  onChange = page => {
    router.push('/problems?pageNum=' + page);
  };

  render() {
    const { pageNum, pageInfo } = this.props;
    return (
      <Platform title="problems" url="/images/ic_header_problems.png">
        <div className="content-t flex flex-align">
          <p />
          <div className="flex flex-align">
            <img src="/images/ic_header_problems_black.png" />
            <div>problems</div>
          </div>
          <p />
        </div>
        <div className="problemsContent-m">
          {this.props.problems.map(item => (
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
