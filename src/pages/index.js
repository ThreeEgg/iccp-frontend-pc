import React from 'react';
import Head from '../components/Head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Form, Input, Button, Switch } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import Router from 'next/router';
import Link from 'next/link';
import Map from '../components/Map';
import * as platformService from '../services/platform';
import api from '../services/api';
import { platformContentType } from '../common/enum';
import './index.less';
import AreaSelector from '../components/AreaSelector';

export default class extends React.Component {
  static async getInitialProps({ req, query }) {
    const fetch = require('isomorphic-unfetch');

    const requestUrl = 'http://221.215.57.110:9090/api' + api.listPlatformContent;
    //
    const aboutUsContentRes = await fetch(
      `${requestUrl}?pageNum=1&pageSize=1&languageId=0&type=${platformContentType.PLATFORMINTRO}`,
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

    return {
      // 关于我们
      aboutUs,
      // 业务介绍
      businessIntro,
      // 案例介绍
      classicCase,
    };
  }

  render() {
    const { aboutUs, classicCase, businessIntro } = this.props;

    return (
      <div className="map">
        <Header />
        <div className="mapT">
          <Map />
          <div className="map-selector">
            <AreaSelector />
          </div>
          <div className="business-intro">
            {businessIntro.map(item => {
              return (
                <div className="business-info">
                  <h1>业务介绍</h1>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum
                    laoreet.{' '}
                  </p>
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
              <Link href="/platform">
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
                      <h1>0{index + 1}</h1>
                      <p>BBC亚太地区业务案例分享</p>
                      <div>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod
                        bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra
                        justo commodo Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Aenean euismod bibendum laoreet.
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
