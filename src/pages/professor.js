import React from 'react';
import ContentLayout from '../layouts/ContentLayout';
import { Button, Calendar, Modal, Tabs } from 'antd';
import classNames from 'classnames';
import router from 'next/router';
import { Pagination } from 'antd';
import Swiper from 'react-id-swiper';
import 'swiper/css/swiper.css';
import _ from 'lodash';
import { getResponseRateAverage } from '../common/index';
import api from '../services/api';
import Schedule from '../components/Schedule';
import Timeline from '../components/Timeline';
import Rate from '../components/Rate';
import './professor.less';

const { TabPane } = Tabs;

export default class Platform extends React.Component {
  static async getInitialProps({ req, query }) {
    const { id = 'A000001', tabName = 'activity', articleId } = query;
    const fetch = require('isomorphic-unfetch');

    const requestUrl = `${api.baseUrl}/api${api.getExpertHomePage}`;

    const expertInfoRes = await fetch(`${requestUrl}?userId=${id}`);
    const expertInfoContent = await expertInfoRes.json();

    // 专家动态
    const activityRes = await fetch(
      `${api.baseUrl}/api${api.getExpertActivityList}?userId=${id}&pageSize=10&pageNum=1`,
    );
    const activityContent = await activityRes.json();
    const activity = activityContent.data.items;

    // 专家文章
    const articleRes = await fetch(
      `${api.baseUrl}/api${api.getExpertArticleList}?userId=${id}&pageSize=10&pageNum=1`,
    );
    const articleContent = await articleRes.json();
    const article = articleContent.data.items;

    let articleDetail;
    if (articleId) {
      const articleDetailRes = await fetch(
        `${api.baseUrl}/api${api.getExpertArticleById}?id=${articleId}`,
      );
      const articleDetailContent = await articleDetailRes.json();
      articleDetail = articleDetailContent.data;
    }

    const {
      name,
      image,
      introduction,
      serviceTagList,
      attitudeRateAVG,
      skillRateAVG,
      responseSpeed,
      content,
      schedule,
      cname,
      onlineState,
      accid,
    } = expertInfoContent.data;

    return {
      tabName,
      introduction,
      serviceTag: serviceTagList,
      information: content ? JSON.parse(content) : [],
      userInfo: {
        name,
        image,
      },
      cname,
      schedule,
      rating: {
        attitudeRateAVG,
        skillRateAVG,
        responseSpeed,
      },
      article,
      articleId,
      articleDetail,
      activity,
      imUser: {
        onlineState,
        accid,
      },
    };
  }

  state = {
    current: 1,
    scheduleVisible: false,
  };

  onChange = page => {
    console.log(page);
    this.setState({
      current: page,
    });
  };

  changeTab = key => {
    let targetUrl = window.location.pathname + window.location.search;

    if (targetUrl.match('tabName')) {
      targetUrl = targetUrl.replace(/tabName=[^&]+/, `tabName=${key}`);
    } else {
      targetUrl += `&tabName=${key}`;
    }

    router.push(targetUrl);
  };

  gotoArticleDetail = articleId => {
    const targetUrl = window.location.pathname + window.location.search + '&articleId=' + articleId;

    router.push(targetUrl);
  };

  backFromArticleDetail = () => {
    let targetUrl = window.location.pathname + window.location.search;

    if (targetUrl.match('articleId')) {
      targetUrl = targetUrl.replace(/&?articleId=[^&]+/, '');
    }

    router.push(targetUrl);
  };

  goToCommunication = () => {
    router.push('');
  };

  showSchedule = (scheduleVisible = true) => {
    this.setState({
      scheduleVisible,
    });
  };

