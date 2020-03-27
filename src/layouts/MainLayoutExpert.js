import React from 'react';
import Head from './Head';
import Header from '../components/Header';
import SimpleFooter from '../components/SimpleFooter';
import Sider from './SiderExpert';
import './ContentLayout.less';

export default class MainLayoutExpert extends React.Component {
  render() {
    return (
      <div className="platformIndex">
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
            </div>
          </div>
        </div>
        <div className="content">
          <div className="content-plat-c commonWidth flex">
            <Sider />
            <div className="content-c-r">{this.props.children}</div>
          </div>
        </div>
        <SimpleFooter />
      </div>
    );
  }
}
