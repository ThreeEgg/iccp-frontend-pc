import React from 'react';
import Head from '../components/Head';
import SimpleFooter from '../components/SimpleFooter';

export default class extends React.Component {
  render() {
    return (
      <div>
        <Head />
        {this.props.children}
        <SimpleFooter />
      </div>
    );
  }
}
