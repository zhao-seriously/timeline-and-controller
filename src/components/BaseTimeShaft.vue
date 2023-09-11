<template>
  <div class="base-time-shaft-box" ref="timeShaftRef">
    <div
      class="base-time-shaft"
      ref="timeShaftCont"
      :style="'--zoomRatio:' + zoomRatio"
    >
      <el-slider
        v-model="timeShaftValue"
        :step="1"
        :marks="marks"
        :max="maxSlider"
        :show-tooltip="false"
        @change="timeShaftChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineExpose, watch } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const props = defineProps({
  // 是否实时
  dateType: {
    type: String,
    default: 'day', // hour day oneDay
  },
})
// 暴露给父组件的方法
defineExpose({
  timeShaftPlay,
  timeShaftPause,
})
// 播放计时器实例
const intervalExample = ref(null)
// 时间轴dom
const timeShaftRef = ref(null)
// 时间轴容器dom
const timeShaftCont = ref(null)
// 最大值
const maxSlider = computed(() => {
  let max = props.dateType === 'oneDay' ? 1440 : 1440 * 15
  return max
})
// 获取当前分钟
const getMinutes = () => {
  let date = new Date() //当前时间
  let hour = date.getHours() //时
  return hour * 60 + date.getMinutes() //分
}

// 时间轴缩放比例
const zoomRatio = computed(() => {
  return props.dateType !== 'oneDay' ? store.state.timeShaftZoomRatio + 1 : 1
})

// 时间轴数据
const timeShaftValue = computed({
  get: () => {
    let hour = store.state.selectTimeArray[4] * 1
    let minute = store.state.selectTimeArray[5] * 1
    return hour * 60 + minute
  },
  set: (val) => {
    // 将要设置的值大于当前时间，并且选择的不是今天之前的时间-》暂停
    if (val > getMinutes() && store.state.isRealTime) {
      timeShaftPause()
      return
    } else {
      let time = store.state.selectTimeArray
      let hour = Math.floor(val / 60)
      let minute = (val % 60).toFixed(0)
      time[4] = hour >= 10 ? hour : '0' + hour
      time[5] = minute >= 10 ? minute : '0' + minute
      store.commit('setSelectTimeArray', time)
    }
  },
})

// 当前时间时间戳
const currentTimeStamp = () => {
  let date = new Date()
  return date.getTime()
}

// 时间轴label样式
const labelStyle = {
  color: 'rgba(255,255,255,.8)',
  fontFamily: 'HarmonyOS Sans SC',
  fontSize: '14px',
  letterSpacing: '0.8px',
  paddingLeft: '10px',
}
const labelHourStyle = {
  color: 'rgba(255,255,255,.8)',
  fontFamily: 'HarmonyOS Sans SC',
  fontSize: '10px',
  letterSpacing: '0.8px',
  paddingLeft: '10px',
}

// 时间轴marks数据
const marks = ref({})

// 注册emit
const emit = defineEmits(['refreshData', 'pauseEvent'])

// 补零
function addZero(num) {
  return num < 10 ? '0' + num : num
}

// 计算时间时分秒
function convertMinutesToHMS(minutes) {
  var hours = Math.floor(minutes / 60)
  var remaining_minutes = minutes % 60
  var seconds = Math.round(
    (remaining_minutes - Math.floor(remaining_minutes)) * 60,
  )
  var result =
    addZero(hours) + ':' + addZero(remaining_minutes) + ':' + addZero(seconds)
  return result
}

// 监听数据变化
watch(
  () => timeShaftValue.value,
  (newVal) => {
    let time =
      store.state.selectTimeArray[0] +
      '-' +
      store.state.selectTimeArray[1] +
      '-' +
      store.state.selectTimeArray[2] +
      ' ' +
      convertMinutesToHMS(newVal)
    if (newVal % 30 === 0) {
      emit('refreshData', time)
    }

    // 时间戳
    let timestamp = new Date(time).getTime()
    // 播放时间大于当前时间
    if (timestamp > currentTimeStamp()) {
      timeShaftPause()
    }
  },
)

// 加工数据
if (props.dateType === 'oneDay') {
  mapMarksData(props.dateType)
}

// 加工2倍缩放时间轴数据
function mapHourMark(hour = 3) {
  // 重置
  marks.value = {}
  // 每天添加几个小时
  let dayHourNum = hour + 1
  // 每天的日的间隔数
  let daySpliceNum = 14
  // 每天间隔
  let dayPart = maxSlider.value / 15 / daySpliceNum - 0.7 // 0.5是为了解决label样式显示完全问题
  // 临时marks数组
  let tempMarks = {}
  for (let i = 0; i < 15; i++) {
    // +50是为了解决label样式显示完全问题
    // 每个日的距离
    let dayDist = dayPart * 15
    // 上一次的日的位置
    let prevDay = (i - 1) * dayPart * 15
    tempMarks[dayDist * i + 30] = {
      style: labelStyle,
      label: i + 1 + '日',
    }
    // if (i > 0) {
    for (let h = 1; h < dayHourNum; h++) {
      // 计算显示的小时
      let hourValue = Math.floor(24 / dayHourNum + ((h - 1) * 24) / dayHourNum)
      // 每个时的距离
      let hourDist = dayDist / dayHourNum
      if (hourDist * h + dayDist * i !== prevDay) {
        tempMarks[hourDist * h + dayDist * i] = {
          style: labelHourStyle,
          label: addZero(hourValue) + ':00',
        }
      }
    }
  }
  marks.value = tempMarks
}

