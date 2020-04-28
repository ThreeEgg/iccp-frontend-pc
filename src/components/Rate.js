import React, { Component } from 'react';
import Ratings from 'react-ratings-declarative';
import './Rate.less';

export class Rate extends Component {
  render() {
    const { value, max, color = '#FF7D16', dismissColor = '#ccc' } = this.props;
    return (
      <Ratings ae rating={value} widgetRatedColors={color} widgetEmptyColors={dismissColor}>
        {Array(max)
          .fill(0)
          .map((item, index) => (
            <Ratings.Widget widgetDimension="20px" key={index} widgetHoverColor={color} />
          ))}
      </Ratings>
    );
  }
}

Rate.defaultProps = {
  max: 5,
};

export default Rate;
