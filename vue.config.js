'use strict'
module.exports = {
    devServer: {
        open: true, //浏览器自动打开页面
        port: 8080,
        https: false,
        hotOnly: false, //热更新（webpack已实现了，这里false即可）
        proxy: {
            //配置跨域
            '/api': {
                target: "http://192.168.3.8",
                changeOrigin: true, // needed for virtual hosted sites
                ws: true, // proxy websockets
                pathRewrite:{
                    '^/api':''
                }
            }
        }
    }
}