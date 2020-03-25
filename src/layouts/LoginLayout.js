import React from 'react';
import Header from '../components/Header';
import SimpleFooter from '../components/SimpleFooter';
import '../pages/index.less';

export default class extends React.Component {
  render() {
    return (
      <div className="login">
        <Header />
        <div className="content">{this.props.children}</div>
        <SimpleFooter />
      </div>
    );
  }
}
