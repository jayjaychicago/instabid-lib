const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        'index': './src/index.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'instabid',
        libraryTarget: 'umd'
    },
    externals: {
        react: 'react',
        'react-dom': 'react-dom'
    },
    module: {
        rules: [
          {
            test: /\.(jsx|js)$/,
            include: path.resolve(__dirname, 'src'),
            exclude: /node_modules/,
            use: [{
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', {
                    "targets": "defaults"
                  }],
                  '@babel/preset-react'
                ]
              }
            }]
          },
          {
            test: /\.js$/,
            enforce: 'pre',
            use: ['source-map-loader'],
        },
        ]
      }
};