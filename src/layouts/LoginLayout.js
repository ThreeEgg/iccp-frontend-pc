import React from 'react';
import Head from './Head';
import Header from '../components/Header';
import SimpleFooter from '../components/SimpleFooter';
import '../pages/index.less';

export default class extends React.Component {
  render() {
    return (
      <div className="login">
        <Head />
        <Header />
        <div className="content">
          <div className="content_container">{this.props.children}</div>
          <SimpleFooter />
        </div>
      </div>
    );
  }
}
