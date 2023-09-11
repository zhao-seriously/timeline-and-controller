<template>
  <div class="lattice-heat-map">
    <img src="@/assets/image/tpysk.jpg" alt="" class="dam-img" />
    <div id="heatmap-container">
      <!-- 热力图 -->
      <canvas id="heatmap-canvas" @click="addHeatPT"></canvas>
      <!-- 色卡 -->
      <canvas id="heatmap-canvas2"></canvas>
      <!-- 格子 -->
      <canvas id="heatmap-canvas3"></canvas>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import h337 from '@rengr/heatmap.js'
const createHeatMap = () => {
  let heatmapInstance = h337.create({
    container: document.querySelector('.lattice-heat-map'),
    // 其实还可以传canvas对象，看一下源码就知道了，源码很显而易见，代码不多，逻辑清晰，有那么一丝丝感觉有些地方写的不好
    // canvas: document.querySelector('#heatmap'),
    backgroundColor: 'rgba(255,255,255,0)',
    gradient: {
      // 数值为[0,1]，数值大的在光圈内侧，数值相等则靠下的生效，数值设置不分大小顺序，并可以同时设置很多颜色
      0: 'blue',
      0.2: 'blue',
      0.4: 'green',
      0.6: 'green',
      0.8: 'yellow',
      1: 'red',
    },
    // radius: 40, // 设置光圈的半径大小，值>=0,=0取得是默认值
    // opacity: 0.7, // 光圈透明度设置[0,1]，如果值设置了，会重写maxOpacity和minOpacity的值
    maxOpacity: 0.5,
    minOpacity: 0,
    // blur: .9
  })
  heatmapInstance.setData({
    max: 100,
    data: [
      {
        x: 300,
        y: 200,
        value: 80,
      },
      {
        x: 220,
        y: 240,
        value: 80,
      },
    ],
  })
  console.log(heatmapInstance, 'heatmapInstance')
}
// 格子数据
let data = reactive([])
let canvasData = reactive({
  canvas: null,
  ctx: null,
  gridCanvas: null,
  gridCtx: null,
})
// 水坝轮廓坐标
const damCoordinate = [
  [85, 160],
  [965, 175],
  [1000, 360],
  [85, 355],
  [70, 320],
  [85, 160],
]
// 内部线条
const innerLine = [
  {
    from: damCoordinate[0],
    to: damCoordinate[3],
  },
  {
    from: damCoordinate[4],
    to: [damCoordinate[1][0], damCoordinate[1][1] + 160],
  },
  {
    from: damCoordinate[1],
    to: [damCoordinate[1][0], damCoordinate[1][1] + 160],
  },
  {
    from: damCoordinate[2],
    to: [damCoordinate[1][0], damCoordinate[1][1] + 160],
  },
]
// 热力点位数据
const listData = reactive([
  { x: 178, y: 325, cont: 30 },
  { x: 315, y: 325, cont: 80 },
  { x: 438, y: 325, cont: 60 },
  { x: 566, y: 325, cont: 50 },
  { x: 691, y: 325, cont: 70 },
  { x: 825, y: 325, cont: 40 },
  { x: 948, y: 325, cont: 100 },

  // { x: 214, y: 266, cont: 100 },
  // { x: 474, y: 274, cont: 100 },
  // { x: 740, y: 272, cont: 100 },
  // { x: 349, y: 191, cont: 100 },
  // { x: 602, y: 193, cont: 100 },
  // { x: 850, y: 199, cont: 100 },
])
// 最大值
const maxCont = 100
// 最小值
const minCont = 0
// 热力点位半径
const radius = 35

// 热力图颜色配置
const heatColor = {
  0: 'rgba(10, 14, 245,0.05)',
  // 0.3: 'rgba(0, 223, 223,0.3)',
  0.25: 'rgba(3, 239, 1,0.5)',
  0.5: 'rgba(210, 251, 0,0.6)',
  0.75: 'rgba(244, 129, 0,0.6)',
  0.9: 'rgba(245, 5, 5,0.8)',
  1: 'rgba(245, 5, 5,1)',
}
// 点击大坝添加热力点位
const addHeatPT = (e) => {
  // 清空热力图重新渲染
  canvasData.ctx.clearRect(
    0,
    0,
    canvasData.canvas.width,
    canvasData.canvas.height,
  )
  listData.push({
    x: e.offsetX,
    y: e.offsetY,
    cont: 10,
  })
  renderHeatMap()
}

