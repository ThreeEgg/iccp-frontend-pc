import React from 'react';
import { Form, Input, Button, Switch } from 'antd';
import './Header.less';

export default class Header extends React.Component {
    render() {
        return(
            <div className="header">
                <img className='logo' src="/logo.svg" alt="" />
                <div className="line"></div>
                <div className="platName">国际风险管理平台</div>
                <div className="type">
                    <Button>登录</Button>
                    <Button>注册</Button>
                    <div className="line"></div>  
                    <span className="en">En</span>
                    <Switch size="small" defaultChecked />
                    <span className="cn">简中</span>
                </div>
            </div>
        );
    }

}