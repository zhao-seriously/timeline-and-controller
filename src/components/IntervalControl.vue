<template>
  <div class="interval-control-box">
    <div class="rear-line" ref="rearLineRef">
      <div class="control-cont">
        <div
          class="left-slide-bottom"
          ref="leftSlideBottomRef"
          :style="
            '--leftSlideButtonPosition:' +
            (contSliderBarStatus
              ? newLeftSlideButtonPosition
              : leftSlideButtonPosition)
          "
          @mousedown.prevent="leftSlideMouseDown"
          @mouseup.prevent="leftSlideMouseUp"
        ></div>
        <div
          class="cont-slider-bar"
          :style="
            '--bar-width:' + barWidth + ';' + '--barPosition:' + barPosition
          "
          ref="contSliderBarRef"
          @mousedown.prevent="contSliderBarMouseDown"
          @mouseup.prevent="contSliderBarMouseUp"
        ></div>
        <div
          class="right-slide-bottom"
          ref="rightSlideBottomRef"
          :style="
            '--rightSlideButtonPosition:' +
            (contSliderBarStatus
              ? newRightSlideButtonPosition
              : rightSlideButtonPosition)
          "
          @mousedown.prevent="rightSlideMouseDown"
          @mouseup.prevent="rightSlideMouseUp"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watchEffect } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
// const emit = defineEmits(["ratioChange"]);
// 总体背景bar
const rearLineRef = ref(null)
// 内容bar
const contSliderBarRef = ref(null)
// 左边滑块
const leftSlideBottomRef = ref(null)
// 右边滑块
const rightSlideBottomRef = ref(null)
// 内容bar是否可以滑动
const contSliderBarStatus = ref(false)
// 左侧滑块是否可以滑动
const leftSlideStatus = ref(false)
// 右侧滑块是否可以滑动
const rightSlideStatus = ref(false)
// 左侧滑块位置
const leftSlideButtonPosition = ref(0)
// 右侧滑块位置
const rightSlideButtonPosition = ref(0)
// 移动整体时新的位置数据
const newLeftSlideButtonPosition = ref(0)
const newRightSlideButtonPosition = ref(0)
// 鼠标点击内容bar时的X坐标
const SliderBarXPosition = ref(0)
// bar选择的比例
const selectRatio = ref(0)
// 鼠标按下内容bar
const contSliderBarMouseDown = (e) => {
  contSliderBarStatus.value = true
  SliderBarXPosition.value = e.clientX
}
// 鼠标松开内容bar
const contSliderBarMouseUp = () => {
  contSliderBarStatus.value = false
  leftSlideButtonPosition.value = newLeftSlideButtonPosition.value
  rightSlideButtonPosition.value = newRightSlideButtonPosition.value
}
// 鼠标按下左侧滑块
const leftSlideMouseDown = () => {
  leftSlideStatus.value = true
}
// 鼠标松开左侧滑块
const leftSlideMouseUp = () => {
  leftSlideStatus.value = false
}
// 鼠标按下右侧滑块
const rightSlideMouseDown = () => {
  rightSlideStatus.value = true
}
// 鼠标松开右侧滑块
const rightSlideMouseUp = () => {
  rightSlideStatus.value = false
}
// bar的宽度
const barWidth = computed(() => {
  let barWidth = 0
  if (
    parseInt(rightSlideButtonPosition.value) >
    parseInt(leftSlideButtonPosition.value)
  ) {
    barWidth =
      parseInt(rightSlideButtonPosition.value) -
      parseInt(leftSlideButtonPosition.value)
  } else if (
    parseInt(rightSlideButtonPosition.value) <
    parseInt(leftSlideButtonPosition.value)
  ) {
    barWidth =
      parseInt(leftSlideButtonPosition.value) -
      parseInt(rightSlideButtonPosition.value)
  } else {
    barWidth = 0
  }

  return barWidth + 'px'
})
// bar的位置
const barPosition = computed(() => {
  if (contSliderBarStatus.value) {
    //内容bar滑动时
    return (
      Math.min(
        parseInt(newRightSlideButtonPosition.value),
        parseInt(newLeftSlideButtonPosition.value),
      ) + 'px'
    )
  } else {
    //内容bar不滑动时
    return (
      Math.min(
        parseInt(rightSlideButtonPosition.value),
        parseInt(leftSlideButtonPosition.value),
      ) + 'px'
    )
  }
})
// 注册事件
const addListenerFn = () => {
  // 鼠标移动
  document.addEventListener('mousemove', (e) => {
    e.preventDefault()
    if (leftSlideStatus.value) {
      //   左侧鼠标滑动距离
      const leftSlidePosition =
        e.clientX -
        rearLineRef.value.getBoundingClientRect().left -
        leftSlideBottomRef.value.offsetWidth / 2
      leftSlideButtonPosition.value = leftSlidePosition + 'px'
      newLeftSlideButtonPosition.value = leftSlidePosition + 'px'
      if (leftSlidePosition <= 0) {
        // 到达最左侧
        leftSlideButtonPosition.value = 0 + 'px'
        newLeftSlideButtonPosition.value = 0 + 'px'
      }
      if (
        leftSlidePosition >=
        parseInt(rearLineRef.value.getBoundingClientRect().width.toFixed(2))
      ) {
        // 到达最右侧
        leftSlideButtonPosition.value =
          parseInt(rearLineRef.value.getBoundingClientRect().width.toFixed(2)) +
          'px'
        newLeftSlideButtonPosition.value =
          parseInt(rearLineRef.value.getBoundingClientRect().width.toFixed(2)) +
          'px'
      }
    } else if (rightSlideStatus.value) {
      //   右侧鼠标滑动距离
      const rightSlidePosition =
        e.clientX -
        rearLineRef.value.getBoundingClientRect().left -
        rightSlideBottomRef.value.offsetWidth / 2
      rightSlideButtonPosition.value = rightSlidePosition + 'px'
      newRightSlideButtonPosition.value = rightSlidePosition + 'px'
      if (rightSlidePosition <= 0) {
        // 到达最左侧
        rightSlideButtonPosition.value = 0 + 'px'
        newRightSlideButtonPosition.value = 0 + 'px'
      }
      if (
        rightSlidePosition >=
        parseInt(rearLineRef.value.getBoundingClientRect().width.toFixed(2))
      ) {
        // 到达最右侧
        rightSlideButtonPosition.value =
          parseInt(rearLineRef.value.getBoundingClientRect().width.toFixed(2)) +
          'px'
        newRightSlideButtonPosition.value =
          parseInt(rearLineRef.value.getBoundingClientRect().width.toFixed(2)) +
          'px'
      }
    } else if (contSliderBarStatus.value) {
      let bounding = rearLineRef.value.getBoundingClientRect()
      //   内容鼠标滑动距离
      const distance = e.clientX - SliderBarXPosition.value
      newLeftSlideButtonPosition.value =
        parseInt(leftSlideButtonPosition.value) + distance + 'px'
      newRightSlideButtonPosition.value =
        parseInt(rightSlideButtonPosition.value) + distance + 'px'
      // 左边滑块位置
      let leftSlidePosition = Math.min(
        parseInt(newLeftSlideButtonPosition.value),
        parseInt(newRightSlideButtonPosition.value),
      )
      // 右边滑块位置
      let rightSlidePosition = Math.max(
        parseInt(newLeftSlideButtonPosition.value),
        parseInt(newRightSlideButtonPosition.value),
      )
      let barWidth = rightSlidePosition - leftSlidePosition

      if (leftSlidePosition + bounding.left <= bounding.left) {
        // 到达最左侧
        newLeftSlideButtonPosition.value = 0 + 'px'
        newRightSlideButtonPosition.value = 0 + barWidth + 'px'
      } else if (
        rightSlidePosition >=
        bounding.right.toFixed(2) - bounding.left.toFixed(2)
      ) {
        // 到达最右侧
        newRightSlideButtonPosition.value = bounding.width.toFixed(2) + 'px'
        newLeftSlideButtonPosition.value =
          bounding.width.toFixed(2) - barWidth + 'px'
      }
    }
  })
  //   松开鼠标
  document.addEventListener('mouseup', () => {
    if (contSliderBarStatus.value) {
      leftSlideButtonPosition.value = newLeftSlideButtonPosition.value
      rightSlideButtonPosition.value = newRightSlideButtonPosition.value
    }
    contSliderBarStatus.value = false
    leftSlideStatus.value = false
    rightSlideStatus.value = false
  })
}
// 初始化滑块位置
const initSlidePosition = () => {
  let bounding = rearLineRef.value.getBoundingClientRect()
  leftSlideButtonPosition.value = 0 + 'px'
  rightSlideButtonPosition.value = bounding.width.toFixed(2) + 'px'
}