// 加工范围热力图数据
const processData = (mapData) => {
  // 获取给定位置和参数
  const { x, y, radius, cont } = mapData

  // 遍历热力图区域
  for (let i = x - radius; i <= x + radius; i += 19) {
    for (let j = y - radius; j <= y + radius; j += 19) {
      // 计算当前位置到圆心的距离
      const distance = Math.sqrt(Math.pow(i - x, 2) + Math.pow(j - y, 2))
      if (distance <= radius) {
        // 使用衰减函数计算当前位置的加工后的热力值
        const decayFactor = 1 - distance / radius
        const processedCont = cont * decayFactor + 30

        // 创建加工后的热力点位
        const processedItem = {
          x: i,
          y: j,
          cont: processedCont,
        }

        listData.push(processedItem)
      }
    }
  }
}
// 第二行
processData({
  x: 214,
  y: 266,
  cont: 40,
  radius: 20,
})
processData({
  x: 474,
  y: 266,
  cont: 80,
  radius: 20,
})
processData({
  x: 740,
  y: 272,
  cont: 10,
  radius: 20,
})

// 第一行
processData({
  x: 344,
  y: 216,
  radius: 30,
  cont: 40,
})
processData({
  x: 621,
  y: 216,
  radius: 30,
  cont: 80,
})
processData({
  x: 869,
  y: 226,
  radius: 30,
  cont: 1,
})
// 创建格子数据
const createGirdData = () => {
  // 准备数据
  const numGridsX = canvasData.canvas.width / 10 // 格子数目（水平方向）
  const numGridsY = canvasData.canvas.height / 10 // 格子数目（垂直方向）
  for (let i = 0; i < numGridsX; i++) {
    for (let j = 0; j < numGridsY; j++) {
      const gridData = {
        value: i,
        x: i * 10,
        y: j * 10,
      }
      data.push(gridData)
    }
  }
}

// 创建canvas
const createCanvas = () => {
  // 获取热力图 Canvas 元素和上下文
  canvasData.canvas = document.getElementById('heatmap-canvas')
  canvasData.ctx = canvasData.canvas.getContext('2d')
  // 设置 Canvas 尺寸
  canvasData.canvas.width = 1100 // 盒子的宽度
  canvasData.canvas.height = 500 // 盒子的高度

  // 获取格子图 Canvas 元素和上下文
  canvasData.gridCanvas = document.getElementById('heatmap-canvas3')
  canvasData.gridCtx = canvasData.gridCanvas.getContext('2d')
  canvasData.gridCanvas.width = 1100 // 盒子的宽度
  canvasData.gridCanvas.height = 500 // 盒子的高度
  // 切割轮廓
  createPath(damCoordinate)
}

// 创建轮廓
const createPath = (damCoordinate) => {
  // 热力图轮廓
  canvasData.ctx.beginPath()
  // 格子图层轮廓
  canvasData.gridCtx.beginPath()

  damCoordinate.forEach((item, index) => {
    if (index === 0) {
      canvasData.ctx.moveTo(item[0], item[1])
      canvasData.gridCtx.moveTo(item[0], item[1])
    } else {
      canvasData.ctx.lineTo(item[0], item[1])
      canvasData.gridCtx.lineTo(item[0], item[1])
    }
  })

  canvasData.ctx.closePath() // 封闭路径
  // 将不规则轮廓设置为当前的剪切区域
  canvasData.ctx.clip()
  canvasData.gridCtx.clip()
  canvasData.gridCtx.fillStyle = 'rgba(10, 14, 245,0.4)'
  canvasData.gridCtx.fill()
  // 绘制边框
  canvasData.gridCtx.lineWidth = 2
  canvasData.gridCtx.strokeStyle = '#fff'
  canvasData.gridCtx.stroke()
  // 内部其他线条
  // 在容器内部绘制额外的线
  innerLine.forEach((t) => {
    canvasData.gridCtx.beginPath()
    canvasData.gridCtx.moveTo(t.from[0], t.from[1])
    canvasData.gridCtx.lineTo(t.to[0], t.to[1])
    canvasData.ctx.closePath() // 封闭路径
    // 设置线的样式
    canvasData.gridCtx.lineWidth = 2.5
    canvasData.gridCtx.strokeStyle = '#fff'

    // 绘制线
    canvasData.gridCtx.stroke()
    canvasData.gridCtx.fillStyle = 'rgba(255, 255, 255, 0.4)'
    canvasData.gridCtx.fill()
  })
}

