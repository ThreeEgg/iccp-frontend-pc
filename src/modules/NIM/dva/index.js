/*
 * @Descripttion: 
 * @version: 
 * @Author: 毛翔宇
 * @Date: 2020-03-16 15:56:52
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-03-20 18:15:27
 * @FilePath: \PC端-前端\src\modules\NIM\dva\index.js
 */
import reducers from './reducers'
import state from './state'
import effects from './effects'
const chat = {
  namespace: 'chat',
  // 内存数据状态，UI可通过this.$store.state.* 获得数据
  state,
  // 唯一拥有更改内存数据的接口，不可进行异步操作
  reducers,
  // 与reducers通讯，ui层写入内存数据的接口，可异步操作
  effects:{
    *connect(obj, { call, select }) {
      console.log('ok');
      // const nim = yield select(state => state.chat.nim);
      // let { type } = Object.assign({}, obj)
      // // type 可为 nim chatroom
      // type = type || 'nim'
      // switch (type) {
      //   case 'nim':
      //     yield call(connectNim, { payload: { nim, obj } }, { call })
      //     break
      //   case 'chatroom':
      //     connectChatroom(nim, call, obj)
      //     break
      // }
    },
  },
}

export default chat
