/*
 * @Descripttion: 
 * @version: 
 * @Author: 毛翔宇
 * @Date: 2020-03-12 18:04:56
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-03-13 17:49:16
 * @FilePath: \PC端-前端\src\modules\NIM\pages\components\ChatEditor.js
 */
import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import config from '../../configs'
export default class ChatEditor extends React.Component {

    //在这里进行类型检测(这里的名字不是随便自定义的，规定这样写的)
    static propTypes = {
        type: PropTypes.string,
        scene: PropTypes.string,
        to: PropTypes.string,
        isRobot: PropTypes.boolean,
        invalid: PropTypes.boolean,
        invalidHint: PropTypes.string,
        advancedTeam: PropTypes.boolean,
    }
    //如果没有传值，可以给一个默认值
    static defaultProps = {
        isRobot: false,
        invalid: false,
        invalidHint: '您无权限发送消息',
        advancedTeam: false,
    }

    state = {
        isEmojiShown: false,
        isRobotListShown: false,
        msgToSent: '',
        icon1: `${config.resourceUrl}/im/chat-editor-1.png`,
        icon2: `${config.resourceUrl}/im/chat-editor-2.png`,
        icon3: `${config.resourceUrl}/im/chat-editor-3.png`,
        icon4: `https://yx-web-nosdn.netease.im/quickhtml%2Fassets%2Fyunxin%2Fdefault%2Fchat-editor-keyboard.png`,
        icon5: `https://yx-web-nosdn.netease.im/quickhtml%2Fassets%2Fyunxin%2Fdefault%2Fchat-editor-record.png`,
        sendTxt: true,
        recording: false,
        recordDisable: false,
        toRecordCount: 0,
        recordTime: 0,
        $recordTime: null,
        recordTimeout: '',
        recorder: null,
        audioContext: null
    }

    componentDidMount = () => {
        try {
            this.setState({
                audioContext: new window.AudioContext
            });
        } catch (e) {
            this.setState({
                recordDisable: true
            });
            console.error(e)
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.continueRobotAccid !== this.props.continueRobotAccid) {
            if (prevProps.continueRobotAccid && this.robotInfos[prevProps.continueRobotAccid]) {
                this.setState({
                    msgToSent: `@${this.robotInfos[prevProps.continueRobotAccid].nick} `
                })
            }
            // 重置
            this.props.dispatch('chat/continueRobotMsg', '')
        }
        if (prevState.msgToSent !== this.state.msgToSent) {
            if (this.isRobot) {
                return
            }
            let indexAt = this.msgToSent.indexOf('@')
            if (indexAt >= 0 && (indexAt === this.msgToSent.length - 1)) {
                if (this.robotslist && this.robotslist.length > 0) {
                    this.setState({
                        isRobotListShown: true
                    })
                }
            } else if (this.isRobotListShown === true) {
                this.setState({
                    isRobotListShown: false
                })
            }
        }
    }

    sendTextMsg = () => {
        if (this.invalid) {
            this.$toast(this.invalidHint)
            return
        }
        if (/^\s*$/.test(this.msgToSent)) {
            message.warning('请不要发送空消息');
            return
        } else if (this.msgToSent.length > 800) {
            message.warning('请不要超过800个');
            return
        }
        this.msgToSent = this.msgToSent.trim()
        if (this.type === 'session') {
            // 如果是机器人
            if (this.isRobot) {
                this.$store.dispatch('sendRobotMsg', {
                    type: 'text',
                    scene: this.scene,
                    to: this.to,
                    robotAccid: this.to,
                    // 机器人后台消息
                    content: this.msgToSent,
                    // 显示的文本消息
                    body: this.msgToSent
                })
            } else {
                let robotAccid = ''
                let robotText = ''

                let atUsers = this.msgToSent.match(/@[^\s@$]+/g)
                if (atUsers) {
                    for (let i = 0; i < atUsers.length; i++) {
                        let item = atUsers[i].replace('@', '')
                        if (this.robotInfosByNick[item]) {
                            robotAccid = this.robotInfosByNick[item].account
                            robotText = (this.msgToSent + '').replace(atUsers[i], '').trim()
                            break
                        }
                    }
                }
                if (robotAccid) {
                    if (robotText) {
                        this.$store.dispatch('sendRobotMsg', {
                            type: 'text',
                            scene: this.scene,
                            to: this.to,
                            robotAccid,
                            // 机器人后台消息
                            content: robotText,
                            // 显示的文本消息
                            body: this.msgToSent
                        })
                    } else {
                        this.$store.dispatch('sendRobotMsg', {
                            type: 'welcome',
                            scene: this.scene,
                            to: this.to,
                            robotAccid,
                            // 显示的文本消息
                            body: this.msgToSent
                        })
                    }
                } else {
                    this.$store.dispatch('sendMsg', {
                        type: 'text',
                        scene: this.scene,
                        to: this.to,
                        text: this.msgToSent
                    })
                }
            }
        } else if (this.type === 'chatroom') {
            let robotAccid = ''
            let robotText = ''

            let atUsers = this.msgToSent.match(/@[^\s@$]+/g)
            if (atUsers) {
                for (let i = 0; i < atUsers.length; i++) {
                    let item = atUsers[i].replace('@', '')
                    if (this.robotInfosByNick[item]) {
                        robotAccid = this.robotInfosByNick[item].account
                        robotText = (this.msgToSent + '').replace(atUsers[i], '').trim()
                        break
                    }
                }
            }
            if (robotAccid) {
                if (robotText) {
                    this.$store.dispatch('sendChatroomRobotMsg', {
                        type: 'text',
                        robotAccid,
                        // 机器人后台消息
                        content: robotText,
                        // 显示的文本消息
                        body: this.msgToSent
                    })
                } else {
                    this.$store.dispatch('sendChatroomRobotMsg', {
                        type: 'welcome',
                        robotAccid,
                        // 显示的文本消息
                        body: this.msgToSent
                    })
                }
            } else {
                this.$store.dispatch('sendChatroomMsg', {
                    type: 'text',
                    text: this.msgToSent
                })
            }
        }
        this.msgToSent = ''
    }

