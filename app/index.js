/*
 * @Author: your name
 * @Date: 2020-11-28 13:25:51
 * @LastEditTime: 2020-12-01 11:42:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /webpack4/index.js
 */
import Img from './assets/images/测试上传.j的副本.jpeg'
import './page/index.css'
import './page/index.less'

 console.log('index.js')
 console.log('test====')
 const IMG = document.createElement('img')
 IMG.src = Img
 IMG.width = 321
 IMG.height = 321
 console.log(IMG)
 document.body.appendChild(IMG)