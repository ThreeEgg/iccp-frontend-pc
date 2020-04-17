import React from 'react';
import dynamic from 'next/dynamic';

const NIMChat = dynamic(import('../modules/NIM'), {
  ssr: false,
});

export default class Chat extends React.Component {

  async componentDidMount() {
  }

  render() {
    return <div style={{padding:'100px', height:'100%',backgroundColor:'#000000'}}>
      <NIMChat />
    </div>;
  }
}