  render() {
    const {
      introduction,
      serviceTag,
      information,
      userInfo,
      imUser,
      schedule,
      rating,
      article,
      activity,
      tabName,
      articleDetail,
    } = this.props;

    const { attitudeRateAVG, skillRateAVG, responseSpeed } = rating;
    let responseRateAVG = getResponseRateAverage(responseSpeed);
    const averageRate = (attitudeRateAVG + skillRateAVG + responseRateAVG) / 3;

    return (
      <ContentLayout
        hideSider
        className="professor-detail-page"
        url="/images/ic_hearder_Professor.png"
        title="Professor Detail"
      >
        <div className="con-pro-r">
          <div className="con-pro-r-img">
            <img className="img-avatar" src={userInfo.image} />
            <i className={classNames('img-type iconfont', { active: imUser.onlineState === 0 })}>
              &#xe68b;
            </i>
          </div>
          <div className="con-pro-r-name">{userInfo.name}</div>
          <div className="con-pro-r-status">最近在线：无</div>
          <Button onClick={this.goToCommunication}>立即沟通</Button>
          <div className="con-pro-r-title">本月日程</div>
          <div className="con-pro-r-time">
            <div className="time-date">Mar 2020</div>
            <div className="site-calendar-demo-card">
              <Calendar fullscreen={false} />
            </div>
          </div>
          <div
            className="con-pro-r-list flex flex-align flex-justifyBetween"
            onClick={this.showSchedule}
          >
            查看专家时间表
            <img src="/images/ic_date.png" />
          </div>
        </div>
        <div className="con-pro-m">
          <div className="con-pro-m-title">
            {!articleDetail ? (
              <Tabs activeKey={tabName} onChange={this.changeTab}>
                <TabPane tab="专家动态" key="activity">
                  <Timeline data={activity} />
                  <div className="common-pagination">
                    <Pagination
                      current={this.state.current}
                      onChange={this.onChange}
                      size="small"
                      total={50}
                    />
                  </div>
                </TabPane>
                <TabPane tab="专家文章" key="article">
                  {article.map(item => {
                    return (
                      <div
                        className="pro-essay-item"
                        key={item.id}
                        onClick={() => this.gotoArticleDetail(item.id)}
                      >
                        <h1>{item.title}</h1>
                        <p>{item.brief}</p>
                      </div>
                    );
                  })}
                  <div className="common-pagination">
                    <Pagination
                      current={this.state.current}
                      onChange={this.onChange}
                      size="small"
                      total={50}
                    />
                  </div>
                </TabPane>
                <TabPane tab="专家详情" key="information">
                  <div className="pro-info">
                    {information.map(item => {
                      return (
                        <div className="pro-info-item" key={item.id}>
                          <h1>{item.title}</h1>
                          <p>{item.content}</p>
                          <div>
                            <Swiper
                              {...{
                                slidesPerView: 3,
                                spaceBetween: 30,
                                grabCursor: true,
                                navigation:
                                  item.images.length > 3
                                    ? {
                                        nextEl: '.swiper-button-next',
                                        prevEl: '.swiper-button-prev',
                                      }
                                    : {},
                              }}
                            >
                              {item.images.map(url => (
                                <div
                                  key={url}
                                  className="swiper-img-container"
                                  style={{ backgroundImage: `url(${url})` }}
                                />
                              ))}
                            </Swiper>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </TabPane>
              </Tabs>
            ) : (
              // 文章详情
              <div className="article-detail grey-shadow">
                {/* 返回按钮 */}
                <img
                  className="back-btn"
                  src="/images/ic_header_leadback.png"
                  onClick={this.backFromArticleDetail}
                />
                <h1 className="article-title">{articleDetail.title}</h1>
                <h2 className="article-brief">{articleDetail.brief}</h2>
                <div
                  className="article-rich-text"
                  dangerouslySetInnerHTML={{ __html: _.unescape(articleDetail.article || '') }}
                />
              </div>
            )}
          </div>
        </div>
        <div className="con-pro-l">
          <div
            className="con-pro-r-list flex flex-align flex-justifyBetween"
            onClick={this.timeList}
          >
            专家简介
            <img src="/images/ic_breif.png" />
          </div>
          <p>{introduction}</p>
          <div
            className="con-pro-r-list flex flex-align flex-justifyBetween"
            onClick={this.timeList}
          >
            服务标签
            <img src="/images/ic_tag.png" />
          </div>
          <div className="con-pro-r-label">
            {serviceTag.map(tag => (
              <span key={tag.id}>{tag.chineseContent}</span>
            ))}
          </div>
          <div
            className="con-pro-r-list flex flex-align flex-justifyBetween"
            onClick={this.timeList}
          >
            服务评价
            <img src="/images/ic_evaluate.png" />
          </div>
          <div className="con-pro-r-rate">
            <div>
              综合评分 &nbsp;&nbsp;
              <Rate value={averageRate} max={3} />
            </div>
            <div>
              服务态度 &nbsp;&nbsp;
              <Rate value={attitudeRateAVG} max={3} />
            </div>
            <div>
              专业能力 &nbsp;&nbsp;
              <Rate value={skillRateAVG} max={3} />
            </div>
            <div>
              回复速度 &nbsp;&nbsp;
              <Rate value={responseRateAVG} max={3} />
            </div>
          </div>
        </div>

        {/* 时间表 */}
        <Modal
          visible={this.state.scheduleVisible}
          width={720}
          onCancel={() => this.showSchedule(false)}
        >
          <Schedule mode="read" schedule={schedule} />
        </Modal>
      </ContentLayout>
    );
  }
}
