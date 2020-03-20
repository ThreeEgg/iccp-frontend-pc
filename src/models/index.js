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
import dynamic from 'next/dynamic';
const chat = dynamic(
  import('../modules/NIM/dva'),
  {
    ssr: false   //这个要加上,禁止使用 SSR
  }
)
const model = [
  app,
  homepage,
  chat,
];
export default model;
