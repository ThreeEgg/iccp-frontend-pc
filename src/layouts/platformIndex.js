import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sider from './sider';
import './platformIndex.less';

export default class Platform extends React.Component {
  render() {
    return (
      <div className="platformIndex">
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
            <Sider />
            <div className="content-c-r">{this.props.children}</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