// 计算时间轴缩放比例
function getScaleFactor(percent) {
  const factor = (100 - percent) / 6.66 // 计算对应的递增因子
  // const scale = Math.pow(2, factor).toPrecision(4); // 计算对应的缩放倍数
  return factor
}

// 时间轴控制器区间比例变化
watchEffect(() => {
  if (!rearLineRef.value) return
  let bounding = rearLineRef.value.getBoundingClientRect()
  let left = leftSlideButtonPosition.value
  let right = rightSlideButtonPosition.value
  let maxValue = Math.max(parseInt(left), parseInt(right))
  let minValue = Math.min(parseInt(left), parseInt(right))
  let barWidth = maxValue - minValue
  selectRatio.value = (barWidth / bounding.width).toFixed(2) * 100

  store.commit('setTimeShaftZoomRatio', getScaleFactor(selectRatio.value))
})

// 时间轴控制器位置变化
watchEffect(() => {
  if (!rearLineRef.value) return
  let bounding = rearLineRef.value.getBoundingClientRect()
  let positionRatio =
    (
      parseInt(barPosition.value) /
      (bounding.width.toFixed(2) - parseInt(barWidth.value))
    ).toFixed(2) * 100
  store.commit('setTimeShaftPositionRatio', positionRatio)
})

onMounted(() => {
  initSlidePosition()
  addListenerFn()
})
</script>

<style lang="scss" scoped>
.interval-control-box {
  height: 100%;
  //   overflow: hidden;
  .rear-line {
    position: relative;
    height: 4px;
    background: rgba(255, 205, 62, 0.3);
  }
  .control-cont {
    position: relative;
    height: 100%;
    .left-slide-bottom,
    .right-slide-bottom {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 12px;
      height: 12px;
      border: 1px solid rgba(255, 255, 255, 1);
      box-sizing: border-box;
      background: rgba(255, 205, 62, 1);
      border-radius: 50%;
      cursor: pointer;
      z-index: 2;
      &::before {
        content: '';
        position: absolute;
        left: -5px;
        top: -5px;
        width: calc(100% + 10px);
        height: calc(100% + 10px);
      }
    }
    .left-slide-bottom {
      left: var(--leftSlideButtonPosition);
    }
    .right-slide-bottom {
      left: var(--rightSlideButtonPosition);
    }
    .cont-slider-bar {
      left: var(--barPosition);
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      height: 100%;
      width: var(--bar-width);
      background: rgba(255, 205, 62, 1);
      cursor: pointer;
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: -8px;
        width: calc(100%);
        height: calc(100% + 16px);
      }
    }
  }
}
</style>
