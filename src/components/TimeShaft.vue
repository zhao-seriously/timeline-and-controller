<template>
  <div class="time-shaft-box">
    <div class="left-text">时间轴</div>
    <div class="play-icon" @click="PlayOrPause">
      <img
        src="@/assets/image/timeShaft/play-icon.png"
        v-show="!playStatus"
        alt=""
      />
      <img
        src="@/assets/image/timeShaft/pause-icon.png"
        v-show="playStatus"
        alt=""
      />
    </div>
    <div class="time-shaft-cont">
      <BaseTimeShaft
        ref="BaseTimeShaftRef"
        @refreshData="refreshData"
        @pauseEvent="pauseEvent"
        dateType="oneDay"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseTimeShaft from './BaseTimeShaft.vue'
const emit = defineEmits(['refreshData'])
const BaseTimeShaftRef = ref(null)
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
// 刷新数据
const refreshData = (time) => {
  emit('refreshData', time)
}

// baseTime组件内暂停
const pauseEvent = () => {
  playStatus.value = false
}
</script>

<style lang="scss" scoped>
.time-shaft-box {
  display: flex;
  align-items: center;
  width: 100%;
  height: 50px;
  border: 1px solid #fff;
  box-sizing: border-box;
  background-color: #25252e;
  .left-text {
    width: 85px;
    text-align: center;
    line-height: 50px;
    opacity: 0.6;
    mix-blend-mode: normal;
    text-align: center;
    color: #ffffff;
    font-family: HarmonyOS Sans SC;
    font-size: 14px;
  }
  .play-icon {
    width: 24px;
    height: 24px;
    margin-right: 20px;
    img {
      height: 100%;
      width: 100%;
    }
  }
  .time-shaft-cont {
    height: 50px;
    width: calc(100% - 85px - 24px - 10px - 30px);
    // margin-bottom: 10px;
  }
}
</style>
