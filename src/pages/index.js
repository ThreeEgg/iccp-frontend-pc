import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import Link from 'next/link';
import Map from '../components/Map';
import * as expertService from '../services/expert';
import * as commonService from '../services/common';
import api from '../services/api';
import { platformContentType } from '../common/enum';
import './index.less';
import AreaSelector from '../components/AreaSelector';

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
  };

  mapRef = React.createRef();

  getCountryList = async continentId => {
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

  onAreaChange = areaData => {
    const { continent, country } = areaData;

    if (!this.continent || continent.id !== this.continent.id) {
      this.getCountryList(continent.id);

      this.continent = continent;
    }

    if (country.capitalLatitude && country.capitalLongitude) {
      if (!this.country || country.id !== this.country.id) {
        this.mapRef.current.updateArea(country.capitalLongitude, country.capitalLatitude);
      }
    }
  };

  componentDidMount = () => {
    this.getServiceList();
  };

  render() {
    const { aboutUs, classicCase, businessIntro } = this.props;
    const { continentList } = this.props;
    const { countryList, serviceList } = this.state;

    return (
      <div className="map">
        <Header />
        <div className="mapT">
          <Map ref={this.mapRef} />
          <div className="map-selector">
            <AreaSelector
              continentList={continentList}
              countryList={countryList}
              serviceList={serviceList}
              onChange={this.onAreaChange}
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
        </div>
        <div className="content contentAbout">
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
        <Footer />
      </div>
    );
  }
}