    render() {
        const { chat } = this.props;
        const { continueRobotAccid, robotslist, robotInfos, robotInfosByNick } = chat;
        return (
            <div class="m-chat-editor" onClick="hideRobotList" >
                {/* <group v-show="isRobotListShown" class="m-chat-emoji m-chat-robot">
                    <cell v-for="robot in robotslist" : title="robot.nick" :key="robot.account" @click.native="chooseRobot(robot)">
        <img class="icon u-circle" slot="icon" width="20" height="20" : src="robot.avatar">
      </cell>
    </group >
            <div class="m-chat-editor-main" : class="{robot:isRobot}">
                <span class="u-editor-input">
                    <textarea v-if="sendTxt" v-model="msgToSent" @focus='onInputFocus'></textarea>
                <i v-if="supportTouch && !sendTxt" class="u-btn-record" : class="{'recording':recording, 'disabled': recordDisable}" @touchstart.prevent='toRecord' v-touch:swipeup='cancelRecord' @touchend.prevent='sendRecordMsg'>
          <b v-if="recording">松开结束</b>
                <b v-else>按下说话</b>
                <a v-if="recording" id="recordTime" class="u-record-time">00:00</a>
        </i>
            <i v-if="!supportTouch && !sendTxt" class="u-btn-record" : class="{'recording':recording, 'disabled': recordDisable}" @click.stop="siwtchRecord" >
                <b v-if="recording">点击发送</b>
                <b v-else>点击说话</b>
                <a v-if="recording" id="recordTime" class="u-record-time with-close-btn" @click.stop="cancelRecord" > 00: 00</a >
        </i >
      </span >
            <span class="u-editor-icons">
                <span v-if="sendTxt" class="u-editor-icon" @click.stop="swicthMsgType">
          <i class="u-icon-img"><img : src="icon5"></i>
            </span>
            <span v-else class="u-editor-icon" @click.stop="swicthMsgType" >
                <i class="u-icon-img"><img : src="icon4"></i>
        </span >
            <span v-if="!isRobot" class="u-editor-icon" @click.stop="showEmoji" >
                <i class="u-icon-img"><img : src="icon1"></i>
        </span >
            <span v-if="!isRobot" class="u-editor-icon">
                <i class="u-icon-img"><img : src="icon2"></i>
                <input type="file" ref="fileToSent" @change="sendFileMsg">
        </span>
            <span v-if="!isRobot && !advancedTeam" class="u-editor-icon" @click.stop="sendPlayMsg" >
                <i class="u-icon-img"><img : src="icon3"></i>
        </span >
            <span v-if='advancedTeam' class="u-editor-send u-editor-receipt" @click="turnToMsgReceipt" > 回执</span >
                <span class="u-editor-send" @click="sendTextMsg" > 发 送</span >
      </span >
    </div > */}
            </div >
        );
    }
}
export default connect(({ chat }) => ({
    continueRobotAccid: chat.continueRobotAccid,
    robotslist: chat.robotslist,
    robotInfos: chat.robotInfos,
    robotInfosByNick: chat.robotInfosByNick,
}))(ChatEditor);
