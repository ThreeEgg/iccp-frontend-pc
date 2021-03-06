import React from 'react';
import { Button, Divider, Dropdown } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import Map from '../components/Map';
import Header from '../components/Header';
import Footer from '../components/Footer';
import * as expertService from '../services/expert';
import * as commonService from '../services/common';
import api from '../services/api';
import { platformContentType } from '../common/enum';
import AreaSelector from '../components/AreaSelector';
import './index.less';

export default class extends React.Component {
  static async getInitialProps({ req, query }) {
    const fetch = require('isomorphic-unfetch');
    const requestUrl = `${api.baseUrl}/api${api.listPlatformContent}`;

    const aboutUsContentRes = await fetch(
      `${requestUrl}?pageNum=1&pageSize=1&type=${platformContentType.PLATFORMINTRO}`,
    );
    const aboutUsContent = await aboutUsContentRes.json();
    const aboutUs = aboutUsContent.data.items[0].content;

    const businessIntroRes = await fetch(
      `${requestUrl}?pageNum=1&pageSize=4&languageId=0&type=${platformContentType.BUSINESSINTRO}`,
    );
    const businessIntroContent = await businessIntroRes.json();
    const businessIntro = businessIntroContent.data.items;

    const classicCaseRes = await fetch(
      `${requestUrl}?pageNum=1&pageSize=3&languageId=0&type=${platformContentType.CLASSICCASE}`,
    );
    const classicCaseContent = await classicCaseRes.json();
    const classicCase = classicCaseContent.data.items;

    const continentListRes = await fetch(`${api.baseUrl}/api${api.getContinentList}`);
    const continentListContent = await continentListRes.json();
    const continentList = continentListContent.data;

    return {
      // 关于我们
      aboutUs,
      // 业务介绍
      businessIntro,
      // 案例介绍
      classicCase,
      continentList,
    };
  }

  state = {
    countryList: [],
    serviceList: [],
    expertList: [],
  };

  mapRef = React.createRef();

  getCountryList = async (continentId) => {
    const res = await expertService.getCountryList({ id: continentId });

    if (res.code === '0') {
      this.setState({
        countryList: res.data,
      });
    }
  };

  getServiceList = async () => {
    const res = await commonService.getServiceList();

    if (res.code === '0') {
      this.setState({
        serviceList: res.data,
      });
    }
  };

  getExpertList = async (country, service) => {
    const res = await expertService.getExpertList({
      countryCode: country.countryCode,
      serviceTagIdList: [service.id],
    });

    if (res.code === '0') {
      this.setState({
        expertList: res.data,
      });
    }

    if (!this.country || country.id !== this.country.id) {
      this.mapRef.current.updateArea(
        country.capitalLongitude,
        country.capitalLatitude,
        res.data.length,
        res.data,
      );
    }
  };

  onAreaChange = async (areaData) => {
    const { continent, country, service } = areaData;

    if (!this.continent || continent.id !== this.continent.id) {
      await this.getCountryList(continent.id);

      this.continent = continent;
    }

    if (country.capitalLatitude && country.capitalLongitude) {
      await this.getExpertList(country, service);
    }
  };

  initAreaData = async () => {
    // 取第一个地区的第一个国家
    await this.getCountryList(this.props.continentList[0].id);
    await this.getServiceList();
    await this.getExpertList(this.state.countryList[0], this.state.serviceList[0]);
  };

  componentDidMount = () => {
    this.initAreaData();
  };

