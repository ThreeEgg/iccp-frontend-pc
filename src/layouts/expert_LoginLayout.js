import React from 'react';
import Head from '../components/Head';
import expert_Header from '../components/expert_Header';
import '../pages/expert_index.less';

export default class extends React.Component {
  render() {
    return (
      <div className="login">
        <expert_Header />
        <div className="content">
          {this.props.children}
        </div>
        <div className="footer">
          Copyright © 2020 青岛联信商务咨询有限公司 | ICP证: 鲁ICP备xxxxxxxx号-n
        </div>
      </div>  
    );
  }
}