/*
 * @Descripttion: 
 * @version: 
 * @Author: 毛翔宇
 * @Date: 2020-03-16 15:56:52
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-03-27 09:04:43
 * @FilePath: \PC端-前端\src\modules\NIM\dva\effects\widgetUi.js
 */
import pageUtil from '../../utils/page'

// 显示加载中进度条
export function showLoading({ state, commit }) {
  commit('updateLoading', true)
}

// 隐藏加载中进度条
export function hideLoading({ state, commit }) {
  commit('updateLoading', false)
}

// 显示原图片
export function* showFullscreenImg({ src }, { put }) {
  if (src) {
    yield put({ type: 'updateFullscreenImage', src, method: 'show' })
  }
}

// 隐藏原图片
export function* hideFullscreenImg(atcion, { put }) {
  yield put({ type: 'updateFullscreenImage', method: 'hide' })

}
