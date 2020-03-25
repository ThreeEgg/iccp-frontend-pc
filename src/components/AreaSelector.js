import React, { Component } from 'react';
import { Button, Collapse } from 'antd';
import {
  CaretRightOutlined,
  CaretDownOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import classNames from 'classnames';
import Link from 'next/link';
import './AreaSelector.less';

const { Panel } = Collapse;

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

export default class extends Component {
  state = {
    expand: true,
    infoExpand: false,

    // 大洲
    continent: null,
    // 国家
    countryCode: null,
    // 服务
    serviceId: null,

    // 专家列表
    expertList: [1, 2, 3, 4, 5, 6],

    currentExpertIndex: 0,

    // 专家详情
    expertInfo: {},
  };

  toggleExpand = () => {
    this.setState({
      expand: !this.state.expand,
    });
  };

  toggleInfoExpand = () => {
    this.setState({
      infoExpand: !this.state.infoExpand,
    });
  };

  render() {
    const {
      expand,
      infoExpand,
      continent,
      countryCode,
      serviceId,
      expertList,
      currentExpertIndex,
    } = this.state;
    const continentList = ['北美', '南美', '亚洲', '欧洲', '非洲', '大洋洲', '南极洲'];

    const countryList = ['北美', '墨西哥', '日本'];

    const serviceList = ['航运法务', '民事诉讼', '交通法规'];

    return (
      <div className={classNames(['as-container flex', { expand }])}>
        {/* 展开文本 */}
        <div
          className={classNames([
            'flex flex-justifyCenter as-expand-text flex-alignCenter',
            { hide: expand },
          ])}
          onClick={this.toggleExpand}
        >
          <span>展&nbsp;&nbsp;开&nbsp;&nbsp;筛&nbsp;&nbsp;选</span>
          &nbsp;&nbsp;
          <i className="iconfont as-expand-icon">&#xe68d;</i>
        </div>

        <div className="flex-column area-selector">
          <div className="flex flex-align flex-justifyBetween title">
            <span>选择地区</span>
            <Button
              type="primary"
              size="small"
              disabled={!continent || !countryCode || !serviceId}
              onClick={this.toggleInfoExpand}
            >
              Go!
            </Button>
          </div>

          {/* 各类选择器 */}
          <Collapse
            accordion
            bordered={false}
            defaultActiveKey={['1']}
            expandIconPosition="right"
            expandIcon={props => {
              if (props.isActive) {
                return <CaretDownOutlined />;
              }
              return <CaretRightOutlined />;
            }}
          >
            <Panel
              header={
                <div className="flex flex-justifyBetween expand-title" style={{ paddingRight: 20 }}>
                  <span>选择大洲</span>
                  <span>{continent}</span>
                </div>
              }
              key="1"
            >
              <div className="expand-content">
                {continentList.map(item => (
                  <span
                    className={classNames({ active: continent == item })}
                    onClick={() => this.setState({ continent: item })}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </Panel>
            <Panel
              header={
                <div className="flex flex-justifyBetween expand-title" style={{ paddingRight: 20 }}>
                  <span>选择国家</span>
                  <span>{countryCode}</span>
                </div>
              }
              key="2"
            >
              <div className="expand-content">
                {countryList.map(item => (
                  <span
                    className={classNames({ active: countryCode == item })}
                    onClick={() => this.setState({ countryCode: item })}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </Panel>
            <Panel
              header={
                <div className="flex flex-justifyBetween expand-title" style={{ paddingRight: 20 }}>
                  <span>选择服务</span>
                  <span>{serviceId}</span>
                </div>
              }
              key="3"
            >
              <div className="expand-content">
                {serviceList.map(item => (
                  <span
                    className={classNames({ active: serviceId == item })}
                    onClick={() => this.setState({ serviceId: item })}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </Panel>
          </Collapse>

          {/* 专家信息 */}
          <div className={classNames(['expert-info flex flex-column', { active: infoExpand }])}>
            <div className="expert-select flex flex-justifyBetween flex-align">
              <span>选择专家</span>
              <div>
                <LeftOutlined style={{ fontSize: 16, color: 'rgba(255, 255, 255, .3)' }} />
                <RightOutlined style={{ fontSize: 16 }} />
              </div>
            </div>

            <div className="expert-list flex">
              {expertList.map((item, index) => (
                <div
                  className={classNames('expert-list-item flex flex-column flex-align', {
                    active: currentExpertIndex == index,
                  })}
                  onClick={() => this.setState({ currentExpertIndex: index })}
                >
                  <img
                    src={
                      'https://wph-1256148406.cos.ap-shanghai.myqcloud.com/brainselling/65649a1545829.576a7eb99921c.jpg'
                    }
                    alt=""
                  />
                  <span>名字</span>
                </div>
              ))}
            </div>
            <div className="expert-detail flex flex-column">
              <div className="expert-detail-title flex flex-justifyBetween flex-align">
                <span className="strong">
                  Cynthia Miller{' '}
                  <i className="iconfont" style={{ color: '#45D49D', fontSize: 13 }}>
                    &#xe697;
                  </i>
                </span>
                <span>美国</span>
              </div>
              <div className="expert-detail-content flex">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum
                laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Lorem
                ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.
                Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin gravida
                dolor sit amet lacus accumsan et viverra justo commodo Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor
                sit amet lacus accumsan et viverra justo commodo. Proin gravida dolor sit amet lacus
                accumsan et viverra justo commodo Lorem ipsum dolor sit amet, consectetur adipiscing
                elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan
                et viverra justo commodo. Proin gravida dolor sit amet lacus accumsan et viverra
                justo commodo
              </div>
            </div>
            <div className="btns flex flex-justifyBetween">
              <div>
                <Link href="/professor">
                  <a>专家主页</a>
                </Link>
              </div>
              <div className="active">立即沟通</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
