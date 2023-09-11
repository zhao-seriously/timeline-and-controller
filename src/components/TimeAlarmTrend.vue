<template>
  <div class="bar-chart">
    <base-echarts
      :options="options"
      :width="width"
      height="100%"
    ></base-echarts>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BaseEcharts from './echart'
import * as echarts from 'echarts'
const props = defineProps({
  barData: {
    type: Object,
    default: () => {
      return {}
    },
  },
  namePadding: {
    type: Array,
    default: () => [15, 0, 0, 80],
  },
  width: {
    type: String,
    default: '100%',
  },
  height: {
    type: String,
    default: '100%',
  },
})

const options = computed(() => {
  let seriesData = props.barData.seriesData || [
      11, 10, 20, 16, 23, 15, 23, 13, 34, 11, 14, 20, 16, 19, 22, 15, 21, 14,
      10, 23, 12, 11, 17, 19,
    ],
    dataX = [
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
    ],
    series = [
      {
        name: '',
        type: 'line',
        data: seriesData,
        symbol: 'none',
        areaStyle: {
          //区域填充样式
          normal: {
            //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                { offset: 0, color: 'rgba(20, 146, 203, 0.5)' },
                { offset: 1, color: 'rgba(0, 255, 239, 0)' },
              ],
              false,
            ),
          },
        },
        lineStyle: {
          show: true,
          normal: {
            width: 1,
            color: 'rgba(0, 255, 239, 1)',
            shadowColor: 'rgba(72,216,191, 0.3)',
          },
        },
        smooth: true,
      },
    ]

  return {
    grid: {
      top: '30',
      right: '30',
      left: '25',
      bottom: '26',
    },

    xAxis: [
      {
        boundaryGap: false,
        type: 'category',
        data: dataX,
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.11)',
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          formatter: '{value}',
          textStyle: {
            color: '#fff',
          },
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: props.barData.name || '时间与报警趋势图',
        splitLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.2)',
          },
        },
        nameTextStyle: {
          color: '#DEEBFF',
          fontSize: 12,
          lineHeight: 0,
          padding: props.namePadding,
        },
        axisLabel: {
          formatter: function (value) {
            return value
          },
          textStyle: {
            color: '#fff',
            fontSize: 9,
          },
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.11)',
          },
        },

        splitArea: {
          show: false,
        },
      },
    ],
    series: series,
  }
})
</script>

<style scoped lang="scss">
.bar-chart {
  width: 100%;
  height: 100%;
}
</style>
