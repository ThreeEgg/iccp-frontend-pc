import React, { Fragment } from 'react';
import classNames from 'classnames';
import Head from './Head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SiderExpert from './SiderExpert';
import './ContentLayoutExpert.less';

export default class ContentLayout extends React.Component {
  render() {
    return (
      <div className={classNames('content-layout', this.props.className)}>
        <Head />
        <Header />
        <div className="banner">
          <img src="/images/img_header_bg.png" />
          <div className="bannerTitle">
            <div className="bannerText commonWidth flex flex-align flex-justifyBetween">
              <div>
                <img src={this.props.url} />
                {this.props.title}
              </div>
              <div>
                {/* <span className="iconfont ic_header_leadback"></span> */}
                <a href="/">返回首页</a>
              </div>
            </div>
          </div>
        </div>
        <div className="content">
          <div className="content-plat-c commonWidth flex">
            {!this.props.hideSider ? (
              <Fragment>
                <SiderExpert />
                <div className="content-c-r">{this.props.children}</div>
              </Fragment>
            ) : (
              this.props.children
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
