/*
 * @Descripttion: 
 * @version: 
 * @Author: 毛翔宇
 * @Date: 2020-03-16 15:56:52
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-03-16 16:56:18
 * @FilePath: \PC端-前端\src\modules\NIM\dva\index.js
 */
import reducers from './reducers'
import effects from './effects'
import state from './state'

const chat = {
  namespace: 'chat',
  // 内存数据状态，UI可通过this.$store.state.* 获得数据
  state,
  // 唯一拥有更改内存数据的接口，不可进行异步操作
  reducers,
  // 与reducers通讯，ui层写入内存数据的接口，可异步操作
  effects,
  plugins: []
}

export default chat
