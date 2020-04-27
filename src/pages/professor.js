import React, { Fragment } from 'react';
import ContentLayout from '../layouts/ContentLayout';
import { Button, Calendar, Modal, Tabs, message } from 'antd';
import classNames from 'classnames';
import router from 'next/router';
import { Pagination } from 'antd';
import Swiper from 'react-id-swiper';
import 'swiper/css/swiper.css';
import _ from 'lodash';
import moment from 'moment';
import { getResponseRateAverage } from '../common/index';
import { connect } from 'react-redux';
import { onlineStateEnum } from '../common/enum';
import api from '../services/api';
import Schedule from '../components/Schedule';
import Timeline from '../components/Timeline';
import Rate from '../components/Rate';
import './professor.less';

const { TabPane } = Tabs;

class Professor extends React.Component {
  static async getInitialProps({ req, query }) {
    const { id, tabName = 'activity', articleId, pageNum = 1 } = query;
    const fetch = require('isomorphic-unfetch');

    const requestUrl = `${api.baseUrl}/api${api.getExpertHomePage}`;

    const expertInfoRes = await fetch(`${requestUrl}?userId=${id}`);
    const expertInfoContent = await expertInfoRes.json();

    let pageInfo = {};

    let activity;
    if (!tabName || tabName == 'activity') {
      // 专家动态
      const activityRes = await fetch(
        `${api.baseUrl}/api${api.getExpertActivityList}?userId=${id}&pageSize=10&pageNum=${pageNum}`,
      );
      const activityContent = await activityRes.json();
      activity = activityContent.data.items;
      pageInfo = activityContent.data.pageInfo;
    }

    let article;
    if (tabName === 'article') {
      // 专家文章
      const articleRes = await fetch(
        `${api.baseUrl}/api${api.getExpertArticleList}?userId=${id}&pageSize=10&pageNum=${pageNum}`,
      );
      const articleContent = await articleRes.json();
      article = articleContent.data.items;
      pageInfo = articleContent.data.pageInfo;
    }

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
      // im状态变化时间
      eventTime,
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
        eventTime,
      },
      pageNum,
      pageInfo,
    };
  }

  state = {
    current: 1,
    scheduleVisible: false,
  };

  onPageChange = (page) => {
    let targetUrl = window.location.pathname + window.location.search;

    if (targetUrl.match('pageNum')) {
      targetUrl = targetUrl.replace(/pageNum=[^&]+/, `pageNum=${page}`);
    } else {
      targetUrl += `&pageNum=${page}`;
    }

    router.push(targetUrl);
  };

  changeTab = (key) => {
    let targetUrl = window.location.pathname + window.location.search;

    if (targetUrl.match('tabName')) {
      targetUrl = targetUrl.replace(/tabName=[^&]+/, `tabName=${key}`);
    } else {
      targetUrl += `&tabName=${key}`;
    }

    router.push(targetUrl);
  };

  gotoArticleDetail = (articleId) => {
    const targetUrl = window.location.pathname + window.location.search + '&articleId=' + articleId;

    router.push(targetUrl);
  };

  onArticleClick = (articleInfo) => {
    this.gotoArticleDetail(articleInfo.id);
  };

  backFromArticleDetail = () => {
    let targetUrl = window.location.pathname + window.location.search;

    if (targetUrl.match('articleId')) {
      targetUrl = targetUrl.replace(/&?articleId=[^&]+/, '');
    }

    router.push(targetUrl);
  };

  goToCommunication = (accid) => {
    message.loading('正在连线...');
    this.props
      .dispatch({
        type: 'im/initSession',
        expertAccid: accid,
        userAccid: this.props.imInfo.accid,
        to: accid,
      })
      .then(() => {
        message.destroy();
        this.props.dispatch({
          type: 'app/showChat',
        });
      });
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
      rating = {},
      article,
      activity,
      tabName,
      articleDetail,
      pageNum,
      pageInfo,
    } = this.props;

    const { attitudeRateAVG, skillRateAVG, responseSpeed } = rating;
    let responseRateAVG = getResponseRateAverage(responseSpeed);
    const averageRate = (attitudeRateAVG + skillRateAVG + responseRateAVG) / 3;

    // 最近在线时间距今
    // 小于24小时：n小时内；
    // 大于等于24小时到7天：n天内；
    // 大于等于7天小于28天：n周内；
    // 大于等于28天：不展示；
    // 没有该字段，也不展示
    let onlineTime;
    if (imUser.eventTime) {
      const eventOnlineTime = new Date(imUser.eventTime);
      const eventOnlineTimestamp = Date.parse(eventOnlineTime);
      const currentTime = Date.now();
      const timeOffset = currentTime - eventOnlineTimestamp;
      if (timeOffset < 86400000) {
        onlineTime = moment(new Date(timeOffset)).hour() + '小时内';
      } else if (timeOffset < 604800000) {
        onlineTime = moment(new Date(timeOffset)).day() + '天内';
      } else if (timeOffset < 2419200000) {
        onlineTime = moment(new Date(timeOffset)).week() + '周内';
      }
    }

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
          {onlineTime ? <div className="con-pro-r-status">最近在线：{onlineTime}</div> : null}
          <Button onClick={() => this.goToCommunication(imUser.accid)}>立即沟通</Button>

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
            {serviceTag.map((tag) => (
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
        <div className="con-pro-m">
          <div className="con-pro-m-title">
            {!articleDetail ? (
              <Tabs activeKey={tabName} animated={false} onChange={this.changeTab}>
                <TabPane tab="专家动态" key="activity">
                  <div className="con-pro-activity">
                    <Timeline data={activity} onArticleClick={this.onArticleClick} />
                    <div className="common-pagination">
                      <Pagination
                        current={pageNum}
                        onChange={this.onPageChange}
                        size="small"
                        pageSize={10}
                        total={pageInfo.totalResults}
                      />
                    </div>
                  </div>
                </TabPane>
                <TabPane tab="专家文章" key="article">
                  {article && (
                    <Fragment>
                      {article.map((item) => {
                        return (
                          <div className="pro-essay-item" key={item.id}>
                            <h1>{item.title}</h1>
                            <p>{item.brief}</p>
                            <div className="show-more">
                              <span onClick={() => this.gotoArticleDetail(item.id)}>查看全文</span>
                            </div>
                          </div>
                        );
                      })}
                      <div className="common-pagination">
                        <Pagination
                          current={pageNum}
                          onChange={this.onPageChange}
                          size="small"
                          pageSize={10}
                          total={pageInfo.totalResults}
                        />
                      </div>
                    </Fragment>
                  )}
                </TabPane>
                <TabPane tab="专家详情" key="information">
                  <div className="pro-info">
                    {information.map((item) => {
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
                              {item.images.map((url) => (
                                <div
                                  key={url}
                                  className="swiper-img-container"
                                  style={{ backgroundImage: `url(${url})` }}
                                  onClick={() => {
                                    if (typeof window !== undefined) {
                                      const Zmage = require('react-zmage');
                                      console.log(Zmage);
                                      Zmage.default.browsing({ src: url });
                                    }
                                  }}
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
          <div className="con-pro-r-title">本月日程</div>
          <div className="con-pro-r-time">
            <div className="time-date">{moment().format('MMM YYYY')}</div>
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

        {/* 时间表 */}
        <Modal
          visible={this.state.scheduleVisible}
          width={720}
          closable={false}
          onCancel={() => this.showSchedule(false)}
        >
          <Schedule mode="read" schedule={schedule} />
        </Modal>
      </ContentLayout>
    );
  }
}

export default connect(({ user }) => ({
  imInfo: user.imInfo,
}))(Professor);
