/*
 * @Descripttion:
 * @version:
 * @Author: 毛翔宇
 * @Date: 2020-03-16 15:56:52
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-04-07 16:35:08
 * @FilePath: \PC端-前端\src\modules\NIM\dva\reducers\index.js
 */
// 更改 dva 的 state 中的状态的唯一方法是提交 reducers
// put({ type: 'caculate', delta });

import util from '../../utils';
import config from '../../configs';

export default {
  updateLogin(state, { isLogin }) {
    return { ...state, isLogin };
  },
  updateLogin(state, { isLogin }) {
    return { ...state, isLogin };
  },
  updateNim(state, { nim }) {
    return { ...state, nim };
  },
  initState(state) {
    return {
      ...state,
      // 登录状态
      isLogin: false,
      // 正在加载中
      isLoading: true,
      // 操作是否是刷新页面，刷新初始没有nim实例，会导致时序问题
      isRefresh: true,
      // 全屏显示的原图
      isFullscreenImgShow: false,
      fullscreenImgSrc: '',
      // 切页动画 forward，backward
      transitionName: 'forward',
      // 登录账户ID
      userUID: null,
      // 用户名片
      myInfo: {},
      // 好友/黑名单/陌生人名片, 数据结构如：{cid: {attr: ...}, ...}
      userInfos: {},
      // 用户订阅的事件同步, 数据结构如：{cid: {typeid: {...}, ...}, ...}
      userSubscribes: {},

      // 好友列表
      friendslist: [],
      // 机器人列表
      robotslist: [],
      // 用于判定帐号是否是robots
      robotInfos: {},
      robotInfosByNick: {},
      // 黑名单列表
      blacklist: [],
      // 禁言列表
      // mutelist: [],

      teamlist: [],
      // 群自身的属性，数据结构如：{tid: {attr: ...}, ...}
      // teamAttrs: {},
      // 群对象的成员列表，数据结构如：{tid: {members: [...], ...}, ...}
      teamMembers: {},
      // 关闭群提醒的群id列表
      muteTeamIds: [],
      // 群设置传递数据
      teamSettingConfig: {},

      // 已发送群消息回执Map,key为群Id
      sentReceipedMap: {},
      // 当前群消息回执查询的群id
      currReceiptQueryTeamId: null,
      // 群消息回执查询的消息列表
      receiptQueryList: [],
      // 群消息回执查询结果列表
      teamMsgReads: [],
      // 群消息已读未读账号列表
      teamMsgReadsDetail: {
        readAccounts: [],
        unreadAccounts: [],
      },

      // 消息列表
      msgs: {}, // 以sessionId作为key
      msgsMap: {}, // 以idClient作为key，诸如消息撤回等的消息查找
      // 会话列表
      sessionlist: [],
      sessionMap: {},
      // 当前会话ID（即当前聊天列表，只有单聊群聊采用，可用于判别）
      currSessionId: null,
      currSessionMsgs: [],
      // 是否有更多历史消息，用于上拉加载更多
      noMoreHistoryMsgs: false,
      // 继续对话的机器人id
      continueRobotAccid: '',

      // 系统消息
      sysMsgs: [],
      customSysMsgs: [],
      sysMsgUnread: {
        total: 0,
      },
      customSysMsgUnread: 0,

      // 临时变量
      // 缓存需要获取的用户信息账号,如searchUser
      searchedUsers: [],
      // 缓存需要获取的群组账号
      searchedTeams: [],

      // 聊天室相关
      // 聊天室sdk实例
      chatroomInsts: {},
      chatroomInfos: {},
      // 聊天室分房间消息集合
      chatroomMsgs: {},
      // 当前聊天室实例及id
      currChatroom: null,
      currChatroomId: null,
      currChatroomMsgs: [],
      currChatroomInfo: {},
      // 聊天室成员列表
      currChatroomMembers: [],

      //  自定义信息
      // 所有会话未读消息数
      unreadCount: 0,
      // 是否有客服会话
      hasServiceSession: false,
      // 客服信息
      serviceInfo: {},
      // 平台用户列表
      iccpUserInfos: {},
      // 当前会话的用户ID
      currUserInfo: {},
    };
  },
  disconnect(state) {
    let { nim } = state;
    if (nim) {
      nim.disconnect();
    }
    nim = window.nim = null;
    return { ...state, nim };
  },
  updateCurrSession(state, { currSessionId }) {
    return { ...state, currSessionId };
  },
  updateRefreshState(state) {
    return { ...state, isRefresh: false };
  },
  updateFullscreenImage(state, payload) {
    const { src, method } = payload;
    if (src && method === 'show') {
      state.fullscreenImgSrc = src;
      state.isFullscreenImgShow = true;
    } else if (method === 'hide') {
      state.fullscreenImgSrc = ' ';
      state.isFullscreenImgShow = false;
    }
  },
  updateUserUID(state, payload) {
    const { loginInfo } = payload;
    let imInfo = {};
    imInfo.accid = loginInfo.uid;
    imInfo.token = loginInfo.sdktoken;
    localStorage.imInfo = JSON.stringify(imInfo);
    return {
      ...state,
      userUID: loginInfo.uid,
      sdktoken: loginInfo.sdktoken,
      isLogin: true,
    };
  },
  updateMyInfo(state, { myInfo }) {
    const { myInfoOld } = state;
    myInfo = util.mergeObject(myInfoOld, myInfo);
    return { ...state, myInfo: myInfo };
  },
  updateUserInfo(state, { users }) {
    const { userInfos } = state;
    let temp = { ...userInfos };
    users.forEach(user => {
      let account = user.account;
      if (account) {
        temp[account] = util.mergeObject(temp[account], user);
      }
    });
    temp = util.mergeObject(userInfos, temp);
    return { ...state, userInfos: temp };
  },
  updateFriends(state, { friends, cutFriends = [] }) {
    const { nim } = state;
    let { friendslist } = state;
    friendslist = nim.mergeFriends(friendslist, friends);
    // friendslist = nim.cutFriends(friendslist, cutFriends)
    friendslist = nim.cutFriends(friendslist, friends.invalid);
    return { ...state, friendslist };
  },
  updateRobots(state, { robots }) {
    const { nim, robotInfosByNick: robotInfosByNickOld } = state;
    let robotInfosByNick = { ...robotInfosByNickOld };

    robots = robots.map(item => {
      if (item.avatar) {
        item.originAvatar = item.avatar;
        item.avatar = nim.viewImageSync({
          url: item.avatar, // 必填
          thumbnail: {
            // 生成缩略图， 可选填
            width: 40,
            height: 40,
            mode: 'cover',
          },
        });
      } else {
        item.avatar = config.defaultUserIcon;
      }
      return item;
    });
    let robotslist = robots;
    let robotInfos = Object.create(null);
    robots.forEach(robot => {
      robotInfos[robot.account] = robot;
      robotInfosByNick[robot.nick] = robot;
    });
    return { ...state, robotslist, robotInfos, robotInfosByNick };
  },
  updateBlacklist(state, { blacks }) {
    const { nim } = state;
    let blacklist = nim.cutFriends(state.blacklist, blacks.invalid);
    let addBlacks = blacks.filter(item => {
      return item.isBlack === true;
    });
    let remBlacks = blacks.filter(item => {
      return item.isBlack === false;
    });
    // 添加黑名单
    blacklist = nim.mergeFriends(blacklist, addBlacks);
    // 解除黑名单
    blacklist = nim.cutFriends(blacklist, remBlacks);
    return { ...state, blacklist };
  },
  updateSearchlist(state, { method, list }) {
    const { searchedUsers, searchedTeams } = state;
    method = method || '';
    switch (method) {
      case 'user':
        if (list.length !== 0 || searchedUsers.length !== 0) {
          return { ...state, searchedUsers: list };
        } else {
          return { ...state, searchedUsers: [] };
        }
      case 'team':
        if (list.length !== 0 || searchedTeams.length !== 0) {
          return { ...state, searchedTeams: list };
        } else {
          return { ...state, searchedTeams: [] };
        }
    }
  },
  updateSessions(state, { sessions }) {
    const {
      nim,
      userUID,
      serviceInfo,
      iccpUserInfos,
      teamlist,
      sessionlist: sessionlistOld,
      sessionMap: sessionMapOld,
    } = state;
    let { hasServiceSession } = state;
    let sessionlist = [...sessionlistOld] || [],
      sessionMap = { ...sessionMapOld } || {},
      unreadCount = 0;
    // 更新会话列表
    sessions = sessions.filter(item => {
      item.name = '未知';
      item.avatar = '';
      item.show = true;
      if (item.scene === 'p2p') {
        let userInfo = null;
        if (item.to !== userUID) {
          // userInfo = userInfos[item.to];
          if (item.to === serviceInfo.accid) {
            userInfo = serviceInfo;
            item.isService = true;
          } else {
            item.isService = false;
            userInfo = iccpUserInfos[item.to] || null;
          }
        } else {
          item.show = false;
        }
        if (userInfo) {
          item.name = userInfo.name;
          item.avatar = userInfo.image;
        } else {
          item.show = false;
        }
      } else if (item.scene === 'team') {
        let teamInfo = null;
        teamInfo = teamlist.find(team => {
          return team.teamId === item.to;
        });
        if (teamInfo) {
          item.name = teamInfo.name;
          item.avatar =
            teamInfo.avatar ||
            (teamInfo.type === 'normal' ? config.defaultGroupIcon : config.defaultAdvancedIcon);
        } else {
          item.name = `群${item.to}`;
          item.avatar = item.avatar || config.defaultGroupIcon;
        }
        // 去掉群聊
        return;
      }
      let lastMsg = item.lastMsg || {};
      if (lastMsg.type === 'text') {
        item.lastMsgShow = lastMsg.text || '';
      } else if (lastMsg.type === 'custom') {
        item.lastMsgShow = util.parseCustomMsg(lastMsg);
      } else if (lastMsg.scene === 'team' && lastMsg.type === 'notification') {
        item.lastMsgShow = util.generateTeamSysmMsg(lastMsg);
      } else if (util.mapMsgType(lastMsg)) {
        item.lastMsgShow = `[${util.mapMsgType(lastMsg)}]`;
      } else {
        item.lastMsgShow = '';
      }
      if (item.updateTime) {
        item.updateTimeShow = util.formatDate(item.updateTime, true);
      }
      return item;
    });
    sessionlist = nim.mergeSessions(sessionlist, sessions);
    sessionlist.sort((a, b) => {
      return b.updateTime - a.updateTime;
    });
    sessionlist.sort((a, b) => {
      return a.isService ? -1 : 1;
    });
    if (!hasServiceSession) {
      sessionlist.some(item => {
        if (item.isService) {
          hasServiceSession = true;
          return hasServiceSession;
        }
      });
    }
    sessionlist.forEach(item => {
      if (item.show) {
        unreadCount += item.unread;
      }
      sessionMap[item.id] = item;
    });
    return { ...state, sessionlist, sessionMap, unreadCount, hasServiceSession };
  },
  updateServiceInfo(state, { serviceInfo }) {
    serviceInfo.image = `/im/ic_im_service.svg`;
    return { ...state, serviceInfo };
  },
  updateiccpUserInfos(state, { iccpUserList }) {
    const { iccpUserInfos: iccpUserInfosOld } = state;
    let iccpUserInfos = { ...iccpUserInfosOld };
    iccpUserList &&
      iccpUserList.forEach(item => {
        iccpUserInfos[item.accid] = item;
      });
    return { ...state, iccpUserInfos };
  },
  deleteSessions(state, { sessionIds }) {
    const { nim } = state;
    return { ...state, sessionlist: nim.cutSessionsByIds(state.sessionlist, sessionIds) };
  },
  // 初始化，收到离线漫游消息时调用
  updateMsgs(state, { msgs }) {
    const { nim, msgs: msgsOld } = state;
    let msgsNew = { ...msgsOld };
    msgs.forEach(msg => {
      let sessionId = msg.sessionId;
      if (!msgsNew[sessionId]) {
        msgsNew[sessionId] = [];
      }
      // sdk会做消息去重
      msgsNew[sessionId] = nim.mergeMsgs(msgsNew[sessionId], [msg]);
      // state.msgs[sessionId].push(msg)
    });
    return { ...state, msgs: msgsNew };
  },
  // 更新追加消息，追加一条消息
  updateMsg(state, { msg }) {
    const { msgs } = state;
    let sessionId = msg.sessionId;
    let msgsNew = { ...msgs };
    let temp = Object.keys(msgsNew).length > 0 && msgsNew[sessionId];
    let msgNew = temp ? [...temp] : [];
    let lastMsgIndex = msgNew.length - 1;
    if (msgNew.length === 0 || msg.time >= msgNew[lastMsgIndex].time) {
      msgNew.push(msg);
    } else {
      for (let i = lastMsgIndex; i >= 0; i--) {
        let currMsg = msgNew[i];
        if (msg.time >= currMsg.time) {
          msgNew.splice(i, 0, msg);
          break;
        }
      }
    }
    msgsNew[sessionId] = msgNew;
    return { ...state, msgs: msgsNew };
  },
  // 删除消息列表消息
  deleteMsg(state, msg) {
    let sessionId = msg.sessionId;
    let tempMsgs = state.msgs[sessionId];
    if (!tempMsgs || tempMsgs.length === 0) {
      return;
    }
    let lastMsgIndex = tempMsgs.length - 1;
    for (let i = lastMsgIndex; i >= 0; i--) {
      let currMsg = tempMsgs[i];
      if (msg.idClient === currMsg.idClient) {
        state.msgs[sessionId].splice(i, 1);
        break;
      }
    }
  },
  // 替换消息列表消息，如消息撤回
  replaceMsg(state, { sessionId, idClient, msg }) {
    let tempMsgs = state.msgs[sessionId];
    if (!tempMsgs || tempMsgs.length === 0) {
      return;
    }
    let lastMsgIndex = tempMsgs.length - 1;
    for (let i = lastMsgIndex; i >= 0; i--) {
      let currMsg = tempMsgs[i];
      console.log(idClient, currMsg.idClient, currMsg.text);
      if (idClient === currMsg.idClient) {
        state.msgs[sessionId].splice(i, 1, msg);
        break;
      }
    }
  },
  // 用idClient 更新消息，目前用于消息撤回
  updateMsgByIdClient(state, { msgs }) {
    const { msgsMap: msgsMapOld } = state;
    let msgsMap = { ...msgsMapOld };
    let tempTime = new Date().getTime();
    msgs.forEach(msg => {
      // 有idClient 且 5分钟以内的消息
      if (msg.idClient && tempTime - msg.time < 1000 * 300) {
        msgsMap[msg.idClient] = msg;
      }
    });
    return { ...state, msgsMap };
  },
  // 更新当前会话id，用于唯一判定是否在current session状态
  updateCurrSessionId(state, { method, sessionId }) {
    const { currSessionId } = state;

    if (method === 'destroy') {
      return { ...state, currSessionId: null };
    } else if (method === 'init') {
      if (sessionId && sessionId !== currSessionId) {
        return { ...state, currSessionId: sessionId };
      }
    }
  },
  destroyCurrSessionMsgs(state) {
    // 清空会话消息
    return { ...state, currSessionMsgs: [], currSessionLastMsg: null };
  },
  initCurrSessionMsgs(state) {
    // 初始化会话消息列表
    const { currSessionId, msgs } = state;
    if (currSessionId) {
      let currSessionLastMsg = null;
      let currSessionMsgs = [].concat(msgs[currSessionId] || []);
      // 做消息截断
      let limit = config.localMsglimit;
      let msgLen = currSessionMsgs.length;
      if (msgLen - limit > 0) {
        currSessionLastMsg = currSessionMsgs[msgLen - limit];
        currSessionMsgs = currSessionMsgs.slice(msgLen - limit, msgLen);
      } else if (msgLen > 0) {
        currSessionLastMsg = currSessionMsgs[0];
      }
      let currSessionMsgsNew = [];
      let lastMsgTime = 0;
      currSessionMsgs.forEach(msg => {
        if (msg.time - lastMsgTime > 1000 * 60 * 5) {
          lastMsgTime = msg.time;
          currSessionMsgsNew.push({
            type: 'timeTag',
            text: util.formatDate(msg.time, false),
          });
        }
        currSessionMsgsNew.push(msg);
      });
      return { ...state, currSessionMsgs: currSessionMsgsNew, currSessionLastMsg };
    }
  },
  putCurrSessionMsgs(state, { msg }) {
    // 追加一条消息
    const { currSessionMsgs: currSessionMsgsOld } = state;
    let currSessionMsgs = [...currSessionMsgsOld];
    let lastMsgTime = 0;
    let lenCurrMsgs = currSessionMsgs.length;
    if (lenCurrMsgs > 0) {
      lastMsgTime = currSessionMsgs[lenCurrMsgs - 1].time;
    }
    if (msg.time - lastMsgTime > 1000 * 60 * 5) {
      currSessionMsgs.push({
        type: 'timeTag',
        text: util.formatDate(msg.time, false),
      });
    }
    currSessionMsgs.push(msg);
    return { ...state, currSessionMsgs };
  },
  concatCurrSessionMsgs(state, { msgs }) {
    // 一般用于历史消息拼接
    const { currSessionMsgsOld } = state;
    let currSessionMsgs = { ...currSessionMsgsOld };
    let temp = [];
    let lastMsgTime = 0;
    msgs.forEach(msg => {
      if (msg.time - lastMsgTime > 1000 * 60 * 5) {
        lastMsgTime = msg.time;
        temp.push({
          type: 'timeTag',
          text: util.formatDate(msg.time, false),
        });
      }
      temp.push(msg);
    });
    temp.reverse();
    temp.forEach(msg => {
      currSessionMsgs.unshift(msg);
    });
    if (msgs[0]) {
      return { ...state, currSessionMsgs, currSessionLastMsg: msgs[0] };
    } else {
      return { ...state, currSessionMsgs };
    }
  },
  replaceCurrSessionMsgs(state, { msg, idClient }) {
    // 替换idClient的消息
    const { currSessionMsgsOld } = state;
    let currSessionMsgs = { ...currSessionMsgsOld };
    let msgLen = currSessionMsgs.length;
    let lastMsgIndex = msgLen - 1;
    if (msgLen > 0) {
      for (let i = lastMsgIndex; i >= 0; i--) {
        if (currSessionMsgs[i].idClient === idClient) {
          currSessionMsgs.splice(i, 1, msg);
          break;
        }
      }
    }
    return { ...state, currSessionMsgs };
  },
  updateSysMsgs(state, sysMsgs) {
    const { nim } = state;
    if (!Array.isArray(sysMsgs)) {
      sysMsgs = [sysMsgs];
    }
    sysMsgs = sysMsgs.map(msg => {
      msg.showTime = util.formatDate(msg.time, false);
      return msg;
    });
    // state.sysMsgs = nim.mergeSysMsgs(state.sysMsgs, sysMsgs)
    state.sysMsgs = [].concat(nim.mergeSysMsgs(state.sysMsgs, sysMsgs));
    Vue.set(state, sysMsgs, state.sysMsgs);
  },
  // 更新消息的状态，如管理员批准或拒绝入群后，会收到新消息，更新入群申请的状态
  updateSysMsgState(state, sysMsg) {
    let exitMsg = state.sysMsgs.find(msg => {
      return msg.idServer === sysMsg.idServer;
    });
    if (exitMsg) {
      exitMsg.state = sysMsg.state;
    }
  },
  updateSysMsgUnread(state, obj) {
    state.sysMsgUnread = Object.assign({}, obj);
  },
  updateCustomSysMsgs(state, sysMsgs) {
    const { nim } = state;
    if (!Array.isArray(sysMsgs)) {
      sysMsgs = [sysMsgs];
    }
    sysMsgs = sysMsgs.map(msg => {
      msg.showTime = util.formatDate(msg.time, false);
      return msg;
    });
    // state.customSysMsgs = nim.mergeSysMsgs(state.customSysMsgs, sysMsgs)
    state.customSysMsgs = state.customSysMsgs.concat(sysMsgs);
    Vue.set(state, sysMsgs, state.customSysMsgs);
    // store.commit('updateCustomSysMsgUnread', {
    //   type: 'add',
    //   unread: sysMsgs.length
    // })
  },
  updateCustomSysMsgUnread(state, obj) {
    let { type, unread } = obj;
    switch (type) {
      case 'reset':
        state.customSysMsgUnread = unread || 0;
        break;
      case 'add':
        state.customSysMsgUnread += unread;
        break;
    }
  },
  resetSysMsgs(state, obj) {
    let type = obj.type;
    switch (type) {
      case 0:
        state.sysMsgs = [];
        break;
      case 1:
        state.customSysMsgs = [];
        // store.commit('updateCustomSysMsgUnread', {
        //   type: 'reset'
        // })
        break;
    }
  },
  deleteSysMsgs(state, obj) {
    let type = obj.type;
    let idServer = obj.idServer;
    let arr = type === 0 ? state.sysMsgs : state.customSysMsgs;
    arr = arr.filter(msg => {
      return msg.idServer !== idServer;
    });
    Vue.set(state, 'sysMsgs', arr);
  },
  setNoMoreHistoryMsgs(state) {
    return { ...state, noMoreHistoryMsgs: true };
  },
  resetNoMoreHistoryMsgs(state) {
    return { ...state, noMoreHistoryMsgs: false };
  },
  // 继续与机器人会话交互
  continueRobotMsg(state, robotAccid) {
    state.continueRobotAccid = robotAccid;
  },

  initChatroomInfos(state, obj) {
    state.chatroomInfos = obj;
  },
  setCurrChatroom(state, chatroomId) {
    state.currChatroomId = chatroomId;
    state.currChatroom = state.chatroomInsts[chatroomId];
    state.currChatroomMsgs = [];
    state.currChatroomInfo = {};
    state.currChatroomMembers = [];
  },
  resetCurrChatroom(state) {
    state.currChatroomId = null;
    state.currChatroom = null;
    state.currChatroomMsgs = [];
    state.currChatroomInfo = {};
    state.currChatroomMembers = [];
  },
  // 聊天室相关逻辑
  updateChatroomInfo(state, obj) {
    state.currChatroomInfo = Object.assign(state.currChatroomInfo, obj);
  },
  updateCurrChatroomMsgs(state, obj) {
    let { type, msgs } = Object.assign({}, obj);
    if (type === 'put') {
      msgs.forEach(msg => {
        let chatroomId = msg.chatroomId;
        if (chatroomId === state.currChatroomId) {
          msgs.forEach(msg => {
            state.currChatroomMsgs.push(msg);
          });
        }
      });
    } else if (type === 'concat') {
      // 一般用于历史消息拼接
      let currSessionMsgs = obj.msgs;
      currSessionMsgs.reverse();
      currSessionMsgs.forEach(msg => {
        state.currSessionMsgs.unshift(msg);
      });
      if (obj.msgs[0]) {
        state.currSessionLastMsg = obj.msgs[0];
      }
    }
  },
  getChatroomInfo(state, obj) {
    state.currChatroomInfo = obj;
  },
  updateChatroomMembers(state, obj) {
    let { type, members } = obj;
    if (type === 'destroy') {
      state.currChatroomMembers = [];
    } else if (type === 'put') {
      members.forEach(member => {
        if (member.online) {
          state.currChatroomMembers.push(member);
        }
      });
    }
  },
  updateTeamList(state, teams) {
    const { nim } = state;
    // store.state.teamlist = nim.mergeTeams(store.state.teamlist, teams)
    // store.state.teamlist = nim.cutTeams(store.state.teamlist, teams.invalid)
  },
  updateTeamMembers(state, obj) {
    const { nim } = state;
    var teamId = obj.teamId;
    var members = obj.members;
    state.teamMembers = state.teamMembers || {};
    state.teamMembers[teamId] = nim.mergeTeamMembers(state.teamMembers[teamId], members);
    state.teamMembers[teamId] = nim.cutTeamMembers(state.teamMembers[teamId], members.invalid);
    state.teamMembers[teamId].sort((a, b) => {
      // 将群主和管理员排在队列前方
      if (a.type === 'owner' || b.type === 'owner') {
        return a.type === 'owner' ? -1 : 1;
      }
      if (a.type === 'manager' || b.type === 'manager') {
        return a.type === 'manager' ? -1 : b.type === 'manager' ? 1 : 0;
      }
      return -1;
    });
    state.teamMembers = Object.assign({}, state.teamMembers);
  },
  removeTeamMembersByAccounts(state, obj) {
    var teamId = obj.teamId;
    var invalidAccounts = obj.accounts;
    if (state.teamMembers[teamId] === undefined) return;
    state.teamMembers[teamId] = state.teamMembers[teamId].filter((member, index) => {
      return invalidAccounts.indexOf(member.account) === -1;
    });
    state.teamMembers = Object.assign({}, state.teamMembers);
  },
  updateTeamInfo(state, team) {
    var index = state.teamlist.findIndex(item => {
      return item.teamId === team.teamId;
    });
    if (index === -1) return;
    for (const key in team) {
      if (key !== 'teamId' && team.hasOwnProperty(key) && team[key]) {
        state.teamlist[index][key] = team[key];
      }
    }
  },
  updateTeamSettingConfig(state, obj) {
    state.teamSettingConfig = obj;
  },
  updateSentReceipedMap(state, obj) {
    if (!obj || obj.length < 1) {
      return;
    }
    var teamId = obj[0].teamId;
    if (!state.sentReceipedMap[teamId]) {
      state.sentReceipedMap[teamId] = [];
    }
    state.sentReceipedMap[teamId].push(...obj.map(msg => msg.idServer));
  },
  updateReceiptQueryList(state, obj) {
    if (state.currReceiptQueryTeamId !== obj.teamId) {
      state.receiptQueryList = [];
      state.teamMsgReads = [];
      state.currReceiptQueryTeamId = obj.teamId;
    }
    var needQuery = obj.msgs
      .filter(
        msg =>
          msg.needMsgReceipt &&
          msg.from === state.myInfo.account &&
          !state.receiptQueryList.find(item => item.idServer === msg.idServer),
      )
      .map(msg => {
        return {
          teamId: obj.teamId,
          idServer: msg.idServer,
        };
      });
    if (needQuery.length > 0) {
      state.receiptQueryList.push(...needQuery);
    }
    if (needQuery.length > 0) {
      // store.dispatch('getTeamMsgReads', needQuery)
    }
  },
  updateTeamMsgReads(state, obj) {
    state.teamMsgReads.push(...obj.teamMsgReceipts);
  },
  updateSingleTeamMsgReads(state, obj) {
    state.teamMsgReads.forEach(item => {
      if (item.idServer === obj.idServer) {
        item.unread = obj.unread;
        item.read = obj.read;
      }
    });
    // 更新已读未读账号列表
    var unreadAccounts = state.teamMsgReadsDetail.unreadAccounts;
    var findIndex = unreadAccounts.findIndex(account => account === obj.account);
    if (findIndex >= 0) {
      unreadAccounts.splice(findIndex, 1);
      state.teamMsgReadsDetail.readAccounts.push(obj.account);
    }
  },
  initMsgReceiptDetail(state, obj) {
    state.teamMsgReadsDetail.readAccounts = obj.readAccounts;
    state.teamMsgReadsDetail.unreadAccounts = obj.unreadAccounts;
  },
};
