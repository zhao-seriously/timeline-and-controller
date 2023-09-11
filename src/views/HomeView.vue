<template>
  <div class="home">
    <!-- 日期显示 -->
    <div class="top-date">
      <div class="time-box">
        <div class="time-date">
          <span class="blue-words">{{ dataValue[0] }}</span>
          <span class="white-words">年</span>
          <span class="blue-words">{{ dataValue[1] }}</span>
          <span class="white-words">月</span>
          <span class="blue-words">{{ dataValue[2] }}</span>
          <span class="white-words">日</span>
        </div>
        <div class="time-num">
          <span class="white-words">{{ dataValue[3] }}</span>
          <span class="blue-words">{{ dataValue[4] }}:{{ dataValue[5] }}</span>
        </div>
        <el-date-picker
          format="YYYY/MM/DD HH mm"
          value-format="YYYY MM DD d HH mm"
          v-model="datePicker"
          type="datetime"
          :disabledDate="disabledDateFun"
          @change="dataPickerChange"
        />
      </div>
    </div>
    <el-button @click="isShwoHeatMap = !isShwoHeatMap">水坝热力图</el-button>
    <!-- 热力图 -->
    <LatticeHeatMap v-if="isShwoHeatMap" />
    <div class="time-and-controller">
      <PassengerFlowWeather />
    </div>
  </div>
</template>
<script setup>
import { ref, watch, computed } from 'vue'
import LatticeHeatMap from '@/components/LatticeHeatMap.vue'
// import LatticeHeatMap from '@/components/LatticeHeatMap2.vue'

import PassengerFlowWeather from '@/components/PassengerFlowWeather.vue'
import { useStore } from 'vuex'
const store = useStore()
const isShwoHeatMap = ref(false)
// 日期选择器数据
const datePicker = ref('')
// 星期枚举数据
const WEEK_ENUM = {
  0: '星期日',
  1: '星期一',
  2: '星期二',
  3: '星期三',
  4: '星期四',
  5: '星期五',
  6: '星期六',
}
// 计时器实例
let interval = ref(null)
// 是否是实时时间
const isRealTime = computed(() => store.state.isRealTime)
// 显示的日期
const dataValue = computed({
  get: () => store.state.selectTimeArray,
  set: (val) => {
    store.commit('setSelectTimeArray', val)
  },
})
// 补零
function zeroFill(i) {
  if (i >= 0 && i <= 9) {
    return '0' + i
  } else {
    return i
  }
}
// 初始化时间
dataValue.value = getCurrentTime()
// 获取当前时间
function getCurrentTime() {
  let date = new Date() //当前时间
  let year = date.getFullYear() //年
  let month = zeroFill(date.getMonth() + 1) //月
  let day = zeroFill(date.getDate()) //日
  let hour = zeroFill(date.getHours()) //时
  let minute = zeroFill(date.getMinutes()) //分
  // let second = zeroFill(date.getSeconds()); //秒
  let week = date.getDay() //星期几
  return [year, month, day, WEEK_ENUM[week], hour, minute] // [年，月，日，星期，小时，分钟]
}
// 限制时间选择范围
function disabledDateFun(time) {
  return time.getTime() > Date.now()
}
// 时间选择
function dataPickerChange(value) {
  dataValue.value = value.split(' ')
  dataValue.value[3] = WEEK_ENUM[dataValue.value[3]]
  if (dataValue.value.join('') === getCurrentTime().join('')) {
    // 点击了此刻
    store.commit('setIsRealTime', true)
  } else {
    clearInterval(interval.value)
    store.commit('setIsRealTime', false)
  }
}
// 更新时间
function updateTime() {
  if (!isRealTime.value) return
  interval.value = setInterval(() => {
    console.log('日期更新中')
    dataValue.value = getCurrentTime()
    store.commit('setSelectTimeArray', dataValue.value)
  }, 5000)
}
// 监听实时时间状态
watch(
  () => store.state.isRealTime,
  (val) => {
    if (val) {
      updateTime()
    } else {
      clearInterval(interval.value)
    }
  },
  {
    immediate: true,
  },
)
</script>
<style scoped la lang="scss">
.home {
  position: relative;
  height: 100%;
  background-color: #888;
  .time-box {
    position: relative;
    padding-top: 50px;
    :deep .el-date-editor {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      opacity: 0;
      z-index: 2;
      cursor: pointer;
      .el-input__inner {
        height: 100%;
      }
    }
    .time-date {
      text-align: center;
      color: rgba(255, 255, 255, 1);
      font-family: Alibaba PuHuiTi;
      font-size: 40px;
      .blue-words {
        // color: rgb(7, 142, 247);
        // font-family: YouSheBiaoTiHei;
        font-size: 40px;
      }
      .white-words {
        color: rgba(255, 255, 255, 1);
        // font-family: YouSheBiaoTiHei;
        font-size: 40px;
      }
    }
    .time-num {
      text-align: center;
      margin-top: 5px;
      font-family: Alibaba PuHuiTi;
      .blue-words {
        color: rgba(255, 255, 255, 0.6);
        margin-left: 10px;
        // color: rgb(7, 142, 247);
        // font-family: YouSheBiaoTiHei;
        font-size: 22px;
      }
      .white-words {
        color: rgba(255, 255, 255, 0.6);
        // font-family: YouSheBiaoTiHei;
        font-size: 22px;
      }
    }
  }
  .time-and-controller {
    position: absolute;
    bottom: 50px;
    left: 20px;
    width: calc(100% - 40px);
    height: 144px;
  }
}
</style>
```
