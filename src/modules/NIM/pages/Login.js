/*
 * @Descripttion: 
 * @version: 
 * @Author: 毛翔宇
 * @Date: 2020-03-19 14:11:19
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-03-19 16:19:27
 * @FilePath: \PC端-前端\src\modules\NIM\pages\Login.js
 */
import React from 'react';
import BasicLayout from '../../../layouts/BasicLayout';
import { Button } from 'antd';

import md5 from '../utils/md5'
import cookie from '../utils/cookie'
import config from '../configs'

export default class Login extends React.Component {
    state = {
        logo: config.logo,
        account: '',
        password: '',
        errorMsg: ''
    }
    login() {
        if (this.account === '') {
            this.errorMsg = '帐号不能为空'
            return
        } else if (this.password === '') {
            this.errorMsg = '密码不能为空'
            return
        } else if (this.password.length < 6) {
            this.errorMsg = '密码至少需要6位'
            return
        }
        this.errorMsg = ''
        // 本demo做一次假登录
        // 真实场景应在此向服务器发起ajax请求
        let sdktoken = md5(this.password)
        // 服务端帐号均为小写
        cookie.setCookie('uid', this.account.toLowerCase())
        cookie.setCookie('sdktoken', sdktoken)
    }
    render() {
        return (
            <BasicLayout>
                <div class="g-window">
                    <div class="g-inherit m-album" >
                        <div id="form-data" class="g-center m-login" >
                            <div class="cells">
                                <img class="logo" src={logo} />
                            </div>
                            <div class="cells">
                                <div class="cell">
                                    <span class="icon icon-account"></span>
                                    <input type="text" class="ipt ipt-account" maxlength="20" v-model="account" placeholder="请输入帐号" />
                                </div>
                                <div class="cell">
                                    <span class="icon icon-pwd"></span>
                                    <input type="password" class="ipt ipt-account" maxlength="20" v-model="password" placeholder="请输入密码" />
                                </div>
                            </div>
                            <div class="cells">
                                {errorMsg ? <div class="error">{errorMsg}</div> : ''}
                            </div>
                            <div class="cells">
                                <Button className="btn btn-login" onclick={login}>登录</Button>
                                {/* <Button className="btn btn-regist" onclick={regist}>注册</Button> */}
                            </div>
                        </div>
                    </div>
                </div>
            </BasicLayout>
        );
    }
}