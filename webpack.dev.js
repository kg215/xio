const path = require('path');
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackDevServerOutput = require("webpack-dev-server-output");
const {CleanWebpackPlugin}=require("clean-webpack-plugin");

const common = require("./webpack.common");

module.exports = merge(common,{
    output: {
        path:path.resolve(__dirname, "dist"),
        publicPath: "http://127.0.0.1:8080/"
    },
    devServer:{
        progress:true,
        proxy: {
            '/index.php': {
                target:'http://www.ooo.test/',
                changeOrigin:true
            }
          },
    },
    stats:{
        children:false
    },
    plugins:[
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template:"./src/template.html",
            chunks:["index"],
            filename:"index.html",
            inject:true
        }),
        new HtmlWebpackPlugin({
            template:"./src/template.html",
            chunks:["article"],
            filename:"article.html",
            inject:true
        }),
        new WebpackDevServerOutput({
			path: "./dist",
			isDel: false
		})
    ]
});
