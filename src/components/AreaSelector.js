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
import * as expertService from '../services/expert';
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

    activeKey: ['continent'],

    // 大洲
    continent: {},
    // 国家
    country: {},
    // 服务
    service: {},

    // 专家列表
    expertList: [],

    // 选中的专家
    currentExpertIndex: 0,

    // 专家详情
    expertInfo: {},
  };

  toggleExpand = () => {
    this.setState({
      expand: !this.state.expand,
    });
  };

  showInfoExpand = async () => {
    this.setState({
      infoExpand: true,
    });

    this.getExpertList();
  };

  getExpertList = async () => {
    const { country, service } = this.state;

    const res = await expertService.getExpertList({
      countryCode: country['country_code'],
      serviceTagIdList: [service.id],
    });

    if (res.code === '0') {
      this.setState({
        expertList: [1, 2, 3, 4, 5, 6, 7] || res.data,
      });
    }
  };

  selectContinent = continent => {
    this.setState(
      {
        continent,
        activeKey: ['country'],
      },
      this.notifyAreaChange,
    );
  };

  selectCountry = country => {
    this.setState(
      {
        country,
        activeKey: ['service'],
      },
      this.notifyAreaChange,
    );
  };

  notifyAreaChange = () => {
    const { country, continent, service } = this.state;
    if (this.props.onChange) {
      this.props.onChange({
        country,
        continent,
        service,
      });
    }
  };

  render() {
    const {
      expand,
      activeKey,
      infoExpand,
      continent,
      country,
      service,
      expertList,
      currentExpertIndex,
    } = this.state;
    const { continentList, countryList, serviceList } = this.props;

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
              disabled={!continent.id || !country.id || !service.id}
              onClick={this.showInfoExpand}
            >
              Go!
            </Button>
          </div>

          {/* 各类选择器 */}
          <Collapse
            accordion
            bordered={false}
            activeKey={activeKey}
            expandIconPosition="right"
            expandIcon={props => {
              if (props.isActive) {
                return <CaretDownOutlined />;
              }
              return <CaretRightOutlined />;
            }}
            onChange={activeKey => this.setState({ activeKey })}
          >
            <Panel
              key="continent"
              header={
                <div className="flex flex-justifyBetween expand-title" style={{ paddingRight: 20 }}>
                  <span>选择大洲</span>
                  <span>{continent['cn_name']}</span>
                </div>
              }
            >
              <div className="expand-content">
                {continentList.map(item => (
                  <span
                    key={item.id}
                    className={classNames({ active: continent.id == item.id })}
                    onClick={() => this.selectContinent(item)}
                  >
                    {item['cn_name']}
                  </span>
                ))}
              </div>
            </Panel>
            <Panel
              key="country"
              header={
                <div className="flex flex-justifyBetween expand-title" style={{ paddingRight: 20 }}>
                  <span>选择国家</span>
                  <span>{country['cname']}</span>
                </div>
              }
            >
              <div className="expand-content">
                {countryList.map(item => (
                  <span
                    key={item.id}
                    className={classNames({ active: country.id == item.id })}
                    onClick={() => this.selectCountry(item)}
                  >
                    {item['cname']}
                  </span>
                ))}
              </div>
            </Panel>
            <Panel
              key="service"
              header={
                <div className="flex flex-justifyBetween expand-title" style={{ paddingRight: 20 }}>
                  <span>选择服务</span>
                  <span>{service.chineseContent}</span>
                </div>
              }
            >
              <div className="expand-content">
                {serviceList.map(item => (
                  <span
                    key={item.id}
                    className={classNames({ active: service.id == item.id })}
                    onClick={() => this.setState({ service: item })}
                  >
                    {item.chineseContent}
                  </span>
                ))}
              </div>
            </Panel>
          </Collapse>

          {/* 专家信息 */}
          <div className={classNames(['expert-info flex flex-column', { active: infoExpand }])}>
            <div className="expert-select flex flex-justifyBetween flex-align">
              <span>选择专家</span>
              {/* TODO: 20200326 专家分页器 */}
              {/* <div>
                <LeftOutlined style={{ fontSize: 16, color: 'rgba(255, 255, 255, .3)' }} />
                <RightOutlined style={{ fontSize: 16 }} />
              </div> */}
            </div>

            <div className="expert-list flex">
              {expertList.map((item, index) => (
                <div
                  key={index}
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
