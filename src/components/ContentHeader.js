import React, { Component } from 'react';
import './ContentHeader.less';

export class ContentHeader extends Component {
  render() {
    return (
      <div className="content-header flex flex-justifyBetween flex-align">
        <h1 className="flex flex-align">
          <img className="" src="/images/ic_professor_schedule.png" alt="" />
          <span>Schedule</span>
        </h1>
        <div>{this.props.actions}</div>
      </div>
    );
  }
}

export default ContentHeader;
