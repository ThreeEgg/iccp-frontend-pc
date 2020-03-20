/*
 * @Descripttion:
 * @version:
 * @Author: 毛翔宇
 * @Date: 2020-03-06 15:43:36
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-03-20 10:42:33
 * @FilePath: \PC端-前端\src\models\index.js
 */
import homepage from './homepage';
import app from './app';
import chat from '../modules/NIM/dva';

const model = [app, homepage, chat];
export default model;
