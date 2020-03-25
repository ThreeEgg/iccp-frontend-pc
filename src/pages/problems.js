import React from 'react';
import api from '../services/api';
import { platformContentType } from '../common/enum';
import Platform from '../layouts/platformIndex';
import { Pagination } from 'antd';
import router from 'next/router';
import './problems.less';

export default class Problems extends React.Component {
  static async getInitialProps({ req, query }) {
    const { pageNum = 1 } = query;
    const fetch = require('isomorphic-unfetch');

    const requestUrl = 'http://221.215.57.110:9090/api' + api.listPlatformContent;
    //
    const problemContentRes = await fetch(
      `${requestUrl}?pageNum=${pageNum}&pageSize=10&type=${platformContentType.COMMONQUESTION}`,
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

  state = {
    current: 1,
  };

  onChange = page => {
    router.push('/problems?pageNum=' + page);
  };

  render() {
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
            <div className="coo-item" key={item.id}>
              <h1>《国际贸易法》解释</h1>
              <div className="coo-text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum
                laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin
                sodales pulvinar sic tempor. Lorem ipsum dolor sit amet, consectetur adipiscing
                elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan
                et viverra justo commodo. Proin sodales pulvinar sic tempor.
              </div>
              <div className="coo-more">More</div>
            </div>
          ))}
        </div>
        <div className="common-pagination">
          <Pagination
            current={this.props.pageNum}
            onChange={this.onChange}
            size="small"
            pageSize={10}
            total={this.props.pageInfo.totalResults}
          />
        </div>
      </Platform>
    );
  }
}
