const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isDev = process.env.NODE_ENV === "development";

function recursiveIssuer(m) {
	if (m.issuer) {
	  	return recursiveIssuer(m.issuer);
	} else if (m.name) {
	  	return m.name;
	} else {
	  	return false;
	}
}
module.exports = {
    mode:process.env.NODE_ENV,
    entry: {
        index:"./src/index/index.tsx",
        article:"./src/article/index.tsx"
    },
    output: {
        path:path.resolve(__dirname, "static"),
        filename:"[name].js"
    },
    resolve:{
        extensions: [".ts",".tsx",".js", ".jsx",".d.ts"],
        mainFiles: ["index"]
    },
    resolveLoader:{
		modules: [
			"node_modules",
		]
	},
    module:{
        rules:[
			{
				enforce: "pre",
				test: /\.js$/,
				loader: "source-map-loader"
			},
            {
                test:/\.(j|t)sx?$/,
				exclude: /node_modules/,
				loader: "babel-loader"
            },
            {
				test: /\.(png|jpg|jpeg|gif|woff|woff2|svg|ttf|eot)$/,
				use: {
					loader: "url-loader",
					options: {
						name: "[name].[ext]",
						limit: 10240, // size <= 10kib
						outputPath: "img",
						esModule: false
					}
				}
			},
			{
				test:/\.s?css$/,
				use:[
					{
						loader:MiniCssExtractPlugin.loader,
						options: {
							publicPath: "./style",
							hmr: isDev,
						},
					},
					"css-loader",
					"postcss-loader",
					"sass-loader",
				]
			}
        ]
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				articleStyles: {
					name: 'article',
					test: (m, c, entry = 'article') => m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
					chunks: 'all',
					enforce: true,
				},
				indexStyles: {
					name: 'index',
					test: (m, c, entry = 'index') => m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
					chunks: 'all',
					enforce: true,
				},
			},
		},
	},
	plugins:[
		new MiniCssExtractPlugin({
			filename: "style/[name].css",
			chunkFilename: "style/[id].css",
			ignoreOrder: false,
		})
	]
}