// 创建并获取颜色卡
const getColorPaint = (heatColor) => {
  const canvasData = document.getElementById('heatmap-canvas2')
  let ctx = canvasData.getContext('2d')
  let gradientConfig = heatColor
  // let gradientConfig = {
  //   // 0.1: 'rgba(10, 14, 244,0.05)',
  //   // 0.2: 'rgba(1, 189, 234,0.1)',
  //   // 0.3: 'rgba(0, 183, 241,0.3)',
  //   // 0.4: 'rgba(2, 235, 221,0.4)',
  //   // 0.5: 'rgba(0, 240, 106,0.4)',
  //   // 0.6: 'rgba(11, 240, 2,0.6)',
  //   // 0.7: 'rgba(122, 246, 5,0.6)',
  //   // 0.8: 'rgba(214, 251, 0,0.8)',
  //   // 0.9: 'rgba(244, 129, 0,0.9)',
  //   // 1: 'rgba(245, 5, 5,1)',
  //   // 0.1: 'rgba(10, 14, 244,0.05)',
  //   0.2: 'rgba(1, 189, 234,0.1)',
  //   0.3: 'rgba(0, 183, 241,0.3)',
  //   // 0.4: 'rgba(2, 235, 221,0.4)',
  //   0.5: 'rgba(0, 240, 106,0.4)',
  //   // 0.6: 'rgba(11, 240, 2,0.6)',
  //   0.7: 'rgba(122, 246, 5,0.6)',
  //   // 0.8: 'rgba(214, 251, 0,0.8)',
  //   0.9: 'rgba(244, 129, 0,0.9)',
  //   1: 'rgba(245, 5, 5,1)',
  // }
  canvasData.width = 256
  canvasData.height = 20
  let gradient = ctx.createLinearGradient(0, 0, 256, 1) // 创建一个长256px的线性渐变条
  for (const key in gradientConfig) {
    gradient.addColorStop(key, gradientConfig[key])
  }
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 256, 10)
  return ctx.getImageData(0, 0, 256, 1).data
}

// 渲染热力图
const renderHeatMap = () => {
  // 热力图
  listData.forEach((t) => {
    canvasData.ctx.beginPath()
    let alpha = (t.cont - minCont) / (maxCont - minCont) // 计算权重
    canvasData.ctx.globalAlpha = Math.max(Math.min(alpha, 1), 0)
    canvasData.ctx.arc(t.x, t.y, radius, 0, Math.PI * 2, true) //绘制圆
    const radialGradient = canvasData.ctx.createRadialGradient(
      t.x,
      t.y,
      0,
      t.x,
      t.y,
      radius,
    ) // 创建渐变
    radialGradient.addColorStop(0, 'rgba(0,0,0,1)')
    radialGradient.addColorStop(1, 'rgba(0,0,0,0)')
    canvasData.ctx.fillStyle = radialGradient
    canvasData.ctx.closePath()
    canvasData.ctx.fill()
  })

  let palette = getColorPaint(heatColor)
  let img = canvasData.ctx.getImageData(
    0,
    0,
    canvasData.canvas.width,
    canvasData.canvas.height,
  )
  let imgData = img.data
  let len = imgData.length
  for (let i = 0; i < len; i += 4) {
    // 获取alpha值
    let alpha = imgData[i + 3]
    if (alpha) {
      // 获取颜色索引
      let offset = alpha * 4
      // 映射颜色rgb值
      imgData[i] = palette[offset]
      imgData[i + 1] = palette[offset + 1]
      imgData[i + 2] = palette[offset + 2]
      imgData[i + 3] = palette[offset + 3]
    }
  }

  canvasData.ctx.putImageData(img, 0, 0)
  // canvasData.ctx.putImageData(img, 0, 0, 0, 0, canvas.width, canvas.height)
}

// 渲染格子
const renderGrid = () => {
  data.forEach((grid) => {
    //   canvasData.ctx.fillStyle = colorData(grid.value)
    //   canvasData.ctx.fillRect(grid.x, grid.y, 10, 10)
    // 绘制灰色边框
    canvasData.gridCtx.strokeStyle = '#ffe'
    canvasData.gridCtx.lineWidth = 0.5
    canvasData.gridCtx.strokeRect(grid.x, grid.y, 10, 10)
  })
}

onMounted(() => {
  // 创建 Canvas 元素和上下文
  createCanvas()
  // 创建格子数据
  createGirdData()
  // 小格子填充轮廓
  renderGrid()
  // // 创建不规则轮廓
  // createPath()
  // 渲染热力图
  renderHeatMap()
  // createHeatMap()
})
</script>

<style lang="scss" scoped>
.lattice-heat-map {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  height: 700px;
  width: 1100px;
  .dam-img {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
  }
  #heatmap-container {
    position: relative;
    width: 100%; /* 盒子的宽度 */
    height: 100%; /* 盒子的高度 */
  }
  #heatmap-canvas3 {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }
  #heatmap-canvas {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
  }
  #heatmap-canvas2 {
    position: absolute;
    top: -10px;
    left: 40%;
    z-index: 1;
  }

  #heatmap-canvas {
    // position: absolute;
    // top: 0;
    // left: 0;
  }
}
</style>
