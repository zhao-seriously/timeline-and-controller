// 初始化操作
import * as echarts from 'echarts'

export default function (el) {
  let echartInstance = null
  if (echarts.getInstanceByDom(el)) {
    // document.getElementById("chart").style.height = window.innerHeight + "px";
    // this.myChart = echarts.init(document.getElementById("chart"));
    echartInstance = echarts.getInstanceByDom(el)
  } else {
    echartInstance = echarts.init(el)
  }

  const setOptions = (options) => {
    echartInstance.setOption(options)
  }
  // 自适应echart
  // 手动调用
  const updateSize = () => {
    echartInstance.resize()
  }
  // 监听window的resize事件来让echart调用resize方法
  window.addEventListener('resize', () => {
    echartInstance.resize()
  })

  return {
    //对象形式 可以只拿到其中的一个属性 如果是数组形式 则必须全部拿到使用
    echartInstance,
    setOptions,
    updateSize,
  }
}
