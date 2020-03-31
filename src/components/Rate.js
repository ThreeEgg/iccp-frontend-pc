import React, { Component } from 'react';
import Ratings from 'react-ratings-declarative';

export class Rate extends Component {
  render() {
    const { value, max } = this.props;
    return (
      <Ratings ae rating={value} widgetRatedColors="#FF7D16" widgetEmptyColors="#ccc">
        {Array(max)
          .fill(0)
          .map((item, index) => (
            <Ratings.Widget widgetDimension="20px" key={index} widgetHoverColor="#FF7D16" />
          ))}
      </Ratings>
    );
  }
}

Rate.defaultProps = {
  max: 5,
};

export default Rate;
