import { message } from 'antd';
import store from '..';
import config from '../../configs';
import util from '../../utils';

export function formatMsg(msg) {
  const nim = store.state.nim;
  if (msg.type === 'robot') {
    if (msg.content && msg.content.flag === 'bot') {
      if (msg.content.message) {
        msg.content.message = msg.content.message.map(item => {
          switch (item.type) {
            case 'template':
              item.content = nim.parseRobotTemplate(item.content);
              break;
            case 'text':
            case 'image':
            case 'answer':
              break;
          }
          return item;
        });
      }
    }
  }
  return msg;
}

export function onRoamingMsgs(obj) {
  let msgs = obj.msgs.map(msg => {
    return formatMsg(msg);
  });
  window.dispatch({ type: 'chat/updateMsgsExt', msgs });
}

export function onOfflineMsgs(obj) {
  let msgs = obj.msgs.map(msg => {
    return formatMsg(msg);
  });
  window.dispatch({ type: 'chat/updateMsgsExt', msgs });
}

export function onMsg(msg) {
  msg = formatMsg(msg);
  window.dispatch({ type: 'chat/onMsgExt', msg });
}

function onSendMsgDone(error, msg) {
  if (error) {
    // 被拉黑
    if (error.code === 7101) {
      msg.status = 'success';
      message.error(error.message);
    } else {
      message.error(error.message);
    }
  }
  onMsg(msg);
}

// 消息撤回
export function onRevocateMsg(error, msg) {
  const nim = store.state.nim;
  if (error) {
    if (error.code === 508) {
      alert('发送时间超过2分钟的消息，不能被撤回');
    } else {
      alert(error);
    }
    return;
  }
  let tip = '';
  if (msg.from === store.state.userUID) {
    tip = '你撤回了一条消息';
  } else {
    let userInfo = store.state.userInfos[msg.from];
    if (userInfo) {
      tip = `${util.getFriendAlias(userInfo)}撤回了一条消息`;
    } else {
      tip = '对方撤回了一条消息';
    }
  }
  nim.sendTipMsg({
    isLocal: true,
    scene: msg.scene,
    to: msg.to,
    tip,
    time: msg.time,
    done: function sendTipMsgDone(error, tipMsg) {
      window.dispatch({
        type: 'chat/sendTipMsgDoneExt',
        tipMsg,
        msg,
      });
    },
  });
}

export function revocateMsg({ state, commit }, msg) {
  const nim = state.nim;
  let { idClient } = msg;
  msg = Object.assign(msg, state.msgsMap[idClient]);
  nim.deleteMsg({
    msg,
    done: function deleteMsgDone(error) {
      onRevocateMsg(error, msg);
    },
  });
}
export function* updateLocalMsg({ msg }, { put, select }) {
  yield put({
    type: 'chat/updateCurrSessionMsgs',
    method: 'replace',
    idClient: msg.idClient,
    msg: msg,
  });
  const nim = yield select(state => state.chat.nim);
  nim.updateLocalMsg({
    idClient: msg.idClient,
    localCustom: msg.localCustom,
  });
  yield put({
    type: 'replaceMsg',
    sessionId: msg.sessionId,
    idClient: msg.idClient,
    msg,
  });
}

// 发送普通消息
export function* sendMsg(paylord, { put, select }) {
  const nim = yield select(state => state.chat.nim);
  let { method, scene, to, pushContent, content, text, needMsgReceipt } = paylord;
  method = method || '';
  needMsgReceipt = needMsgReceipt || true;
  switch (method) {
    case 'text':
      nim.sendText({
        scene,
        to,
        text,
        done: onSendMsgDone,
        needMsgReceipt,
      });
      break;
    case 'custom':
      nim.sendCustomMsg({
        scene,
        to,
        pushContent,
        content: JSON.stringify(content),
        done: onSendMsgDone,
      });
  }
}

