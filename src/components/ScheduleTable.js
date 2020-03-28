import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import './ScheduleTable.less';

const getGridKey = (rowIndex, colIndex) => `${rowIndex}_${colIndex}`;

export class ScheduleTable extends Component {
  state = {
    activeGrids: [],
  };

  row = 7;
  col = 12;

  rowHeader = (rowIndex, colIndex) => {
    const start = 24;
    const hasActive = this.state.activeGrids.find(gridKey => gridKey.split('_')[0] == rowIndex - 1);
    return (
      <span className={classNames('row-header', { active: hasActive })}>
        2.{start + rowIndex - 1}
        <br />
        周三
      </span>
    );
  };

  colHeader = (rowIndex, colIndex) => {
    const start = 8;
    return <span className="col-header">{`${start + colIndex}:00`}</span>;
  };

  handleGridClick = (rowIndex, colIndex) => {
    // console.log(rowIndex, colIndex)
    const gridKey = getGridKey(rowIndex, colIndex);
    const activeGrids = new Set(this.state.activeGrids);

    if (activeGrids.has(gridKey)) {
      activeGrids.delete(gridKey);
    } else {
      activeGrids.add(gridKey);
    }

    this.setState(
      {
        activeGrids: Array.from(activeGrids),
      },
      () => {
        if (this.props.onChange) {
          this.props.onChange(rowIndex, colIndex, this.state.activeGrids);
        }
      },
    );
  };

  setActiveGrid = (activeGrids = []) => {
    this.setState({
      activeGrids,
    });
  };

  clear = () => {
    this.setState({
      activeGrids: [],
    });
  };

  render() {
    const { rowHeader, colHeader } = this;
    const { activeGrids } = this.state;

    return (
      <div className="schedule-table">
        {Array(this.row + 1)
          .fill(0)
          .map((item, rowIndex) => (
            <div className="row" key={rowIndex}>
              {Array(this.col)
                .fill(0)
                .map((item, colIndex) => {
                  const key = colIndex;
                  if (rowIndex === 0) {
                    // 左上角
                    if (colIndex === 0) {
                      return (
                        <Fragment key={key}>
                          <div className="grid" key={key}>
                            <div className="body no-style" />
                          </div>
                          <div className="grid">
                            <div className="body no-style">
                              {colHeader && colHeader(rowIndex, colIndex)}
                            </div>
                          </div>
                        </Fragment>
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
                        <div
                          className={classNames('grid', {
                            active: activeGrids.indexOf(getGridKey(rowIndex - 1, colIndex)) > -1,
                          })}
                          key={key}
                        >
                          <div
                            className="body"
                            onClick={() => this.handleGridClick(rowIndex - 1, colIndex)}
                          />
                        </div>
                      </Fragment>
                    );
                  }
                  // 有效的格子
                  return (
                    <div
                      className={classNames('grid', {
                        active: activeGrids.indexOf(getGridKey(rowIndex - 1, colIndex)) > -1,
                      })}
                      key={key}
                    >
                      <div
                        className="body"
                        onClick={() => this.handleGridClick(rowIndex - 1, colIndex)}
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
