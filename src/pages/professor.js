import React from 'react';
import ContentLayout from '../layouts/ContentLayout';
import { Button, Calendar, Modal, Tabs } from 'antd';
import classNames from 'classnames';
import Router from 'next/router';
import { Pagination } from 'antd';
import Swiper from 'react-id-swiper';
import 'swiper/css/swiper.css';
import { getResponseRateAverage } from '../common/index';
import api from '../services/api';
import Schedule from '../components/Schedule';
import Rate from '../components/Rate';
import './professor.less';

const { TabPane } = Tabs;

export default class Platform extends React.Component {
  static async getInitialProps({ req, query }) {
    const { id = 'A000001' } = query;
    const fetch = require('isomorphic-unfetch');

    const requestUrl = `${api.baseUrl}/api${api.getExpertHomePage}`;

    const expertInfoRes = await fetch(`${requestUrl}?userId=${id}`);
    const expertInfoContent = await expertInfoRes.json();

    // 专家动态
    const activityRes = await fetch(
      `${api.baseUrl}/api${api.getExpertActivityList}?userId=${id}&pageSize=1&pageNum=10`,
    );
    const activityContent = await activityRes.json();
    const activity = activityContent.data.items;

    // 专家文章
    const articleRes = await fetch(
      `${api.baseUrl}/api${api.getExpertArticleList}?userId=${id}&pageSize=1&pageNum=10`,
    );
    const articleContent = await articleRes.json();
    const article = articleContent.data.items;

    const {
      baseInfo,
      schedule,
      serviceTagList,
      rating,
      information = {},
      briefIntro,
      imUser,
    } = expertInfoContent.data;

    return {
      introduction: briefIntro.introduction,
      serviceTag: serviceTagList,
      information: information.content ? JSON.parse(information.content) : [],
      userInfo: baseInfo,
      schedule,
      rating,
      article,
      activity,
      imUser,
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

  goToCommunication = () => {
    Router.push('');
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
            <Tabs defaultActiveKey="1">
              <TabPane tab="专家动态" key="1">
                <div className="pro-statu-item">
                  <div className="statu-con">
                    <div className="statu-title flex flex-align">
                      <span className="statu-year">2020</span>
                      <div>
                        <p className="statu-monthNo">04</p>
                        <p className="statu-monthEN">Jan</p>
                      </div>
                    </div>
                    <div className="statu-text">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      <span>20:41</span>
                      <div className="statu-circle-big" />
                    </div>
                    <div className="statu-text">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      <span>20:41</span>
                      <div className="statu-circle-small" />
                    </div>
                  </div>
                </div>
                <div className="pro-statu-item">
                  <div className="statu-con">
                    <div className="statu-title flex flex-align">
                      <span className="statu-year">2020</span>
                      <div>
                        <p className="statu-monthNo">03</p>
                        <p className="statu-monthEN">Mar</p>
                      </div>
                    </div>
                    <div className="statu-text">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod
                      bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo
                      commodo.
                      <span>20:41</span>
                      <div className="statu-circle-big" />
                    </div>
                    <div className="statu-text">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      <span>20:41</span>
                      <div className="statu-circle-small" />
                    </div>
                  </div>
                </div>
              </TabPane>
              <TabPane tab="专家文章" key="2">
                {article.map(item => {
                  return (
                    <div className="pro-essay-item" key={item.id}>
                      <h1>国际征信业务通论</h1>
                      <p>
                        Consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida
                        dolor sit amet lacus accumsan et viverra justo commodo
                      </p>
                    </div>
                  );
                })}
              </TabPane>
              <TabPane tab="专家详情" key="3">
                <div className="pro-info">
                  {information.map(item => {
                    return (
                      <div className="pro-info-item">
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
            <div className="common-pagination">
              <Pagination
                current={this.state.current}
                onChange={this.onChange}
                size="small"
                total={50}
              />
            </div>
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
          <Schedule mode="read" schedule={schedule.schedule} />
        </Modal>
      </ContentLayout>
    );
  }
}
