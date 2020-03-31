/*
 * @Descripttion:
 * @version:
 * @Author: 毛翔宇
 * @Date: 2020-03-19 14:11:19
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-03-31 19:06:21
 * @FilePath: \PC端-前端\src\modules\NIM\components\CaseInfo.js
 */
import React from 'react';
import { connect } from 'react-redux';
import { Drawer, Form, Input, Button, Modal } from 'antd';
import PropTypes from 'prop-types';
export default class CaseInfo extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
  };
  
  static defaultProps = {
    visible: false,
  };

  state = {
  };

  login = e => {
  };
  
  handleCancel = e => {
  };

  componentDidMount = () => {
  };

  componentDidUpdate = (prevProps, prevState) => {
    // if (prevProps.visible !== this.props.visible) {
    //   this.setState({
    //     visible,
    //   });
    // }
  };

  render() {
    const { visible } = this.props;
    return (
      <div>
        <Drawer
          title="Basic Drawer"
          placement='left'
          closable={false}
          maskClosable={false}
          mask={false}
          // onClose={}
          visible={visible}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Drawer>
      </div>
    );
  }
}
