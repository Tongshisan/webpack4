/*
 * @Author: your name
 * @Date: 2020-12-01 10:22:10
 * @LastEditTime: 2020-12-01 11:47:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /webpack4/build/webpack.dev.js
 */
const path = require('path')
const webpack = require('webpack')
const {merge} = require('webpack-merge')
const commonConfig = require('./webpack.common')

console.log('devconfig')
const devConfig = {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
        open: true,
        hot: true,
        inline: false
    },
    plugins: [
        // new webpack.nameMoudlesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],
    optimization: {
        usedExports: true
    }
}
module.exports = merge(commonConfig, devConfig)