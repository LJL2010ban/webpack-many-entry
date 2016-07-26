var webpack = require('webpack');
var path = require('path');
var getEntry = require('./getEntry.js');
var complie = require('./complie.js');

var containerPath = path.resolve('./');

var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var extractSASS = new ExtractTextPlugin('[name].css');

// 读取系统配置
var globalConfig = require('../app/global.config.json');
globalConfig = complie(globalConfig);

// 获取所有js入口
var entrys = getEntry('./app/src/*/*/*.js');
console.log('entrys=', entrys);
// 获取所有页面
var pages = getEntry('./app/src/*/*/*.jade');
console.log(pages);

// webpack处理的插件
var plugins = [];
plugins.push(extractSASS);

//  提取公共文件
// plugins.push(new webpack.optimize.CommonsChunkPlugin('common', 'common.js'));

// 处理jade页面
for (var chunkname in pages) {
    console.log('chunkname=', chunkname);
    var conf = {
        filename: chunkname + '.html',
        template: pages[chunkname],
        inject: true,
        minify: {
            removeComments: true,
            collapseWhitespace: false
        },
        chunks: [chunkname],
        hash: true,
        globalConfig: globalConfig
    }
    plugins.push(new HtmlWebpackPlugin(conf));
}

/**
 * 配置webpack
 */
var config = {
    entry: entrys,
    // entry: {
    //   // '360/20150601p1/index': './app/src/360/20150601p1/index.js'
    //   // '360/20150722p2/defaut': './app/src/360/20150722p2/index.js'
    //   '20150601p1': './app/src/360/20150601p1/index.js',
    //   '20150722p2': './app/src/360/20150722p2/index.js'
    // },
    output: {
        path: path.resolve(containerPath, './app/www/'),
        publicPath: './',
        filename: '[name].js'
    },
    devtool: 'source-map',
    module: {
        loaders: [{
                test: /\.html$/,
                loader: 'raw',
                exclude: /(node_modules)/
            },
            // {
            //   test: /\.js$/,
            //   loader: 'eslint-loader',
            //   exclude: /(node_modules)/
            // },
            {
                test: /\.scss$/i,
                loader: extractSASS.extract(['css', 'sass'])
            }, {
                test: /.jade$/,
                loader: 'jade-loader',
                exclude: /(node_modules)/
            }, {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=8192&name=images/[name].[ext]'
            }
        ]
    },
    plugins: plugins,
    resolve: {
        // alias: alias,
        extensions: ['', '.js', '.css', '.scss', '.jade', '.png', '.jpg']
    },
    externals: {
        jquery: 'window.jQuery',
        // backbone: 'window.Backbone',
        underscore: 'window._',
        webim: 'window.webim'
    }
};
module.exports = config;