// 发送文件消息
export function* sendFileMsg(paylord, { put, select }) {
  const nim = yield select(state => state.chat.nim);
  let { method: type, fileInput } = paylord;
  if (!type && fileInput) {
    paylord.type = 'file';
    if (/\.(png|jpg|bmp|jpeg|gif)$/i.test(fileInput.value)) {
      paylord.type = 'image';
    } else if (/\.(mov|mp4|ogg|webm)$/i.test(fileInput.value)) {
      paylord.type = 'video';
    }
  }
  const data = Object.assign(
    {
      uploadprogress: function(data) {
        // console.log(data.percentageText)
      },
      uploaderror: function() {
        fileInput.value = '';
        console && console.log('上传失败');
      },
      uploaddone: function(error, file) {
        fileInput.value = '';
        // console.log(error);
        // console.log(file);
      },
      beforesend: function(msg) {
        // console && console.log('正在发送消息, id=', msg);
      },
      done: function(error, msg) {
        onSendMsgDone(error, msg);
      },
    },
    paylord,
  );
  nim.sendFile(data);
}

// 发送机器人消息
export function* sendRobotMsg(paylord, { put, select }) {
  const nim = yield select(state => state.chat.nim);
  let { method, scene, to, robotAccid, content, params, target, body } = paylord;
  method = method || '';
  scene = scene || 'p2p';
  switch (method) {
    case 'text':
      nim.sendRobotMsg({
        scene,
        to,
        robotAccid: robotAccid || to,
        content: {
          type: 'text',
          content,
        },
        body,
        done: onSendMsgDone,
      });
      break;
    case 'welcome':
      nim.sendRobotMsg({
        scene,
        to,
        robotAccid: robotAccid || to,
        content: {
          type: 'welcome',
        },
        body,
        done: onSendMsgDone,
      });
      break;
    case 'link':
      nim.sendRobotMsg({
        scene,
        to,
        robotAccid: robotAccid || to,
        content: {
          type: 'link',
          params,
          target,
        },
        body,
        done: onSendMsgDone,
      });
  }
}

// 发送消息已读回执
export function* sendMsgReceipt(action, { select }) {
  // 如果有当前会话
  const currSessionId = yield select(state => state.chat.currSessionId);
  if (currSessionId) {
    // 只有点对点消息才发已读回执
    if (util.parseSession(currSessionId).scene === 'p2p') {
      const nim = yield select(state => state.chat.nim);
      const sessionMap = yield select(state => state.chat.sessionMap);
      if (sessionMap[currSessionId]) {
        nim.sendMsgReceipt({
          msg: sessionMap[currSessionId].lastMsg,
          done: function sendMsgReceiptDone(error, obj) {
            console.log('发送消息已读回执' + (!error ? '成功' : '失败'), error, obj);
          },
        });
      }
    }
  }
}

export function* getHistoryMsgs(paylord, { put, select }) {
  const nim = yield select(state => state.chat.nim);
  const currSessionLastMsg = yield select(state => state.im.currSessionLastMsg);
  if (nim) {
    let { scene, to } = paylord;
    let options = {
      scene,
      to,
      reverse: false,
      asc: true,
      limit: config.localMsglimit || 20,
      done: function getHistoryMsgsDone(error, obj) {
        if (obj.msgs) {
          if (obj.msgs.length === 0) {
            window.dispatch({ type: 'chat/setNoMoreHistoryMsgsExt' });
          } else {
            let msgs = obj.msgs.map(msg => {
              return formatMsg(msg);
            });
            window.dispatch({
              type: 'chat/updateCurrSessionMsgs',
              method: 'concat',
              msgs,
            });
          }
        }
      },
    };
    if (currSessionLastMsg) {
      options = Object.assign(options, {
        lastMsgId: currSessionLastMsg.idServer,
        endTime: currSessionLastMsg.time,
      });
    }
    nim.getHistoryMsgs(options);
  }
}

export function* resetNoMoreHistoryMsgs(action, { put }) {
  yield put({ type: 'resetNoMoreHistoryMsgs' });
}

// 继续与机器人会话交互
export function* continueRobotMsg({ robotAccid }, { put }) {
  yield put({ type: 'resetNoMoreHistoryMsgs', robotAccid });
}
