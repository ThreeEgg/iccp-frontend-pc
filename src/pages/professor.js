import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Form, Input, Button, Switch, Calendar, Select, Radio, Col, Row } from 'antd';
const { Group } = Radio;
import Router from 'next/router';
import './professor.less';

export default class Platform extends React.Component {
    goToCommunication = () => {
        Router.push('');
    }
    timeList = () => {
        Router.push('');
    }

    render () {
        return(
            <div className="platformIndex">
                <Header />
                <div className="banner">
                    <img src="/images/img_header_bg.png"></img>
                    <div className="bannerTitle">
                        <div className="bannerText commonWidth flex flex-align flex-justifyBetween">
                            <div>
                                <img src="/images/ic_hearder_Professor.png"></img>
                                Professor Detail
                            </div>
                            <div>
                                {/* <span className="iconfont ic_header_leadback"></span> */}
                                <a href="/map">返回首页</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content">
                    <div className="content-pro-c commonWidth flex">
                        <div className="con-pro-r">
                            <div className="con-pro-r-img">
                                 <img className="img-avatar" src="/images/img_cardbg_hover.png"></img>
                                 <img className="img-type" src="/images/ic_online.png"></img>
                            </div>
                            <div className="con-pro-r-name">Steven Jackson</div>
                            <div className="con-pro-r-status">最近在线：现在</div>
                            <Button onClick={this.goToCommunication}>立即沟通</Button>
                            <div className="con-pro-r-title">本月日程</div>
                            <div className="con-pro-r-time">

                            </div>
                            <div className="con-pro-r-list flex flex-align flex-justifyBetween" onClick={this.timeList}>
                                查看专家时间表
                                <img src="/images/ic_date.png"></img>
                            </div>
                        </div>
                        <div className="con-pro-m">
                            
                        </div>
                        <div className="con-pro-l">
                            
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}