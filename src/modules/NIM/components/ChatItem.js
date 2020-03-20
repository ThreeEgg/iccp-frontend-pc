/*
 * @Descripttion: 
 * @version: 
 * @Author: 毛翔宇
 * @Date: 2020-03-18 13:42:19
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-03-20 10:24:13
 * @FilePath: \PC端-前端\src\modules\NIM\components\ChatItem.js
 */

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


class ChatItem extends React.Component {

}
export default connect(({ chat }) => ({
    continueRobotAccid: chat.continueRobotAccid,
    robotslist: chat.robotslist,
    robotInfos: chat.robotInfos,
    robotInfosByNick: chat.robotInfosByNick,
}))(ChatItem);