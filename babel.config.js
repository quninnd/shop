// 在开发或者测试阶段不移除console，方便调试，在生成环境就移除console
// 获取node的环境变量 判断是development还是production阶段
const propPlugins = []
if (process.env.NODE_ENV === 'production') {
  propPlugins.push('transform-remove-console')
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      },
    ],
    ...propPlugins
  ]
}
