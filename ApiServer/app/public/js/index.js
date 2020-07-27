// https://developer.mozilla.org/en-US/docs/Web/API/Element/mousewheel_event#The_detail_property
// firefox的页面滚动事件其他浏览器不一样
if (navigator.userAgent.toLowerCase().indexOf('firefox') === -1) {
  document.addEventListener('mousewheel', scrollMove)
  window.addEventListener('mousewheel', windowScroll)
} else {
  document.addEventListener('DOMMouseScroll', scrollMove)
  window.addEventListener('DOMMouseScroll', windowScroll)
}
document.querySelector('main').style.top = document.documentElement.clientHeight + "px"

function windowScroll (e) {
  if (window.scrollY === 0) {
    document.querySelector('nav').style.background = 'transparent'
  } else {
    document.querySelector('nav').style.background = 'linear-gradient(90deg, rgb(181, 205, 212), rgb(0, 99, 110))'
  }
}

/**
 * 按钮点击事件
 */
function toShow() {
  document.querySelector('nav').style.background = 'linear-gradient(90deg, rgb(181, 205, 212), rgb(0, 99, 110))'
  window.scroll({
    top: document.documentElement.clientHeight - 60,
    behavior: 'smooth'
  })
}
/**
 * 移动监听
 */ 
function scrollMove(e) {
  if (e.deltaY > 0) {
    window.scroll({
      top: document.documentElement.clientHeight - 60,
      behavior: 'smooth'
    })
    if (navigator.userAgent.toLowerCase().indexOf('firefox') === -1) {
      document.removeEventListener('mousewheel', scrollMove)
    } else {
      document.removeEventListener('DOMMouseScroll', scrollMove)
    }
  }
}

const month = new Date().getMonth() + 1
const day = new Date().getDate()

if ((month === 4 && day === 4) || (month === 9 && day === 18) || (month === 5 && day === 12)) {
  document.querySelector('html').style.filter = 'grayscale(1)'
}
