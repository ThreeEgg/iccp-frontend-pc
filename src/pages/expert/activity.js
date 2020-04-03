import React, { Component } from 'react';
import { Button, message, Input, Pagination } from 'antd';
import router from 'next/router';
import ContentLayoutExpert from '../../layouts/ContentLayoutExpert';
import ContentHeader from '../../components/ContentHeader';
import Timeline from '../../components/Timeline';
import api from '../../services/api';
import * as expertService from '../../services/expert';
import { cookieToJson } from '../../utils';
import './activity.less';

export class Activity extends Component {
  static async getInitialProps({ req, query }) {
    let userId;
    if (req) {
      // SSR
      const { cookie } = req.headers;

      userId = cookieToJson(cookie).userId;
    } else {
      // 客户端
      if (localStorage.userInfo) {
        userId = JSON.parse(localStorage.userInfo).userId;
      } else {
        window.location.href = '/expert/login';
      }
    }

    const { pageNum = 1 } = query;
    const fetch = require('isomorphic-unfetch');

    const requestUrl = `${api.baseUrl}/api${api.getExpertActivityList}`;

    const activityContentRes = await fetch(
      `${requestUrl}?pageNum=${pageNum}&pageSize=10&userId=${userId}`,
    );
    const activityContent = await activityContentRes.json();
    const activity = activityContent.data.items;
    const pageInfo = activityContent.data.pageInfo;

    return {
      activity,
      pageInfo,
      pageNum: pageNum * 1,
    };
  }

  state = {
    publishContent: '',
  };

  onChange = page => {
    router.push('/expert/activity?pageNum=' + page);
  };

  publishActivity = async () => {
    const { publishContent } = this.state;
    message.loading('发布中');
    const res = await expertService.saveExpertActivity({
      activity: publishContent,
    });

    message.destroy();
    if (res.code === '0') {
      message.success('已发布');
      window.location.reload();
    }
  };

  onPublishContentChange = e => {
    let str = e.target.value;
    if (str.length > 140) {
      str = str.slice(0, 140);
    }
    this.setState({
      publishContent: str,
    });
  };

  render() {
    const { activity, pageNum, pageInfo } = this.props;
    const { publishContent } = this.state;

    return (
      <ContentLayoutExpert
        className="expert-activity"
        title="My Dynamic"
        url="/images/ic_professor_dynamic.png"
      >
        <div className="fixed-header">
          <ContentHeader title="My Dynamic" image="/images/ic_professor_dynamic_black.png" />
          <div className="dynamic-textarea">
            <Input.TextArea
              placeholder="发布请输入内容小于140字"
              rows={4}
              value={publishContent}
              onChange={this.onPublishContentChange}
            />
            <div className="publish-btn flex flex-justifyEnd">
              {publishContent.length} / 140 &nbsp;&nbsp;
              <Button
                type="primary"
                size="small"
                onClick={this.publishActivity}
                disabled={!publishContent.length}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
        <div className="dynamic-list flex flex-column flex-align">
          <Timeline data={activity} />
        </div>
        {/* 分页器 */}
        <div className="common-pagination">
          <Pagination
            current={pageNum}
            onChange={this.onChange}
            size="small"
            pageSize={10}
            total={pageInfo.totalResults}
          />
        </div>
      </ContentLayoutExpert>
    );
  }
}

export default Activity;
