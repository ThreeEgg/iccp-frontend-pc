import React, { Component } from 'react';
import moment from 'moment';
import ScheduleTable from './ScheduleTable';

export class Schedule extends Component {
  state = {};

  parseSchedule = () => {
    const scheduleString = Array(2 * 7 * 24)
      .fill(0)
      .map(item => parseInt(Math.random() * 10) % 2)
      .join('');

    // 算出当地本周的0点
  };

  // 设置日程表
  exportSchedule = matrixData => {
    // 当地本周第一天的8小时，为开始时间
    const startTime = moment()
      .startOf('week')
      .hours(8)
      .format();
    console.log(startTime);

    // 从矩阵算出相应的日程字符串
  };

  onCurrentWeekChange = (rowIndex, colIndex, matrixData) => {
    console.log(rowIndex, colIndex, matrixData);
    this.exportSchedule(matrixData);
  };

  componentDidMount = () => {
    this.parseSchedule();
    window.moment = moment;
  };

  render() {
    return (
      <div>
        {/* 编辑模式 */}
        <ScheduleTable onChange={this.onCurrentWeekChange} />
        <ScheduleTable />
      </div>
    );
  }
}

export default Schedule;
