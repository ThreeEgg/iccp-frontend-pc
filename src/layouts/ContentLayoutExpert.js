import React, { Fragment } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Head from './Head';
import Header from '../components/Header';
import SimpleFooter from '../components/SimpleFooter';
import SiderExpert from './SiderExpert';
import './ContentLayoutExpert.less';

class ContentLayoutExpert extends React.Component {
  render() {
    const { url, title, hideSider, removeContentStyle, children } = this.props;
    return (
      <div className={classNames('content-layout', this.props.className)}>
        <Head />
        <Header />
        <div className="banner">
          <div className="bannerTitle">
            <div className="bannerText commonWidth flex flex-align flex-justifyBetween">
              <div>
                {url ? <img src={url} /> : ''}
                {title}
              </div>
              <div>
                {/* <span className="iconfont ic_header_leadback"></span> */}
                <a href="/expert/home">返回首页</a>
              </div>
            </div>
          </div>
        </div>
        <div className="content">
          <div
            className={classNames('content-plat-c commonWidth flex', {
              'no-style': removeContentStyle,
            })}
          >
            {!hideSider ? (
              <Fragment>
                <SiderExpert />
                <div className="content-c-r">{this.props.children}</div>
              </Fragment>
            ) : (
              children
            )}
          </div>
        </div>
        <SimpleFooter />
      </div>
    );
  }
}

ContentLayoutExpert.propTypes = {
  // 标题
  title: PropTypes.string,
  // 前缀图片地址
  url: PropTypes.string,
  // 隐藏侧边栏
  hideSider: PropTypes.bool,
  // 清楚内容容器样式
  removeContentStyle: PropTypes.bool,
};

ContentLayoutExpert.defaultProps = {
  title: '',
  url: '',
  hideSider: false,
  removeContentStyle: false,
};

export default ContentLayoutExpert;
