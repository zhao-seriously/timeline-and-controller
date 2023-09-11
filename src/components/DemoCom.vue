<template>
  <div class="demo">
    <canvas
      id="hotmap"
      width="800"
      height="500"
      style="border: 1px solid #000000"
    ></canvas>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
let pointsdata = reactive([
  {
    x: 471,
    y: 277,
    value: 25,
  },
  {
    x: 438,
    y: 375,
    value: 97,
  },
  {
    x: 373,
    y: 19,
    value: 71,
  },
  {
    x: 473,
    y: 42,
    value: 63,
  },
  {
    x: 463,
    y: 95,
    value: 97,
  },
  {
    x: 590,
    y: 437,
    value: 34,
  },
  {
    x: 377,
    y: 442,
    value: 66,
  },
  {
    x: 171,
    y: 254,
    value: 20,
  },
  {
    x: 6,
    y: 582,
    value: 64,
  },
  {
    x: 387,
    y: 477,
    value: 14,
  },
  {
    x: 300,
    y: 300,
    value: 80,
  },
])
let context = ref()
onMounted(() => {
  var canvas = document.getElementById('hotmap')
  if (canvas.getContext) {
    context.value = canvas.getContext('2d')
  } else {
    alert('浏览器不支持canvas!')
  }
  context.value.clearRect(0, 0, 800, 500)
  /*
   * radius: 绘制半径，请自行设置
   * min, max: 强弱阈值，可自行设置，也可取数据最小最大值
   */
  var radius = 50
  var max = 97
  var min = 14
  pointsdata.forEach((point) => {
    let { x, y, value } = point
    context.value.beginPath()
    context.value.arc(x, y, radius, 0, 2 * Math.PI)
    context.value.closePath()

    // 创建渐变色: r,g,b取值比较自由，我们只关注alpha的数值
    let radialGradient = context.value.createRadialGradient(
      x,
      y,
      0,
      x,
      y,
      radius,
    )
    radialGradient.addColorStop(0.0, 'rgba(0,0,0,1)')
    radialGradient.addColorStop(1.0, 'rgba(0,0,0,0)')
    context.value.fillStyle = radialGradient

    // 设置globalAlpha: 需注意取值需规范在0-1之间
    let globalAlpha = (value - min) / (max - min)
    context.value.globalAlpha = Math.max(Math.min(globalAlpha, 1), 0)

    // 填充颜色
    context.value.fill()
  })
  const defaultColorStops = {
    0: '#0ff',
    0.2: '#0f0',
    0.4: '#ff0',
    1: '#f00',
  }
  const width = 20,
    height = 256

  function Palette(opts) {
    Object.assign(this, opts)
    this.init()
  }

  Palette.prototype.init = function () {
    let colorStops = this.colorStops || defaultColorStops

    // 创建canvas
    let canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    let ctx = canvas.getContext('2d')

    // 创建线性渐变色
    let linearGradient = ctx.createLinearGradient(0, 0, 0, height)
    for (const key in colorStops) {
      linearGradient.addColorStop(key, colorStops[key])
    }

    // 绘制渐变色条
    ctx.fillStyle = linearGradient
    ctx.fillRect(0, 0, width, height)

    // 读取像素数据
    this.imageData = ctx.getImageData(0, 0, 1, height).data
    this.canvas = canvas
  }

  /**
   * 取色器
   * @param {Number} position 像素位置
   * @return {Array.<Number>} [r, g, b]
   */
  Palette.prototype.colorPicker = function (position) {
    return this.imageData.slice(position * 4, position * 4 + 3)
  }
  // 像素着色
  let imageData = context.value.getImageData(0, 0, 800, 800)
  let data = imageData.data
  for (var i = 3; i < data.length; i += 4) {
    let alpha = data[i]
    let palette = new Palette(this.context.value)
    let color = palette.colorPicker(alpha)
    data[i - 3] = color[0]
    data[i - 2] = color[1]
    data[i - 1] = color[2]
  }
  context.value.putImageData(imageData, 0, 0)
})
</script>

<style lang="scss" scoped>
.demo {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  height: 400px;
  width: 1000px;
}
</style>
