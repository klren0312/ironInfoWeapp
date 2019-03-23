module.exports = {
  productionSourceMap: false,
  parallel: require('os').cpus().length > 1, // 构建开启多进程处理babel编译
}
