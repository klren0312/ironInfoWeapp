const areaData = ['合肥', '铜陵', '芜湖', '马鞍山', '安庆', '淮南', '宣城', '淮北', '宿州', '淮南', '六安', '阜阳', '亳州', '蚌埠', '滁州', '池州', '黄山']
const ironData = ['圆钢', '盘螺(10mm)', '盘螺(6mm)', '盘螺(8mm)', '螺纹(12mm)', '螺纹(14mm)', '螺纹(16mm)', '螺纹(18mm)', '螺纹(20mm)', '螺纹(22mm)', '螺纹(25mm)', '螺纹(28mm)']

function areaTableRefresh() {
  const areaTbody = document.getElementById('js-area-tbody')
  areaTbody.innerHTML = ''
  let body = ''
  new Array(6).fill(0).forEach(v => {
    const areaRandom = Math.floor(Math.random() * (areaData.length - 1))
    const ironRandom = Math.floor(Math.random() * (ironData.length - 1))
    const priceRandom = Math.floor(Math.random() * 5) * 1000
    body += `
      <tr>
        <td>${areaData[areaRandom]}</td>
        <td>${ironData[ironRandom]}</td>
        <td>${priceRandom === 0 ? 4000 : priceRandom}</td>
      </tr>
    `
  })
  areaTbody.innerHTML = body
}

areaTableRefresh()
setInterval(() => {
  areaTableRefresh()
}, 2000)

const typeChart = echarts.init(document.getElementById('type-chart'));
const typeChartOpt = {
  color: ['#d5a200', '#10d092', '#4cc3cb', '#716cc5'],
  grid: {
    left: '3%',
    right: '4%',
    bottom: '2%',
    top: '8%',
    containLabel: true
  },
  toolbox: {
    show: true,
    feature: {
      mark: {
        show: true
      },
    }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: { // 坐标轴指示器，坐标轴触发有效
      type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
    }
  },
  xAxis: [{
    type: 'category',
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: '#5182c1',
      align: 'center'
    },
    data: ['圆钢', '螺纹', '盘螺'],
  }],
  yAxis: {
    type: 'value',
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false
    },
    splitLine: {
      lineStyle: {
        type: 'dashed',
        color: '#1f385e5f'
      }
    },
    axisLabel: {
      color: '#5182c1',
    }
  },
  series: [{
    name: '',
    type: 'bar',
    barWidth: '30%',
    data: [10, 60, 40],
    itemStyle: {
      normal: {
        color: function (params) {
          var colorList = ['#d5a200', '#10d092', '#4cc3cb']
          return colorList[params.dataIndex]
        }
      }
    }
  }]
};
typeChart.setOption(typeChartOpt);

const lineChart = echarts.init(document.getElementById('line-chart'))
const lineChartOpt = {
  color: ['#d5a200', '#10d092', '#4cc3cb', '#716cc5'],
  grid: {
    left: 0,
    right: '4%',
    top: '2%',
    bottom: '40%',
    containLabel: true
  },
  tooltip: {
    trigger: 'axis'
  },
  xAxis: [{
    type: 'category',
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: '#5182c1',
      align: 'center',
      rotate: 30
    },
    data: ['一月', '三月', '五月', '七月', '九月', '十一月', '十二月']
  }],
  yAxis: {
    show: false,
    type: 'value',
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false
    },
    splitLine: {
      lineStyle: {
        type: 'dashed',
        color: '#1f385e5f'
      }
    },
    axisLabel: {
      color: '#5182c1',
    }
  },
  series: [{
      data: [140, 132, 141, 134, 190, 130, 130],
      type: 'line'
    },
    {
      data: [150, 142, 151, 144, 160, 150, 140],
      type: 'line'
    }, {
      data: [130, 122, 121, 114, 150, 110, 110],
      type: 'line'
    },
    {
      data: [125, 142, 121, 124, 110, 140, 120],
      type: 'line'
    }
  ]
}
lineChart.setOption(lineChartOpt)

window.onresize = function () {
  typeChart.resize()
  lineChart.resize()
}


// 右侧消息列表
const list = document.querySelector('#js-card-list')
function pushMsg () {
  const msg = document.createElement('div')
  msg.classList.add('msg-card')
  const random = Math.floor(Math.random() * 100) + 10
  msg.innerHTML = `
    <div class="title" title="铜陵钢材今日售出${random}吨">铜陵钢材今日售出${random}吨</div>
    <div class="content">螺纹总计 ${random - 10} 吨, 盘螺总计 10 吨</div>
    <div class="date">2020-3-10</div>
  `
  list.prepend(msg)
}

// 初始化数字
const projectNum = document.getElementById('js-num-num')
const seeNum = document.getElementById('js-watch-num')
function init (dom) {
  let randomStart = 0
  let randomId = ''
  function randomF () {
    randomStart = Math.floor(Math.random() * (1000 - 99)) + 99
    dom.innerHTML = randomStart
    randomId = window.requestAnimationFrame(randomF)
  }
  randomId = window.requestAnimationFrame(randomF)

  setTimeout(() => {
    window.cancelAnimationFrame(randomId)
  }, 2000)
}
init(projectNum)
init(seeNum)

// 循环更新数据
setInterval(() => {
  const msg = document.querySelectorAll('.msg-card')
  if (msg.length > 10) {
    list.removeChild(list.childNodes[list.childNodes.length - 1])
  }
  pushMsg()

  projectNum.innerText = parseInt(projectNum.innerText) + 1345
  seeNum.innerText = parseInt(seeNum.innerText) + 4135

  typeChart.setOption({
    series: [{
      name: '',
      type: 'bar',
      barWidth: '30%',
      data: [Random(90), Random(90), Random(90)],
      itemStyle: {
        normal: {
          color: function (params) {
            var colorList = ['#d5a200', '#10d092', '#4cc3cb']
            return colorList[params.dataIndex]
          }
        }
      }
    }]
  })
  lineChart.setOption({
    series: [{
        data: [Random(200), Random(200), Random(200), Random(200), Random(200), Random(200), 130],
        type: 'line'
      },
      {
        data: [Random(200), Random(200), Random(200), Random(200), Random(200), Random(200), 140],
        type: 'line'
      }, {
        data: [Random(200), Random(200), Random(200), Random(200), Random(200), Random(200), 110],
        type: 'line'
      },
      {
        data: [Random(200), Random(200), Random(200), Random(200), Random(200), Random(200), 120],
        type: 'line'
      }
    ]
  })
}, 2000)

function Random (max) {
  return Math.floor(Math.random() * max + 10)
}
