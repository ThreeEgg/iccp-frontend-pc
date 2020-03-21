import React from 'react';
import Head from '../components/Head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Form, Input, Button, Switch } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import Router from 'next/router';
import Map from '../components/Map';
import './map.less';

export default class extends React.Component {
  render() {
    return (
      <div className="map">
        <Header />
        <div className="mapT">
          <Map />
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
            <div className="content-c">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum
              laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin
              sodales pulvinar sic tempor. Sociis natoque penatibus et magnis dis parturient montes,
              nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus
              mollis orci, sed rhoncus pronin sapien nunc accuan eget.Lorem ipsum dolor sit amet,
              consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit
              amet lacus accumsan et viverra justo commodo.
            </div>
            <div className="content-b">
              <Button>
                More
                <RightOutlined style={{ fontSize: '12px', position: 'absolute', top: '10px' }} />
              </Button>
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
              <div className="item item1">
                <img src="/images/card1.png" />
                <div className="item-hover">
                  <h1>01</h1>
                  <p>BBC亚太地区业务案例分享</p>
                  <div>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum
                    laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum
                    laoreet.
                  </div>
                </div>
              </div>
              <div className="item item2">
                <img src="/images/card2.png" />
              </div>
              <div className="item item3">
                <img src="/images/card1.png" />
              </div>
            </div>
            <div className="content-b">
              <Button>
                More
                <RightOutlined style={{ fontSize: '12px', position: 'absolute', top: '10px' }} />
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
