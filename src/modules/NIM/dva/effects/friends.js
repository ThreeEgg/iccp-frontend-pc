/*
 * 用户关系及好友关系托管
 */

import store from '..'
import { formatUserInfo } from './userInfo'

// 好友关系，回调
export function onFriends(friends) {
  friends = friends.map(item => {
    if (typeof item.isFriend !== 'boolean') {
      item.isFriend = true
    }
    return item
  })

  window.dispatch({ type: 'chat/updateFriendsExt', friends });
  // 更新好友信息字典，诸如昵称
  window.dispatch({ type: 'chat/updateUserInfoExt', users: friends });
}

// 更新好友资料，添加好友成功
export function onUpdateFriend(error, friends) {
  if (error) {
    alert(error)
    return
  }
  if (!Array.isArray(friends)) {
    friends = [friends]
  }

  friends = friends.map(item => {
    if (typeof item.isFriend !== 'boolean') {
      item.isFriend = true
    }
    return item
  })

  // 补充好友资料
  window.dispatch({
    type: 'chat/searchUsers',
    accounts: friends.map(item => {
      return item.account
    })
  }).then(() => {
    window.dispatch({
      type: 'chat/onUpdateFriend',
      friends,
    })
  })
}

// 删除好友，这里使用标记删除
export function onDeleteFriend(error, friends) {
  if (error) {
    alert(error)
    return
  }
  if (!Array.isArray(friends)) {
    friends = [friends]
  }
  friends = friends.map(item => {
    item.isFriend = false
    return item
  })
  // 更新好友列表
  window.dispatch({
    type:'chat/updateFriendsExt',
    friends: [],
    cutFriends: friends
  })
  // 更新好友资料
  window.dispatch({
    type:'chat/updateUserInfoExt',
    users: friends
  })
}

export function onSyncFriendAction(obj) {
  switch (obj.type) {
    case 'addFriend':
      // alert('你在其它端直接加了一个好友' + obj.account + ', 附言' + obj.ps);
      onUpdateFriend(null, obj.friend);
      break;
    case 'applyFriend':
      // alert('你在其它端申请加了一个好友' + obj.account + ', 附言' + obj.ps);
      break;
    case 'passFriendApply':
      alert('你在其它端通过了一个好友申请' + obj.account + ', 附言' + obj.ps);
      onUpdateFriend(null, obj.friend);
      break;
    case 'rejectFriendApply':
      // alert('你在其它端拒绝了一个好友申请' + obj.account + ', 附言' + obj.ps);
      break;
    case 'deleteFriend':
      // alert('你在其它端删了一个好友' + obj.account);
      onDeleteFriend(null, {
        account: obj.account
      });
      break;
    case 'updateFriend':
      // alert('你在其它端更新了一个好友', obj.friend);
      onUpdateFriend(null, obj.friend);
      break;
  }
}

// 更新好友昵称
export function updateFriend({ state, commit }, friend) {
  const nim = state.nim
  nim.updateFriend({
    account: friend.account,
    alias: friend.alias,
    done: onUpdateFriend
  })
}

export function addFriend({ state, commit }, account) {
  const nim = state.nim
  nim.addFriend({
    account,
    ps: '',
    done: onUpdateFriend
  })
}

export function deleteFriend({ state, commit }, account) {
  const nim = state.nim
  nim.deleteFriend({
    account,
    done: onDeleteFriend
  })
}


