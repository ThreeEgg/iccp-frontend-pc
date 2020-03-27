/*
 * @Descripttion: 解决SDK无法调用外部dispatch的映射方法集合
 * @version: 
 * @Author: 毛翔宇
 * @Date: 2020-03-23 16:35:03
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-03-27 18:26:34
 * @FilePath: \PC端-前端\src\modules\NIM\dva\effects\customFunction.js
 */

import * as im from '../../../../services/im';

export function* getTranslate({ idClient, callback }, { call }) {
  const res = yield call(im.getTranslate, { msgidClient: idClient });
  callback && callback(res);
}