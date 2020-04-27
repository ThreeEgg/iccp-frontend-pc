import React, { Component } from 'react';
import ClampLines from 'react-clamp-lines';
import './ContentListItem.less';

export class ContentListItem extends Component {
  render() {
    const { title, content } = this.props;

    return (
      <div className="coo-item">
        <h1>{title}</h1>
        <div className="coo-text">
          <ClampLines text={content} moreText="More" lessText="Hide" className="coo-text-content" />
        </div>
      </div>
    );
  }
}

export default ContentListItem;
