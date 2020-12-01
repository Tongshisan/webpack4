/*
 * @Author: your name
 * @Date: 2020-12-01 10:22:21
 * @LastEditTime: 2020-12-01 10:54:02
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /webpack4/build/webpack.prod.js
 */
const {merge} = require('webpack-merge')
const commonconfig = require('./webpack.common')

const prodConfig = {
    mode: 'production',
    devtool: 'cheap-module-source-map'
}

module.exports = merge(commonconfig, prodConfig)