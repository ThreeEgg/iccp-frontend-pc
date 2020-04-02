/*
 * @Descripttion: 
 * @version: 
 * @Author: 毛翔宇
 * @Date: 2020-03-27 17:21:00
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-04-02 10:21:49
 * @FilePath: \PC端-前端\src\pages\listTest.js
 */
import React, { Component, createRef } from 'react'
import VirtualList from '../components/VirtualList';

export class listTest extends Component {
  msgList = createRef();

  renderItem = (item, index) => {
    return <div>{index}</div>
  }

  scrollToBottom = () => {
    this.msgList.current.list.scrollToRow(parseInt(9999));
  }

  render() {
    return (
      <div>
        <button onClick={this.scrollToBottom}>滚动</button>
        <div style={{ width: 300, height: 600 }}>
          <VirtualList
            ref={this.msgList}
            data={Array(10000).fill(0)}
            itemRender={this.renderItem}
          />
        </div>
      </div>
    )
  }
}

export default listTest
