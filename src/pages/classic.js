import React from 'react';
import Router from 'next/router';
import LoginLayout from '../layouts/LoginLayout';
import { Form, Input, Button, Switch } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import Platform from '../layouts/platformIndex';
import { Pagination } from 'antd';
import './classic.less';

export default class RetrievePWD extends React.Component {
  state = {
    current: 1,
  };

  onChange = page => {
    console.log(page);
    this.setState({
      current: page,
    });
  };

  goToArticle = () => {
    Router.push('/article');
  };

  render() {
    return (
      <Platform title="Classic Case" url="/images/ic_header_classcase.png">
        <div className="content-t flex flex-align">
          <p />
          <div className="flex flex-align">
            <img src="/images/ic_header_classcase_black.png" />
            <div>Classic Case</div>
          </div>
          <p />
        </div>
        <div className="classicContent-m">
          <div className="cla-item flex flex-justifyBetween">
            <div className="cla-item-text">
              <h1>BBC亚太地区业务案例分享</h1>
              <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum
                laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin
                sodales pulvinar sic tempor.
              </div>
              <Button onClick={this.goToArticle}>
                More
                <RightOutlined style={{ fontSize: '12px', position: 'absolute', top: '10px' }} />
              </Button>
            </div>
            <img src="/images/card1.png" />
          </div>
          <div className="cla-item flex flex-justifyBetween">
            <div className="cla-item-text">
              <h1>BBC亚太地区业务案例分享</h1>
              <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum
                laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin
                sodales pulvinar sic tempor.
              </div>
              <Button onClick={this.goToArticle}>
                More
                <RightOutlined style={{ fontSize: '12px', position: 'absolute', top: '10px' }} />
              </Button>
            </div>
            <img src="/images/card2.png" />
          </div>
        </div>
        <div className="common-pagination">
          <Pagination
            current={this.state.current}
            onChange={this.onChange}
            size="small"
            total={50}
          />
        </div>
      </Platform>
    );
  }
}
