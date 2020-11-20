module.exports = {
  publicPath: './',
  devServer: {
    host: 'localhost',
    port: 8001,
    // 还可以配置服务器代理 proxy
  },
  // 配置打包的入口文件 因为生产和上线所打包的main文件会有所不同
  chainWebpack: config => {
    // 开发
    config.when(process.env.NODE_ENV === 'development', () => {
      config.entry('app').clear().add('./src/main-dev.js')
    //使用插件
    config.plugin('html').tap(args=>{
      //添加参数isProd
      args[0].isProd = false
      return args
    })
    })
    // 上线
    config.when(process.env.NODE_ENV === 'production', () => {
      config.entry('app').clear().add('./src/main-prod.js')
      
      // 减少chunk-vender的大小， 也就是让main的js和css引入cdn资源
      //使用externals设置排除项
    config.set('externals',{
      vue:'Vue',
      'vue-router':'VueRouter',
      axios:'axios',
      echarts:'echarts',
      nprogress:'NProgress',
      'vue-quill-editor':'VueQuillEditor'
    })
    //使用插件
    config.plugin('html').tap(args=>{
        //添加参数isProd
        args[0].isProd = true
        return args
      })
    })
  }
}