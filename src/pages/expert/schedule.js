import React, { Component, createRef } from 'react';
import { Button } from 'antd';
import { connect } from 'react-redux';
import ContentLayoutExpert from '../../layouts/ContentLayoutExpert';
import ScheduleComponent from '../../components/Schedule';
import ContentHeader from '../../components/ContentHeader';
import api from '../../services/api';
import * as expertService from '../../services/expert';
import './schedule.less';

export class Schedule extends Component {
  static async getInitialProps({ req, query }) {
    const fetch = require('isomorphic-unfetch');

    const requestUrl = 'http://172.16.1.161:8080/api' + api.getExpertScheduleByGreenwich;

    const expertScheduleRes = await fetch(`${requestUrl}?timeZone=${8}&userId=${'A000001'}`);
    const expertScheduleContent = await expertScheduleRes.json();
    const expertSchedule = expertScheduleContent.data;

    const { schedule, startTime } = expertSchedule;

    return {
      schedule,
      startTime,
    };
  }

  scheduleComponent = createRef();

  saveSchedule = async () => {
    const scheduleData = this.scheduleComponent.current.exportSchedule();

    console.log(scheduleData);
    const { schedule, startTime, timeZone } = scheduleData;
    const { userInfo } = this.props;
    const res = expertService.saveExpertSchedule({
      schedule,
      startTime,
      timeZone,
      userId: userInfo.userId,
    });

    console.log(res);
  };

  componentDidMount = () => {
    if (this.props.schedule) {
      this.scheduleComponent.current.importSchedule(this.props.schedule);
    }
  };

  render() {
    return (
      <ContentLayoutExpert>
        <ContentHeader
          actions={
            <Button type="primary" size="small" onClick={this.saveSchedule}>
              Save
            </Button>
          }
        />
        <div className="schedule-page">
          <div className="schedule-tip">
            为方便客户了解您的日程安排，请设置好最近7日的日程安排。
          </div>
          <div className="legend flex">
            <div className="legend-item flex flex-align">
              <span className="legend-color" />
              <span>可预约</span>
            </div>

            <div className="legend-item flex flex-align">
              <span className="legend-color disabled" />
              <span>不可预约</span>
            </div>
          </div>
          <ScheduleComponent ref={this.scheduleComponent} />
        </div>
      </ContentLayoutExpert>
    );
  }
}

export default connect(({ user }) => ({ userInfo: user.userInfo }))(Schedule);
