import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Router from 'next/router';
import { Menu } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import './platform.less';

const { SubMenu } = Menu;

export default class Platform extends React.Component {
    render () {
        return(
            <div className="platform">
                <Header />
                <div className="banner">
                    <img src="/images/img_header_bg.png"></img>
                    <div className="bannerTitle">
                        <div className="bannerText flex flex-align flex-justifyBetween">
                            <div>
                                    <img src="/images/ic_header_introduce.png"></img>
                                    Platform Introduce
                            </div>
                            <div>
                                <span className="icon iconfont ic_header_leadback"></span>
                                <a>返回首页</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content">

                </div>
                <Footer />
            </div>
        )
    }
}