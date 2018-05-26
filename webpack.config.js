var path = require('path')
var webpack = require('webpack')
var merge = require('webpack-merge');
var config = {
    output: {
        path: path.resolve(__dirname, './dist')
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ['vue-style-loader', 'css-loader'],
        }, {
            test: /\.scss$/,
            use: ['vue-style-loader', 'css-loader', 'sass-loader'],
        }, {
            test: /\.sass$/,
            use: ['vue-style-loader', 'css-loader', 'sass-loader?indentedSyntax'],
        }, {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                loaders: {
                    // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
                    // the "scss" and "sass" values for the lang attribute to the right configs here.
                    // other preprocessors should work out of the box, no loader config like this necessary.
                    'scss': ['vue-style-loader', 'css-loader', 'sass-loader'],
                    'sass': ['vue-style-loader', 'css-loader', 'sass-loader?indentedSyntax']
                }
                // other vue-loader options go here
            }
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }, {
            test: /\.(png|jpg|gif|svg)$/,
            loader: 'file-loader',
            options: {
                name: '[name].[ext]?[hash]'
            }
        }]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['*', '.js', '.vue', '.json']
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map',
    externals: {
        'vue-slider-component': 'vue-slider-component',
        'vue-scrollto': 'vue-scrollto',
        'vue-lodash': 'vue-lodash'
    }
}
module.exports = [
    merge(config, {
        entry: path.resolve(__dirname + '/src/plugin.js'),
        output: {
            filename: 'vue-scrollspy-slider.min.js',
            libraryTarget: 'window',
            library: 'VueScrollspySlider',
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: '"production"'
                }
            }),
            new webpack.optimize.UglifyJsPlugin({
                sourceMap: true,
                compress: {
                    warnings: false
                }
            }),
            new webpack.LoaderOptionsPlugin({
                minimize: true
            })
        ]
    }),
    merge(config, {
        entry: path.resolve(__dirname + '/src/VueScrollspySlider.vue'),
        output: {
            filename: 'vue-scrollspy-slider.js',
            libraryTarget: 'umd',
            library: 'vue-scrollspy-slider',
            umdNamedDefine: true
        }
    })
];