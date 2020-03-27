import React, { Component } from 'react';
import classNames from 'classnames';
import './ContentListItem.less';

export class ContentListItem extends Component {
  state = {
    hasShowMore: false,
  };

  showMore = () => {
    this.setState({
      showMore: true,
    });
  };

  render() {
    const { hasShowMore } = this.state;
    const { title, content } = this.props;

    return (
      <div className="coo-item">
        <h1>{title}</h1>
        <div className={classNames('coo-text', { 'show-more': hasShowMore })}>
          {content}
          <div className="coo-more" onClick={this.showMore}>
            More
          </div>
        </div>
      </div>
    );
  }
}

export default ContentListItem;
