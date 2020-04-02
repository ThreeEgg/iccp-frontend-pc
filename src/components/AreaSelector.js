import React, { Component, Fragment } from 'react';
import { Button, Collapse, Empty, message } from 'antd';
import {
  CaretRightOutlined,
  CaretDownOutlined,
  LeftOutlined,
  RightOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import classNames from 'classnames';
import Link from 'next/link';
import { connect } from 'react-redux';
import * as expertService from '../services/expert';
import './AreaSelector.less';

const { Panel } = Collapse;

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

class AreaSelector extends Component {
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
      countryCode: country.countryCode,
      serviceTagIdList: [service.id],
    });

    if (res.code === '0') {
      this.setState({
        expertList: res.data,
      });
    }
  };

  selectContinent = continent => {
    const modifyState = {
      continent,
      activeKey: ['country'],
    };
    // 如果已经有国家，则清空选中的国家
    if (this.state.country) {
      modifyState.country = {};
    }
    this.setState(modifyState, this.notifyAreaChange);
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

  startChat = (accid) => {
    message.loading('正在连线...');
    this.props.dispatch({
      type: 'chat/initSession',
      expertAccid: accid,
      callback: () => {
        message.destroy();
        this.props.dispatch({
          type: 'im/showChat',
        });
      },
    });
  }

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
            {expertList.length ? (
              <Fragment>
                <div className="expert-select flex flex-justifyBetween flex-align">
                  <span>选择专家</span>
                  {/* TODO: 20200326 专家分页器 */}
                  {/* <div>
                <LeftOutlined style={{ fontSize: 16, color: 'rgba(255, 255, 255, .3)' }} />
                <RightOutlined style={{ fontSize: 16 }} />
              </div> */}
                  <div onClick={() => this.setState({ infoExpand: false })}>
                    <CloseOutlined style={{ fontSize: 16, cursor: 'pointer' }} />
                  </div>
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
                      <img src={item.image} alt="" />
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
                {expertList[currentExpertIndex] ? (
                  <Fragment>
                    <div className="expert-detail flex flex-column">
                      <div className="expert-detail-title flex flex-justifyBetween flex-align">
                        <span className="strong">
                          {expertList[currentExpertIndex].name}&nbsp;&nbsp;
                          <i
                            className={classNames('online-state iconfont', {
                              active: expertList[currentExpertIndex].onlineState === 0,
                            })}
                          >
                            &#xe68b;
                          </i>
                        </span>
                        <span>{expertList[currentExpertIndex].countryCode}</span>
                      </div>
                      <p className="expert-detail-content flex">
                        {expertList[currentExpertIndex].introduction}
                      </p>
                    </div>
                    <div className="btns flex flex-justifyBetween">
                      <div>
                        <Link href={`/professor?id=${expertList[currentExpertIndex].userId}`}>
                          <a style={{ color: 'white' }}>专家主页</a>
                        </Link>
                      </div>
                      <div className="goto-im active" onClick={() => this.startChat(expertList[currentExpertIndex].accid)}>立即沟通</div>
                    </div>
                  </Fragment>
                ) : null}
              </Fragment>
            ) : (
                <Empty />
              )}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ }) => ({}))(AreaSelector);
