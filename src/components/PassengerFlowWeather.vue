<template>
  <div class="time-alarm-trend-view">
    <div class="left-box">
      <img
        src="@/assets/image/timeShaft/play-icon.png"
        @click="PlayOrPause"
        v-show="!playStatus"
        alt=""
      />
      <img
        src="@/assets/image/timeShaft/pause-icon.png"
        @click="PlayOrPause"
        v-show="playStatus"
        alt=""
      />
      <div class="text">时间轴</div>
    </div>
    <div class="chart-box">
      <!-- 天气 -->
      <div class="weather-box">
        <div class="weather-item" v-for="item in 11" :key="item">
          <img
            class="l-icon"
            src="@/assets/image/timeShaft/weather-dy.png"
            alt=""
          />
          <div class="r-text">多云18～24℃</div>
        </div>
      </div>
      <!-- chart -->
      <div class="chart">
        <TimeAlarmTrendChart
          :barData="{ name: '客流/天气   2023年05月', seriesData }"
        />
      </div>
      <!-- 时间轴 -->
      <div class="time-shaft">
        <BaseTimeShaft ref="BaseTimeShaftRef" @pauseEvent="pauseEvent" />
      </div>
      <!-- 时间轴间隔控制器 -->
      <div class="inter-control">
        <IntervalControlVue />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import TimeAlarmTrendChart from './TimeAlarmTrend.vue'
import BaseTimeShaft from '@/components/BaseTimeShaft.vue'
import IntervalControlVue from './IntervalControl.vue'
const store = useStore()
const BaseTimeShaftRef = ref(null)
const seriesData = ref([
  11, 10, 20, 16, 23, 15, 23, 13, 34, 11, 14, 20, 16, 19, 22, 15, 21, 14, 10,
  23, 12, 11, 17, 19,
])
// 时间轴播放状态
const playStatus = ref(false)
// 播放暂停
const PlayOrPause = () => {
  playStatus.value = !playStatus.value
  if (playStatus.value) {
    BaseTimeShaftRef.value.timeShaftPlay()
  } else {
    BaseTimeShaftRef.value.timeShaftPause()
  }
}

// baseTime组件内暂停
const pauseEvent = () => {
  playStatus.value = false
}

// 随机数
function generateRandomNumbers(length, max) {
  const result = []
  for (let i = 0; i < length; i++) {
    result.push(Math.floor(Math.random() * max))
  }
  return result
}
watch(
  () => store.state.timeShaftPositionRatio,
  (newVal) => {
    if (newVal <= 100) {
      // 随机数组
      const randomNumbers = generateRandomNumbers(24, 51)
      seriesData.value = randomNumbers
    }
  },
  {
    deep: true,
  },
)
watch(
  () => store.state.timeShaftZoomRatio,
  () => {
    // 随机数组
    const randomNumbers = generateRandomNumbers(24, 51)
    seriesData.value = randomNumbers
  },
  {
    deep: true,
  },
)
</script>

<style lang="scss" scoped>
.time-alarm-trend-view {
  display: flex;
  height: 100%;
  // background: url("@/assets/image/timeShaft/bg-img.png") no-repeat;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.65) 100%
  );
  border: 0.5px solid rgba(255, 255, 255, 0.56);
  border: 0.5px solid rgba(255, 255, 255, 0.56);
  // background-size: 100% 100%;
  .left-box {
    width: 75px;
    margin: 0 auto;
    text-align: center;
    color: #ffffff;
    font-family: ABeeZee;
    font-size: 12px;
    line-height: 30px;
    img {
      height: 26px;
      width: 26px;
      margin-top: 40px;
    }
  }
  .chart-box {
    position: relative;
    width: calc(100% - 75px);
    height: 100%;
    // height: 115px;
    .chart {
      height: calc(100% - 30px);
    }
    .time-shaft {
      position: absolute;
      bottom: 30px;
      left: 25px;
      width: calc(100% - 55px);
      height: 40px;
      overflow-x: auto;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .inter-control {
      position: absolute;
      bottom: 10px;
      left: 25px;
      width: calc(100% - 55px);
    }
    .weather-box {
      position: absolute;
      left: 140px;
      top: 2px;
      display: flex;
      justify-content: space-between;
      width: calc(100% - 170px);
      .weather-item {
        display: flex;
        align-items: center;
        height: 25px;
        .l-icon {
          width: 14px;
          height: 10px;
          margin-right: 3px;
          img {
            height: 100%;
            width: 100%;
          }
        }
        .r-text {
          color: rgba(255, 255, 255, 1);
          font-family: HarmonyOS Sans SC;
          font-size: 10px;
        }
      }
    }
  }
}
</style>
