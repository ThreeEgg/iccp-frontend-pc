import React from 'react';
import { Form, Input, Button, Switch } from 'antd';
import './expert_Header.less';

export default class expert_Header extends React.Component {
    render() {
        return(
            <div className="header">
                <img className='logo' src="/logo.svg" alt="" />
                <div className="line"></div>
                <div className="platName">国际风险管理平台</div>
            </div>
        );
    }

}