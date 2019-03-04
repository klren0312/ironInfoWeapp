let header = {}
export default function request (options) {
  var success = options.success || noop;
  var fail = options.fail || noop;
  var complete = options.complete || noop;
  var header = options.header || {};
  var url = options.url
  var method = options.method || 'GET'
  var data = options.data || {}

  // 成功回调
  var callSuccess = function () {
    success.apply(null, arguments)
    complete.apply(null, arguments)
  }

  // 失败回调
  var callFail = function (error) {
    fail.call(null, error)
    complete.call(null, error)
  }
  uni.request({
    url: url, 
    method: method, 
    data: data, 
    header: header,
    success: (res) => {
      const data = res.data
      if(data.code === 200) {
        callSuccess.apply(null, data)
      } 
      else if(data.code === 401) {
        uni.redirectTo({
          url: '/pages/auth/auth'
        })
        callFail.apply(null, arguments)
      } else {
        callFail.apply(null, arguments)
      }
    }
  })
}