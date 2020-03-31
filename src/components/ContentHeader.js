import React, { Component } from 'react';
import './ContentHeader.less';

export default props => (
  <div className="content-header flex flex-justifyBetween flex-align">
    <h1 className="flex flex-align">
      <img className="" src={props.image} alt="" />
      <span>{props.title}</span>
    </h1>
    <div>{props.actions}</div>
  </div>
);
