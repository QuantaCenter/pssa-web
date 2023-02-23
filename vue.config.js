const path = require('path')
module.exports = {
    publicPath: './',// 项目部署的基础路径
    outputDir: "dist",// 将构建好的文件输出到哪里
    // assetsDir: 'static',
    // indexPath: path.resolve(__dirname, '../dist/index.html'),
    //index: path.resolve(__dirname, '../dist/index.html'),
    lintOnSave: true, // 使用带有浏览器内编译器的完整构建版本 // https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only
    runtimeCompiler: false, // babel-loader默认会跳过`node_modules`依赖. // 通过这个选项可以显示转译一个依赖
    devServer: {
        //pen: process.platform === 'darwin',
        host: 'localhost',
        port: 8080,
        // port: 8888,
        https: true,
        hotOnly: false,
        proxy: {
            '/api': {//代理api
                target: 'https://pssa.quantacenter.com',//服务器api地址
                changeOrigin: true,//是否跨域
                pathRewrite: {//重写路径
                    "^/api": ''
                }
            }
            // proxy: 'https://sign.yiluzou.cn/sign/public/index.php/sign'
        }
    },
    /*
     build: {
        // Template for index.html
         index: path.resolve(__dirname, '../dist/index.html'),

         // Paths
         assetsRoot: path.resolve(__dirname, '../dist'),
         assetsSubDirectory: 'static',
         assetsPublicPath: '/',

         /*
        * Source Maps
        */
/*
       productionSourceMap: true,
        // https://webpack.js.org/configuration/devtool/#production
         devtool: '#source-map',
         productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        bundleAnalyzerReport: process.env.npm_config_report
     }*/
};
