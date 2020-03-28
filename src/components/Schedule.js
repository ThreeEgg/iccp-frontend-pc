import React, { Component, Fragment, createRef } from 'react';
import { Button } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import ScheduleTable from './ScheduleTable';

const weekDayNameMap = {
  1: '周一',
  2: '周二',
  3: '周三',
  4: '周四',
  5: '周五',
  6: '周六',
  7: '周日',
};

export class Schedule extends Component {
  sche1 = createRef();
  sche2 = createRef();

  scheduleMatrixData1 = [];
  scheduleMatrixData2 = [];

  state = {};

  parseSchedule = scheduleString => {
    // 算出当地本周的0点
    // 从矩阵算出相应的日程字符串
    // 行、列，行数*24+列数+8
    const parseScheduleData = [];
    scheduleString.split('').forEach((item, index) => {
      if (item !== '1') {
        return;
      }
      const scheduleIndex = parseInt(index / (7 * 24));
      if (!parseScheduleData[scheduleIndex]) {
        parseScheduleData[scheduleIndex] = [];
      }
      index = index % (7 * 24);
      const rowIndex = parseInt(index / 24);
      const colIndex = (index % 24) - 8;
      parseScheduleData[scheduleIndex].push(`${rowIndex}_${colIndex}`);
    });
    return parseScheduleData;
  };

  importSchedule = scheduleString => {
    const scheduleMatrixData1 = this.parseSchedule(scheduleString)[0] || [];
    const scheduleMatrixData2 = this.parseSchedule(scheduleString)[1] || [];
    this.scheduleMatrixData1 = scheduleMatrixData1;
    this.scheduleMatrixData2 = scheduleMatrixData2;
    this.sche1.current.setActiveGrid(scheduleMatrixData1);
    this.sche2.current.setActiveGrid(scheduleMatrixData2);
  };

  // 设置日程表
  exportSchedule = () => {
    const { scheduleMatrixData1, scheduleMatrixData2 } = this;
    // 当地本周第一天的8小时，为开始时间
    const startTime =
      Date.parse(
        moment()
          .startOf('week')
          .hours(8)
          .toDate(),
      ) / 1000;

    // 从矩阵算出相应的日程字符串
    // 行、列，行数*24+列数+8
    const scheduleArray = Array(2 * 7 * 24).fill(0);
    scheduleMatrixData1.forEach(key => {
      const [rowIndex, colIndex] = key.split('_');
      const index = rowIndex * 24 + 8 + parseInt(colIndex);
      scheduleArray[index] = 1;
    });

    // 第二周增加7*24偏差
    scheduleMatrixData2.forEach(key => {
      const [rowIndex, colIndex] = key.split('_');
      const index = rowIndex * 24 + 8 + parseInt(colIndex) + 7 * 24;
      scheduleArray[index] = 1;
    });

    this.scheduleString = scheduleArray.join('');

    return {
      startTime,
      schedule: scheduleArray.join(''),
      timeZone: moment().utcOffset() / 60,
    };
  };

  onCurrentWeekChange = (rowIndex, colIndex, matrixData) => {
    this.scheduleMatrixData1 = Array.from(matrixData);
  };

  onNextWeekChange = (rowIndex, colIndex, matrixData) => {
    this.scheduleMatrixData2 = Array.from(matrixData);
  };

  renderCurrentWeekRowHeader = rowIndex => {
    const time = moment()
      .startOf('week')
      .days(rowIndex);
    return (
      <span>
        {time.format('M月D日')}
        <br />
        {weekDayNameMap[time.format('E')]}
      </span>
    );
  };

  renderNextWeekRowHeader = rowIndex => {
    const time = moment()
      .startOf('week')
      .days(rowIndex + 7);
    return (
      <span>
        {time.format('M月D日')}
        <br />
        {weekDayNameMap[time.format('E')]}
      </span>
    );
  };

  componentDidMount = () => {
    // this.parseSchedule();
    // window.moment = moment;
  };

  render() {
    const { mode } = this.props;
    return (
      <div>
        {/* <Button onClick={this.exportSchedule}>导出</Button>
        <Button onClick={() => this.importSchedule(this.scheduleString)}>导入</Button>
        <Button
          onClick={() => {
            this.sche1.current.clear();
            this.sche2.current.clear();
          }}
          >
          清空
        </Button> */}
        {/* 编辑模式 */}
        {mode === 'edit' ? (
          <Fragment>
            <ScheduleTable
              ref={this.sche1}
              onChange={this.onCurrentWeekChange}
              rowCount={7}
              colCount={12}
              renderRowHeader={this.renderCurrentWeekRowHeader}
              renderLeftTop={() => '本周'}
            />
            <ScheduleTable
              ref={this.sche2}
              onChange={this.onNextWeekChange}
              rowCount={7}
              colCount={12}
              renderRowHeader={this.renderNextWeekRowHeader}
              renderLeftTop={() => '下周'}
            />
          </Fragment>
        ) : (
          <Fragment>
            <ScheduleTable
              ref={this.sche1}
              onChange={this.onCurrentWeekChange}
              rowCount={7}
              colCount={24}
            />
            <ScheduleTable
              ref={this.sche2}
              onChange={this.onNextWeekChange}
              rowCount={7}
              colCount={24}
            />
          </Fragment>
        )}
      </div>
    );
  }
}

Schedule.propTypes = {
  // 显示模式，
  mode: PropTypes.oneOf(['edit', 'show']),
};

Schedule.defaultProps = {
  mode: 'edit',
};

export default Schedule;