// 时间轴marks数据
function mapMarksData(type) {
  marks.value = {}
  if (type === 'hour') {
    // 小时
    let mark = {}
    for (let i = 0; i < 50; i++) {
      if (i % 2 == 0) {
        mark[i * 30] = {
          style: labelStyle,
          label: i / 2 < 10 ? `0${i / 2}:00` : `${i / 2}:00`,
        }
      } else {
        mark[i * 30] = {
          style: labelStyle,
          label: '',
        }
      }
    }
    for (let index = 0; index < 16; index++) {
      for (const key in mark) {
        marks.value[key * 1 + index * 1440] = mark[key]
      }
    }
  } else if (type === 'day') {
    // 每天间隔
    let daySpace = maxSlider.value / 15 / 14 - 1 // 0.5是为了解决label样式显示完全问题
    // 天
    for (let i = 0; i < 15; i++) {
      // +50是为了label样式显示问题
      marks.value[i * daySpace * 15 + 50] = {
        style: labelStyle,
        label: i + 1 + '日',
      }
    }
    // mapOddMark();
  } else if (type === 'oneDay') {
    for (let i = 0; i < 50; i++) {
      if (i % 2 == 0) {
        marks.value[i * 30] = {
          style: labelStyle,
          label: i / 2 < 10 ? `0${i / 2}:00` : `${i / 2}:00`,
        }
      } else {
        marks.value[i * 30] = {
          style: labelStyle,
          label: '',
        }
      }
    }
  }
}
// 播放
function timeShaftPlay() {
  store.commit('setIsRealTime', false)
  intervalExample.value = setInterval(() => {
    timeShaftValue.value += 0.5
  }, 50)
}
// 暂停
function timeShaftPause() {
  clearInterval(intervalExample.value)
  emit('pauseEvent')
}

// 时间轴数据改变
const timeShaftChange = (val) => {
  if (val < getMinutes()) {
    store.commit('setIsRealTime', false)
  }
}

// 通过变量记录是否处理过数据，避免重复处理
// 是否处理过小时数据
const isMapHour = ref(false)
// 是否处理过天数数据
const isMapDay = ref(false)

if (props.dateType !== 'oneDay') {
  // 监听控制进度条位置
  watch(
    () => store.state.timeShaftPositionRatio,
    (newVal) => {
      if (timeShaftRef.value) {
        // 时间轴内容宽度
        let paramsWidth =
          timeShaftCont.value.getBoundingClientRect().width.toFixed(2) -
          timeShaftRef.value.getBoundingClientRect().width.toFixed(2)
        let scrollPosition = paramsWidth * (newVal / 100)
        timeShaftRef.value.scrollLeft = scrollPosition
      }
    },
    {
      deep: true,
    },
  )

  // 时间轴长度缩放
  watch(
    () => zoomRatio.value,
    (newVal) => {
      if (newVal >= 14) {
        if (!isMapHour.value) {
          isMapHour.value = true
          isMapDay.value = false
          mapMarksData('hour')
        }
      } else if (newVal < 2.5 && newVal > 1.4) {
        mapHourMark(1)
        isMapHour.value = false
        isMapDay.value = false
      } else if (newVal < 5 && newVal > 2.5) {
        mapHourMark(3)
        isMapHour.value = false
        isMapDay.value = false
      } else if (newVal < 7 && newVal > 5) {
        mapHourMark(5)
        isMapHour.value = false
        isMapDay.value = false
      } else if (newVal < 9 && newVal > 7) {
        mapHourMark(7)
        isMapHour.value = false
        isMapDay.value = false
      } else if (newVal < 11 && newVal > 9) {
        mapHourMark(9)
        isMapHour.value = false
        isMapDay.value = false
      } else if (newVal < 14 && newVal > 11) {
        mapHourMark(11)
        isMapHour.value = false
        isMapDay.value = false
      } else {
        if (!isMapDay.value) {
          isMapDay.value = true
          isMapHour.value = false
          mapMarksData('day')
        }
      }
    },
    {
      deep: true,
      immediate: true,
    },
  )
}
</script>

<style lang="scss" scoped>
.base-time-shaft-box {
  height: 100%;
  overflow-x: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  .base-time-shaft {
    // padding-left: 10px;
    box-sizing: border-box;
    width: calc(100% * var(--zoomRatio));
    height: 100%;
    :deep {
      .el-slider__bar {
        background-color: rgb(28, 157, 102);
      }
      .el-slider__marks-text {
        user-select: none;
      }
      // 文字label
      .el-slider__marks-text {
        margin-top: 10px;
      }
      // 小标识
      .el-slider__stop {
        width: 1px;
        height: 6px;
        // &:nth-of-type(odd) {
        //   height: 6px;
        // }
        // &:nth-of-type(even) {
        //   height: 3px;
        //   bottom: 0;
        // }
      }
      // 滑块
      .el-slider__button {
        width: 6px;
        height: 15px;
        background: #ffffff;
        border: none;
        border-radius: 0;
        box-shadow: 0 0 7px 1px #fff;
      }
      // 时间轴条
      .el-slider__runway {
        background: #ffffff71;
      }
    }
  }
}
</style>
