/*
 * @Author: lizhi
 * @Date: 2020-12-01 10:22:02
 * @LastEditTime: 2020-12-01 14:10:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /webpack4/build/webpack.common.js
 */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

console.log('commonConfig')
const commonConfig = {
    entry: {
        index: '/app/index.js',
        bundle: '/app/bundle.js'
    },
    output: {
        filename: 'js/[name].js',
        path: path.join(__dirname, '../dist')
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }, {
            test: /\.(png|jpg|gif|jpeg)$/,
            exclude: /node_modules/,
            use: {
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'img/',
                    limit: 1024
                }
            }
        }, {
            test: /\.css$/,
            exclude: /node_modules/,
            use: ['style-loader', 'css-loader', 'postcss-loader']
        }, {
            test: /\.less$/,
            exclude: /node_modules/,
            use: ['style-loader', 
                {
                   loader: 'css-loader',
                   options: {
                       importLoaders: 2,
                       modules: true
                   } 
                },
                'less-loader', 'postcss-loader']
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: '/app/index.html'
        }),
        new CleanWebpackPlugin()
    ]
}

module.exports = commonConfig