  render() {
    const { aboutUs, classicCase, businessIntro } = this.props;
    const { continentList } = this.props;
    const { countryList, serviceList, expertList } = this.state;

    return (
      <div className="map">
        <Header />
        <div className="mapT flex flex-column">
          <div className="mapT-container flex-1">
            <Map ref={this.mapRef} />
          </div>
          <div className="map-selector">
            <AreaSelector
              continentList={continentList}
              countryList={countryList}
              serviceList={serviceList}
              expertList={expertList}
              onChange={this.onAreaChange}
              onSearch={this.getExpertList}
            />
          </div>
          <div className="business-intro">
            {businessIntro.map((item, index) => {
              return (
                <div className="business-info" key={index}>
                  <h1>{item.title}</h1>
                  <p>{item.content}</p>
                </div>
              );
            })}
          </div>
          <div className="map-footer flex flex-justifyAround flex-alignCenter">
            <div className="icons">
              <Dropdown
                placement="topCenter"
                overlayClassName="footer-overlay"
                overlay={
                  <div className="overlay">
                    <a href="tel:0532-53232532">0532-53232532</a>
                  </div>
                }
              >
                <i className="iconfont">&#xe6ad;</i>
              </Dropdown>
              <Dropdown
                placement="topCenter"
                overlayClassName="footer-overlay"
                overlay={
                  <div className="overlay">
                    <a href="mailto:lianxinjituan@lxjt.net">lianxinjituan@lxjt.net</a>
                  </div>
                }
              >
                <i className="iconfont">&#xe6aa;</i>
              </Dropdown>
              <Dropdown
                placement="topCenter"
                overlayClassName="footer-overlay"
                overlay={<div className="overlay">百盛商务中心#楼</div>}
              >
                <i className="iconfont">&#xe6ab;</i>
              </Dropdown>
              <Dropdown
                placement="topCenter"
                overlayClassName="footer-overlay qrcode"
                overlay={
                  <div className="overlay qrcode">
                    <img src="/images/qrcode.png" />
                  </div>
                }
              >
                <i className="iconfont">&#xe6ac;</i>
              </Dropdown>
            </div>
            <div className="flex flex-alignCenter">
              <div className="flex flex-alignCenter links">
                <a className="fz-qingke" href="/aboutUs">
                  平台介绍
                </a>
                <a className="fz-qingke" href="/problems">
                  常见问题
                </a>
                <a className="fz-qingke" href="/classic">
                  经典案例
                </a>
                <a className="fz-qingke" href="/business">
                  业务介绍
                </a>
                <a className="fz-qingke" href="/cooperative">
                  合作伙伴
                </a>
                <a className="fz-qingke" href="/regulation">
                  条款规定
                </a>
              </div>
            </div>
            <Divider type="vertical" />
            <div className="ft-copy flex flex-alignCenter">
              Copyright © 2020 青岛联信商务咨询有限公司 | ICP证: 鲁ICP备xxxxxxxx号-n
            </div>
          </div>
        </div>
        {/* <div className="content contentAbout">
          <div className="commonWidth">
            <div className="content-t flex flex-align">
              <p />
              <div className="flex flex-align">
                <img src="/images/ic_leaf.png" />
                <div>ABOUT</div>
                <sup>US</sup>
              </div>
              <p />
            </div>
            <div className="content-c">{aboutUs}</div>
            <div className="content-b">
              <Link href="/aboutUs">
                <Button>
                  More
                  <RightOutlined style={{ fontSize: '12px', position: 'absolute', top: '10px' }} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="mapImg">
          <img src="/images/img_home_bg.png" />
        </div>
        <div className="content contentClassic">
          <div className="commonWidth">
            <div className="content-t flex flex-align">
              <p />
              <div className="flex flex-align">
                <img src="/images/ic_leaf.png" />
                <div>CLASSIC</div>
                <sup>CASE</sup>
              </div>
              <p />
            </div>
            <div className="content-caseC flex flex-align flex-justifyBetween">
              {classicCase.map((item, index) => {
                return (
                  <div className="item item1" key={index}>
                    <div
                      className="item-content"
                      style={{
                        background: `url(/images/case/card${index + 1}.png) center no-repeat`,
                      }}
                    >
                      <div className="item-content-container">
                        <h1>0{index + 1}</h1>
                        <p>BBC亚太地区业务案例分享</p>
                        <div className="item-content-info">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod
                          bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra
                          justo commodo Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                          Aenean euismod bibendum laoreet.
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="content-b">
              <Link href="/classic">
                <Button>
                  More
                  <RightOutlined style={{ fontSize: '12px', position: 'absolute', top: '10px' }} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer /> */}
      </div>
    );
  }
}
