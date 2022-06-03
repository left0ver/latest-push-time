import webpack ,{Configuration } from 'webpack';
import TerserPlugin from 'terser-webpack-plugin'
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer'
import path from 'path';
const config:Configuration = {
    context:__dirname,
    mode: process.env.NODE_ENV === 'production' ? "production":"development",
    devtool: process.env.NODE_ENV === 'production' ? false:'inline-source-map',
    target:'node',
    entry: {
        index: './src/index.ts',
    },
    output:{
        path:path.resolve(__dirname,'dist'),
        clean:true,
        compareBeforeEmit: false,
        chunkFilename: '[name].chunk.js',
        filename: process.env.NODE_ENV === 'production'? '[name].bundle.js':'[name].js'
    },
    resolve:{
     alias:{
         "@":path.resolve(__dirname,'src')
     },
     extensions:[".ts",".js"]
    },
  module:{
      rules:[
          {
              test: /\.tsx?$/,
              exclude: /node_modules/,
              use:{
                loader:"babel-loader",
                options: {
                    presets: [
                        '@babel/preset-env', 
                        "@babel/preset-typescript", 
                ],
                plugins: ["@babel/plugin-transform-runtime"],
                    cacheDirectory:true,
                }
              }
          }
      ]
  },
  plugins:[
    new webpack.DefinePlugin({
            __DEV__:process.env.NODE_ENV === 'development'
      })
  ],
  optimization: {
    // minimize: true,
    minimizer: [new TerserPlugin({
        terserOptions:{
            compress: true,
            format:{
                comments:false,
            }
        },
        extractComments:false
    }),
    // new BundleAnalyzerPlugin()
],
  },

}
export default config