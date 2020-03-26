import React, { Component, Fragment } from 'react';
import './ScheduleTable.less';

export class ScheduleTable extends Component {
  row = 7;
  col = 12;

  rowHeader = (rowIndex, colIndex) => {
    return rowIndex;
  };

  colHeader = (rowIndex, colIndex) => {
    return colIndex;
  };

  handleGridClick = (rowIndex, colIndex) => {
    console.log(rowIndex, colIndex);
  };

  render() {
    const { rowHeader, colHeader } = this;
    return (
      <div className="schedule-table">
        {Array(7)
          .fill(0)
          .map((item, rowIndex) => (
            <div className="row" key={rowIndex}>
              {Array(12)
                .fill(0)
                .map((item, colIndex) => {
                  const key = colIndex;
                  if (rowIndex === 0) {
                    // 左上角
                    if (colIndex === 0) {
                      return (
                        <div className="grid" key={key}>
                          <div className="body no-style" />
                        </div>
                      );
                    }
                    // 列头部
                    return (
                      <div className="grid" key={key}>
                        <div className="body no-style">
                          {colHeader && colHeader(rowIndex, colIndex)}
                        </div>
                      </div>
                    );
                  } else if (colIndex === 0) {
                    // 行头部
                    return (
                      <Fragment key={key}>
                        <div className="grid">
                          <div className="body no-style">
                            {rowHeader && rowHeader(rowIndex, colIndex)}
                          </div>
                        </div>
                        <div className="grid">
                          <div className="body" />
                        </div>
                      </Fragment>
                    );
                  }
                  // 有效的格子
                  return (
                    <div className="grid" key={key}>
                      <div
                        className="body"
                        onClick={() => this.handleGridClick(rowIndex, colIndex)}
                      />
                    </div>
                  );
                })}
            </div>
          ))}
      </div>
    );
  }
}

export default ScheduleTable;
