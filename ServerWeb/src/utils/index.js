/**
 * 函数防抖
 * @param {Function} fn 函数
 * @param {Number} delay 延时
 */
export function debounce(fn, delay) {
  let timer = null
  return function() {
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, arguments)
    }, delay)
  }
}
/**
 * 函数节流
 * @param {Function} fn 函数
 * @param {Number} delay 延时
 */
export function throttle(fn, delay) {
  let timer = null
  let start = null
  return function loop() {
    const now = new Date().getTime()
    if (!start) {
      start = now
    }
    timer && clearTimeout(timer)
    if (now - start >= delay) {
      fn.apply(this, arguments)
      start = now
    } else {
      timer = setTimeout(() => {
        loop.apply(this, arguments)
      }, delay)
    }
  }
}
