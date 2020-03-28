import React, { Component, createRef } from 'react';
import { Button } from 'antd';
import moment from 'moment';
import ScheduleTable from './ScheduleTable';

export class Schedule extends Component {
  sche1 = createRef();
  sche2 = createRef();

  scheduleMatrixData = [];

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

  importSchedule = () => {
    console.log(this.parseSchedule(this.scheduleString));
    this.sche1.current.setActiveGrid(this.parseSchedule(this.scheduleString)[0]);
    this.sche2.current.setActiveGrid(this.parseSchedule(this.scheduleString)[1]);
  };

  // 设置日程表
  exportSchedule = () => {
    const { scheduleMatrixData1, scheduleMatrixData2 } = this;
    // 当地本周第一天的8小时，为开始时间
    const startTime = moment()
      .startOf('week')
      .hours(8)
      .format();

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
    };
  };

  onCurrentWeekChange = (rowIndex, colIndex, matrixData) => {
    console.log(rowIndex, colIndex, matrixData);
    this.scheduleMatrixData1 = Array.from(matrixData);
    // this.exportSchedule(matrixData);
  };

  onNextWeekChange = (rowIndex, colIndex, matrixData) => {
    console.log(rowIndex, colIndex, matrixData);
    this.scheduleMatrixData2 = Array.from(matrixData);
    // this.exportSchedule(matrixData);
  };

  componentDidMount = () => {
    // this.parseSchedule();
    // window.moment = moment;
  };

  render() {
    return (
      <div>
        {/* 编辑模式 */}
        <Button onClick={this.exportSchedule}>导出</Button>
        <Button onClick={this.importSchedule}>导入</Button>
        <Button
          onClick={() => {
            this.sche1.current.clear();
            this.sche2.current.clear();
          }}
        >
          清空
        </Button>
        <ScheduleTable ref={this.sche1} onChange={this.onCurrentWeekChange} />
        <ScheduleTable ref={this.sche2} onChange={this.onNextWeekChange} />
      </div>
    );
  }
}

export default Schedule;
