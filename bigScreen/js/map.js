/***************** 地图散点 ******************/
//初始化echarts实例
const scatterMap = echarts.init(document.getElementById('scatterMap'));
//安徽城市经纬度
const scatterGeo = {
  '合肥': [117.27, 31.66],
  '淮南': [116.90, 32.50],
  '淮北': [116.70, 33.60],
  '芜湖': [118.38, 31.15],
  '铜陵': [117.55, 30.88],
  '蚌埠': [117.34, 33.20],
  '马鞍山': [118.60, 31.56],
  '安庆': [116.60, 30.52],
  '宿州': [117.7, 33.63],
  '滁州': [118.31, 32.45],
  '宣城': [118.64, 30.66],
  '六安': [116.49, 31.63],
  '池州': [117.48, 30.40],
  '亳州': [115.99, 33.55],
  '黄山': [118.33, 29.90],
  '阜阳': [115.82, 32.70]
};
//城市数据
const scatterVal = [{
    name: '合肥',
    value: 10
  },
  {
    name: '淮南',
    value: 10
  },
  {
    name: '淮北',
    value: 10
  },
  {
    name: '芜湖',
    value: 10
  },
  {
    name: '铜陵',
    value: 10
  },
  {
    name: '蚌埠',
    value: 10
  },
  {
    name: '马鞍山',
    value: 10
  },
  {
    name: '安庆',
    value: 10
  },
  {
    name: '宿州',
    value: 10
  },
  {
    name: '滁州',
    value: 10
  },
  {
    name: '宣城',
    value: 10
  },
  {
    name: '六安',
    value: 10
  },
  {
    name: '池州',
    value: 10
  },
  {
    name: '亳州',
    value: 10
  },
  {
    name: '黄山',
    value: 10
  },
  {
    name: '阜阳',
    value: 10
  }
]

scatterVal.forEach(v => {
  v.value = Math.floor(Math.random() * 1000)
})

// 地图打点数据转换，转换后的格式：[{name: 'cityName', value: [lng, lat, val]}, {...}]
var convertScatterData = function (data) {
  var res = [];
  for (var i = 0; i < data.length; i++) {
    var geoCoord = scatterGeo[data[i].name]
    if (geoCoord) {
      res.push({
        name: data[i].name,
        value: geoCoord.concat(data[i].value),
        visualMap: true
      })
    }
  }
  return res
}

// 飞线数据转换
const convertFlyData = function (data) {
  let res = [];
  for (let i = 0; i < data.length; i++) {
    let dataItem = data[i]
    let fromCoord = scatterGeo[dataItem.name]
    let toCoord = [117.55, 30.88]
    if (fromCoord && toCoord) {
      res.push([{
        coord: fromCoord,
        // value: dataItem[0].value
        value: Math.floor(Math.random() * 100000)
      }, {
        coord: toCoord,
      }])
    }
  }
  return res
}

//地图配置项
var sactterMapOpt = {
  tooltip: {
    trigger: 'item',
    formatter: function (params) {
      return params.name + ' : ' + params.value[2];
    }
  },
  visualMap: { //图例值控制
    min: 0,
    max: 1000,
    calculable: true,
    show: true,
    color: ['#f44336', '#fc9700', '#ffde00', '#ffde00', '#00eaff'],
    textStyle: {
      color: '#fff'
    },
    seriesIndex: 0
  },
  geo: {
    map: '安徽',
    roam: true, //开启鼠标缩放和漫游
    zoom: 1, //地图缩放级别
    selectedMode: false, //选中模式：single | multiple
    layoutCenter: ['50%', '50%'], //设置后left/right/top/bottom等属性无效
    layoutSize: '100%',
    label: {
      show: true,
      color: '#fff'
    },
    emphasis: {
      label: {
        color: '#fff'
      }
    },
    itemStyle: {
      normal: {
        areaColor: '#11234d',
        borderWidth: 1,
        borderColor: '#2b719e',
        // shadowColor: '#ccc',
        // shadowBlur: 15,
        // opacity: 0.8
      },
      emphasis: {
        areaColor: '#069'
      }
    }
  },
  series: [{
    id: 'mapscatter',
    name: 'mapscatter',
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
  }, {
    id: 'mapline',
    name: 'mapline',
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
  }]
}
//渲染报表
scatterMap.setOption(sactterMapOpt);
