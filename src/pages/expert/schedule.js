import React, { Component, createRef } from 'react';
import { Button, message } from 'antd';
import { connect } from 'react-redux';
import ContentLayoutExpert from '../../layouts/ContentLayoutExpert';
import ScheduleComponent from '../../components/Schedule';
import ContentHeader from '../../components/ContentHeader';
import api from '../../services/api';
import * as expertService from '../../services/expert';
import { cookieToJson } from '../../utils';
import './schedule.less';

export class Schedule extends Component {
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
        router.replace('/expert/login');
      }
    }

    const fetch = require('isomorphic-unfetch');

    const requestUrl = `${api.baseUrl}/api${api.getExpertScheduleByGreenwich}`;

    const expertScheduleRes = await fetch(`${requestUrl}?timeZone=${8}&userId=${userId}`);
    const expertScheduleContent = await expertScheduleRes.json();
    const expertSchedule = expertScheduleContent.data;

    const { schedule, startTime } = expertSchedule;

    return {
      schedule,
      startTime,
    };
  }

  scheduleComponent = createRef();

  state = {
    editMode: false,
  };

  saveSchedule = async () => {
    const scheduleData = this.scheduleComponent.current.exportSchedule();

    console.log(scheduleData);
    const { schedule, startTime, timeZone } = scheduleData;
    const { userInfo } = this.props;

    message.loading('保存中...');

    const res = await expertService.saveExpertSchedule({
      schedule,
      startTime,
      timeZone,
      userId: userInfo.userId,
    });

    message.destroy();
    if (res.code === '0') {
      message.success('保存成功!');
    } else {
      message.error(res.msg);
    }

    this.setState({ editMode: false });
  };

  componentDidMount = () => {
    if (this.props.schedule) {
      this.scheduleComponent.current.importSchedule(this.props.schedule);
    }
  };

  render() {
    const { editMode } = this.state;

    return (
      <ContentLayoutExpert title="Schedule" url="/images/ic_professor_schedule_white.png">
        <ContentHeader
          title="Schedule"
          image="/images/ic_professor_schedule.png"
          actions={
            editMode ? (
              <Button type="primary" size="small" onClick={this.saveSchedule}>
                Save
              </Button>
            ) : (
              <i className="iconfont" onClick={() => this.setState({ editMode: true })}>
                &#xe693;
              </i>
            )
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
          <ScheduleComponent ref={this.scheduleComponent} readOnly={!editMode} />
        </div>
      </ContentLayoutExpert>
    );
  }
}

export default connect(({ user }) => ({ userInfo: user.userInfo }))(Schedule);
