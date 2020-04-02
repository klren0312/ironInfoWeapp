查看demo: [https://klren0312.github.io/ironInfoWeapp/](https://klren0312.github.io/ironInfoWeapp/)

# 一、使用的图表: ECharts
ECharts没啥好说的功能全面, 图表种类多样
官网: [https://www.echartsjs.com/zh/index.html](https://www.echartsjs.com/zh/index.html)

我们的大屏里主要用的是他的柱状图, 折线图, 以及地图

主要就地图有些特效, 比如地图打点带涟漪动画; 飞线等

打点带涟漪动画需要使用`effectScatter`, 注意不是 `scatter`
> `effectScatter`文档: [https://www.echartsjs.com/zh/option.html#series-effectScatter](https://www.echartsjs.com/zh/option.html#series-effectScatter)

```js
{
   type: 'effectScatter',
    coordinateSystem: 'geo',
    symbolSize: 10,
    showEffectOn: 'render',
    zlevel: 2,
    rippleEffect: {
      period: 2.5, //波纹秒数
      brushType: 'stroke', //stroke(涟漪)和fill(扩散)，两种效果
      scale: 3 //波纹范围
    },
    label: {
      normal: {
        show: false
      },
      emphasis: {
        show: false
      }
    },
    itemStyle: {
      color: '#18cf92',
      emphasis: {
        borderColor: '#fff',
        borderWidth: 1
      }
    },
    data: convertScatterData(scatterVal)
  }
```

飞线则使用`lines`
> `lines`文档: [https://www.echartsjs.com/zh/option.html#series-lines](https://www.echartsjs.com/zh/option.html#series-lines)

```js
{
    tooltip: {
      show: false
    },
    type: 'lines',
    zlevel: 2,
    effect: {
      show: true,
      period: 4, //箭头指向速度，值越小速度越快
      trailLength: 0.02, //特效尾迹长度[0,1]值越大，尾迹越长重
      symbol: 'arrow', //箭头图标
      symbolSize: 4, //图标大小
    },
    lineStyle: {
      normal: {
        width: 1, //尾迹线条宽度
        opacity: 1, //尾迹线条透明度
        curveness: .3 //尾迹线条曲直度
      }
    },
    data: convertFlyData(scatterVal)
  }
```

![image.png](https://upload-images.jianshu.io/upload_images/2245742-421405f0e9b71427.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# 二、大屏自适应问题
当然首先是长宽需要是百分比

需要监听`resize`事件
```js
window.onload = function () {
    const container = document.querySelector('.container')
    setSize(container)
    document.addEventListener('resize', setSize)
}
```
`setSize`函数,
`document.body.clientWidth` 为`body`的宽度, 该属性包括内边距 padding，但不包括边框 border、外边距 margin 和垂直滚动条
`window.screen.height` 为屏幕的高度
`window.screen.width` 为屏幕的宽度
通过给整个大屏赋值屏幕的长宽, 然后将页面按照实际宽度与屏幕宽度的比缩放, 达到整个页面适应性缩放, 当然需要**F11**全屏查看才行

```js
function setSize (dom) {
  const { width: allWidth, height } = screen
  const currentWidth = document.body.clientWidth
  dom.style.width = allWidth + 'px'
  dom.style.height = height + 'px'
  dom.style.transform = `scale(${currentWidth / allWidth})`
}
```


# 三、页面加载动画
由于页面刚加载会出现图片没加载, 图表没初始化的问题, 所以需要加个全屏加载动画
动画可以在这里选个: [https://epic-spinners.epicmax.co/](https://epic-spinners.epicmax.co/)

然后就是让加载动画在最上层加载, 等页面`onload`后移除加载动画即可
```js
window.onload = function () {
  document.getElementById('js-loading').remove()
}
```
![image.png](https://upload-images.jianshu.io/upload_images/2245742-7d9c195a12035821.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
