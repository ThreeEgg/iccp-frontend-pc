/*
 * @Descripttion:
 * @version:
 * @Author: 毛翔宇
 * @Date: 2020-03-20 09:04:49
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-04-02 18:09:25
 * @FilePath: \PC端-前端\src\pages\chat.js
 */
import React from 'react';
import { connect } from 'react-redux';
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
