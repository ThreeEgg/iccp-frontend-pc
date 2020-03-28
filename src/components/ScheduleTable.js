import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import './ScheduleTable.less';

const getGridKey = (rowIndex, colIndex) => `${rowIndex}_${colIndex}`;

export class ScheduleTable extends Component {
  state = {
    activeGrids: [],
  };

  // 行头
  rowHeader = (rowIndex, colIndex) => {
    const { renderRowHeader } = this.props;
    const hasActive = this.state.activeGrids.find(gridKey => gridKey.split('_')[0] == rowIndex);
    return (
      <span className={classNames('row-header', { active: hasActive })}>
        {renderRowHeader && renderRowHeader(rowIndex, colIndex, hasActive)}
      </span>
    );
  };

  // 表头
  colHeader = (rowIndex, colIndex) => {
    const start = this.props.rowCount + 1;
    return <span className="col-header">{`${start + colIndex}:00`}</span>;
  };

  handleGridClick = (rowIndex, colIndex) => {
    const { readOnly } = this.props;
    if (readOnly) {
      return;
    }
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
      activeGrids: Array.from(activeGrids),
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
    const { rowCount, colCount, renderLeftTop, readOnly = false } = this.props;

    return (
      <div className={classNames('schedule-table', { 'read-only': readOnly })}>
        {Array(rowCount + 1)
          .fill(0)
          .map((item, rowIndex) => (
            <div className="row" key={rowIndex}>
              {Array(colCount)
                .fill(0)
                .map((item, colIndex) => {
                  const key = colIndex;
                  if (rowIndex === 0) {
                    // 左上角
                    if (colIndex === 0) {
                      return (
                        <Fragment key={key}>
                          <div className="grid" key={key}>
                            <div className="body no-style">{renderLeftTop && renderLeftTop()}</div>
                          </div>
                          <div className="grid">
                            <div className="body no-style">
                              {colHeader && colHeader(rowIndex - 1, colIndex)}
                            </div>
                          </div>
                        </Fragment>
                      );
                    }
                    // 列头部
                    return (
                      <div className="grid" key={key}>
                        <div className="body no-style">
                          {colHeader && colHeader(rowIndex - 1, colIndex)}
                        </div>
                      </div>
                    );
                  } else if (colIndex === 0) {
                    // 行头部
                    return (
                      <Fragment key={key}>
                        <div className="grid">
                          <div className="body no-style">
                            {rowHeader && rowHeader(rowIndex - 1, colIndex)}
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
