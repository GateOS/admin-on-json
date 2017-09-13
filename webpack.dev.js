var webpack = require('webpack');
const { CheckerPlugin } = require('awesome-typescript-loader');
var path = require('path');
var _package = require('./package');


var publicPath = 'http://localhost:' + _package.port;
//var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';


module.exports = {
    entry: [
        "./src/index.tsx",
    ],
    output: {
        filename: _package.name + '.js',
        library: _package.name,
        libraryTarget: 'umd',
        umdNamedDefine: true,
        path: path.resolve(__dirname, './public/bundle'),
        publicPath: publicPath
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: 'source-map',

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ['', '.tsx', '.jsx', '.webpack.js', '.web.js', '.ts', '.js', '.css']
    },

    module: {
        loaders: [
            { test: /\.tsx?$/, loader: 'awesome-typescript-loader?configFileName=tsconfig.json' },
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            }
        ],
        plugins: [
            new CheckerPlugin()
        ]
    }
};
