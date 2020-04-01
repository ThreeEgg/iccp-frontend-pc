import React from 'react';
import router from 'next/router';
import api from '../services/api';
import { platformContentType } from '../common/enum';
import { Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import ContentLayout from '../layouts/ContentLayout';
import { Pagination } from 'antd';
import './classic.less';

export default class Classic extends React.Component {
  static async getInitialProps({ req, query }) {
    const { pageNum = 1 } = query;
    const fetch = require('isomorphic-unfetch');

    const requestUrl = `${api.baseUrl}/api${api.listPlatformContent}`;
    //
    const classicCaseContentRes = await fetch(
      `${requestUrl}?languageId=0&pageNum=${pageNum}&pageSize=10&type=${
        platformContentType.CLASSICCASE
      }`,
    );
    const classicCaseContent = await classicCaseContentRes.json();
    const classicCases = classicCaseContent.data.items;
    const pageInfo = classicCaseContent.data.pageInfo;

    return {
      classicCases,
      pageInfo,
      pageNum: pageNum * 1,
    };
  }

  onChange = page => {
    router.push('/classic?pageNum=' + page);
  };

  render() {
    const { classicCases, pageNum, pageInfo } = this.props;

    return (
      <ContentLayout title="Classic Case" url="/images/ic_header_classcase.png">
        <div className="content-t flex flex-align">
          <p />
          <div className="flex flex-align">
            <img src="/images/ic_header_classcase_black.png" />
            <div>Classic Case</div>
          </div>
          <p />
        </div>
        <div className="classicContent-m">
          {classicCases.map(item => {
            return (
              <div className="cla-item flex flex-justifyBetween" key={item.id}>
                <div className="cla-item-text">
                  <h1>{item.title}</h1>
                  <div className="cla-item-content">{item.content}</div>
                  <div className="cla-more-btn" onClick={this.goToArticle}>
                    More
                    <RightOutlined style={{ fontSize: '12px' }} />
                  </div>
                </div>
                <img src={item.image} />
              </div>
            );
          })}
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
      </ContentLayout>
    );
  }
}
