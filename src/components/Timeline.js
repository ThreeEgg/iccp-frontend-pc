import React, { Component } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import './Timeline.less';

export class Timeline extends Component {
  render() {
    const { data = [] } = this.props;
    // 对activity进行分组，同一年、同一天的分同一组
    const timelineGroup = {};
    let currentYear;
    let currentDay;
    data.forEach(item => {
      // 以更新时间作为分组依据，获取每一项当年开始的时间戳，每一项当天开始的时间戳，比较是否一致
      const itemYear = moment(item.updateTime).year();
      const itemDay = Date.parse(
        moment(item.updateTime)
          .startOf('day')
          .toDate(),
      );
      if (currentYear != itemYear) {
        currentYear = itemYear;
      }
      if (currentDay != itemDay) {
        currentDay = itemDay;
      }
      if (!timelineGroup[currentYear]) {
        timelineGroup[currentYear] = {};
      }

      if (!timelineGroup[currentYear][currentDay]) {
        timelineGroup[currentYear][currentDay] = [];
      }

      timelineGroup[currentYear][currentDay].push(item);
    });

    return (
      <div className="timeline">
        {Object.entries(timelineGroup).map(([yearName, yearItems], timeLineIndex) => {
          return (
            <div className="pro-statu-item" key={yearName}>
              {Object.entries(yearItems).map(([dayTimestamp, dayItems]) => {
                const day = moment(dayTimestamp * 1).format('DD');
                const month = moment(dayTimestamp * 1).format('MMM');
                return dayItems.map((item, index) => {
                  const time = moment(item.updateTime).format('HH:mm');
                  return (
                    <div
                      className={classNames('statu-con', {
                        'section-head': index === 0,
                        head: timeLineIndex === 0,
                      })}
                    >
                      {index === 0 ? (
                        <div className="statu-title flex flex-align">
                          <span className="statu-year">{yearName}</span>
                          <div>
                            <p className="statu-monthNo">{day}</p>
                            <p className="statu-monthEN">{month}</p>
                          </div>
                        </div>
                      ) : null}

                      <div className="statu-text">
                        {item.activity}
                        <span>{time}</span>
                        <div
                          className={classNames({
                            'statu-circle-big': index === 0,
                            'statu-circle-small': index !== 0,
                          })}
                        />
                      </div>
                    </div>
                  );
                });
              })}
            </div>
          );
        })}
      </div>
    );
  }
}

export default Timeline;
