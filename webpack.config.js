/*
 * @Author: your name
 * @Date: 2020-11-28 13:24:30
 * @LastEditTime: 2020-11-30 10:09:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /webpack4/webpack.config.js
 */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const devServer = require('webpack-dev-server')
module.exports = {
    mode: 'production',
    entry: {
        index: './index.js',
        bundle: './bundle.js'
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'dist')
    },
    module: {
        rules: [
        {
            test: /\.(png|jpg|gif|jpeg)$/,
            use: {
                loader: 'file-loader'
            }
        },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        },
        {
            test: /\.less/,
            use: ['style-loader', 'css-loader', 'less-loader']
        }
    ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html'
        }),
        new CleanWebpackPlugin(),
        // new WebpackDevServer({
        //     contentBase: path.join(__dirname, 'dist'),
        //     compress: true,
        //     port: 9000,
        //     open: true
        // })
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
        open: true
    }
}