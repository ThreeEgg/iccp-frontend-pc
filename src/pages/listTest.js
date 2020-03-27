import React, { Component, createRef } from 'react'
import VirtualList from '../components/VirtualList';

export class listTest extends Component {
  msgList = createRef();

  renderItem = (item, index) => {
    return <div>{index}</div>
  }

  scrollToBottom = () => {
    this.msgList.current.list.scrollToRow(parseInt(Math.random() * 10000));
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
