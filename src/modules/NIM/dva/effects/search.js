/*
 * @Descripttion: 
 * @version: 
 * @Author: 毛翔宇
 * @Date: 2020-03-24 17:11:26
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-03-25 18:14:54
 * @FilePath: \PC端-前端\src\modules\NIM\dva\effects\search.js
 */
import { formatUserInfo } from './userInfo'

export function* resetSearchResult(action, { put }) {
  yield put({
    type: 'setNoMoreHistoryMsgs',
    type: 'user',
    list: []
  })
  yield put({
    type: 'setNoMoreHistoryMsgs',
    type: 'team',
    list: []
  })
}

export function* searchUsers({ accounts, done }, { put, select }) {
  const nim = yield select(state => state.chat.nim);
  const userUID = yield select(state => state.chat.userUID);
  const userInfos = yield select(state => state.chat.userInfos);
  if (!Array.isArray(accounts)) {
    accounts = [accounts]
  }
  nim.getUsers({
    accounts,
    done: function searchUsersDone(error, users) {
      if (error) {
        alert(error)
        return
      }
      window.dispatch({
        type: 'chat/updateSearchlistExt',
        method: 'user',
        list: users
      })
      let updateUsers = users.filter(item => {
        let account = item.account
        if (item.account === userUID) {
          return false
        }
        let userInfo = userInfos[account] || {}
        if (userInfo.isFriend) {
          return false
        }
        return true
      })
      updateUsers = updateUsers.map(item => {
        return formatUserInfo(item)
      })
      window.dispatch({ type: 'updateUserInfoExt', users: updateUsers })
      if (done instanceof Function) {
        done(users)
      }
    }
  })
}

export function* searchTeam({ teamId, done }, { put, select }) {
  const nim = yield select(state => state.chat.nim);
  nim.getTeam({
    teamId: teamId,
    done: function searchTeamDone(error, teams) {
      if (error) {
        if (error.code === 803) {
          // 群不存在或未发生变化
          teams = []
        } else {
          alert(error)
          return
        }
      }
      if (!Array.isArray(teams)) {
        teams = [teams]
      }
      teams.forEach(team => {
        if (team.avatar && team.avatar.indexOf('nim.nosdn.127') > 0 && team.avatar.indexOf('?imageView') === -1) {
          team.avatar = team.avatar + '?imageView&thumbnail=300y300'
        }
      })
      window.dispatch({
        type: 'chat/updateSearchlistExt',
        method: 'team',
        list: teams
      })
      if (done instanceof Function) {
        done(teams)
      }
    }
  })
}
