import React from 'react';
import ContentLayout from '../layouts/ContentLayout';
import { Button, Calendar, Rate, Modal, Tabs } from 'antd';
import Router from 'next/router';
import { Pagination } from 'antd';
import ScheduleTable from '../components/ScheduleTable';
import './professor.less';
const { TabPane } = Tabs;

export default class Platform extends React.Component {
  state = {
    current: 1,
    scheduleVisible: true,
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

  showSchedule = () => {
    this.setState({
      scheduleVisible: true,
    });
  };

  render() {
    return (
      <ContentLayout
        hideSider
        className="professor-detail-page"
        url="/images/ic_hearder_Professor.png"
        title="Professor Detail"
      >
        <div className="con-pro-r">
          <div className="con-pro-r-img">
            <img className="img-avatar" src="/images/img_cardbg_hover.png" />
            <img className="img-type" src="/images/ic_online.png" />
          </div>
          <div className="con-pro-r-name">Steven Jackson</div>
          <div className="con-pro-r-status">最近在线：现在</div>
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
                <div className="pro-essay-item">
                  <h1>国际征信业务通论</h1>
                  <p>
                    Consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida
                    dolor sit amet lacus accumsan et viverra justo commodo
                  </p>
                </div>
                <div className="pro-essay-item">
                  <h1>国际征信业务通论</h1>
                  <p>
                    Consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida
                    dolor sit amet lacus accumsan et viverra justo commodo
                  </p>
                </div>
              </TabPane>
              <TabPane tab="专家详情" key="3">
                <div className="pro-info">
                  <div className="pro-info-item">
                    <h1>国际征信业务通论</h1>
                    <p>
                      Consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida
                      dolor sit amet lacus accumsan et viverra justo commodo
                    </p>
                    <div className="flex">
                      <img src="/images/case/card1.png" />
                      <img src="/images/case/card2.png" />
                      <img src="/images/case/card2.png" />
                    </div>
                  </div>
                  <div className="pro-info-item">
                    <h1>国际征信业务通论</h1>
                    <p>
                      Consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida
                      dolor sit amet lacus accumsan et viverra justo commodo
                    </p>
                    <div className="flex">
                      <img src="/images/case/card1.png" />
                      <img src="/images/case/card2.png" />
                    </div>
                  </div>
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
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum
            laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo.
          </p>
          <div
            className="con-pro-r-list flex flex-align flex-justifyBetween"
            onClick={this.timeList}
          >
            服务标签
            <img src="/images/ic_tag.png" />
          </div>
          <div className="con-pro-r-label">
            <span>Commercial debt</span>
            <span>Lawyer’s letter</span>
            <span>Credit investigation</span>
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
              综合评分
              <Rate disabled defaultValue={4} />
            </div>
            <div>
              服务态度
              <Rate disabled defaultValue={5} />
            </div>
            <div>
              专业能力
              <Rate disabled defaultValue={3} />
            </div>
            <div>
              回复速度
              <Rate disabled defaultValue={2} />
            </div>
          </div>
        </div>

        {/* 时间表 */}
        <Modal visible={this.state.scheduleVisible}>
          <ScheduleTable />
        </Modal>
      </ContentLayout>
    );
  }
}
