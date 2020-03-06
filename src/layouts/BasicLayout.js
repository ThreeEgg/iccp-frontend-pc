import React from 'react';
import Head from '../components/Head';

export default class extends React.Component {
  render() {
    return (
      <div>
        <Head />
        {this.props.children}
      </div>
    );
  }
}