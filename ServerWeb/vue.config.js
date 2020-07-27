const path = require('path')

module.exports = {
  publicPath: '/',
  productionSourceMap: false,
  lintOnSave: process.env.NODE_ENV === 'development',
  chainWebpack(config) {
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
    config
      // 开发模式
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      )
      // 生产模式
      .when(process.env.NODE_ENV === 'production',
        config => {
          config.output.filename(`./js/[name].[hash].js`).chunkFilename(`./js/[name].[hash].js`)
        }
      )
    // 分离打包
    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: path.resolve('src/components/widgets'), // can customize your rules
                  minChunks: 2, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        'appId': 'com.zzes1314.app',
        'productName': '治电普钢',
        'copyright': 'Copyright © ZZES Co,Ltd',
        'compression': 'maximum',
        'artifactName': '${productName}-${version}-${os}-${arch}.${ext}',
        'win': {
          'icon': './public/favicon.ico',
          'target': [
            {
              'target': 'nsis', // 利用nsis制作安装程序
              'arch': [
                'x64', // 64位
                'ia32' // 32位
              ]
            }
          ]
        },
        'nsis': {
          'oneClick': false, // 是否一键安装
          'allowElevation': true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
          'allowToChangeInstallationDirectory': true, // 允许修改安装目录
          'installerIcon': './public/favicon.ico', // 安装图标
          'uninstallerIcon': './public/favicon.ico', // 卸载图标
          'installerHeaderIcon': './public/favicon.ico', // 安装时头部图标
          'createDesktopShortcut': true, // 创建桌面图标
          'createStartMenuShortcut': true, // 创建开始菜单图标
          'shortcutName': '治电普钢' // 图标名称
        }
      }
    }
  }
}
