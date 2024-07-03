// const HtmlWebpackPlugin = require('html-webpack-plugin')//комментить перед выгрузкой
const path = require('path')

const production = process.env.NODE_ENV === 'production' ? 'production' : 'development'

module.exports = {
    entry: production === 'production' ? path.resolve(__dirname, './src/index.ts') : path.resolve(__dirname, './test/index.tsx'),
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: "umd",
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.(ts)x?$/,
                exclude: /node_modules|\.d\.(ts)x?$/,
                use: ['ts-loader']
            },
            {
                test: /\.bundle\.ts$/,
                use: {
                    loader: 'bundle-loader',
                    options: {
                        name: '[name]'
                    }
                }
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: ["style-loader", 'css-loader'],
            },
        ],
    },
    externals: production === 'production' ? {
        react: 'react'
    } : '',
    resolve: {
        extensions: [".*", ".css", ".ts", ".tsx", ".js"]
    },
    // plugins: [
    //     production !== 'production' &&
    //     new HtmlWebpackPlugin({
    //         filename: 'index.html',
    //         template: './test/index.html',
    //     }
    //     )
    // ],//комментить перед выгрузкой
    devServer: {
        port: 3003,
        hot: true,
        open: true
    },
    mode: production
}