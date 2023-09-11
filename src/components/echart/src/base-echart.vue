<template>
  <div class="base-echart">
    <div ref="echartDivRef" :style="{ width: width, height: height }"></div>
  </div>
</template>
<script setup>
import { ref, onMounted, watchEffect, defineExpose } from 'vue'
import useEchart from '../hooks/useEchart'
// 定义props withDefaults 默认值 两个参数 第二个参数是个默认值对象
const props = defineProps({
  options: {
    type: Object,
    default: () => {},
  }, // 传递过来的 对象
  width: {
    type: String,
    default: '100%',
  },
  height: {
    type: String,
    default: '100%',
  },
})
const echartDivRef = ref()
let instance = ref()

defineExpose({ instance })

onMounted(() => {
  // 单独抽取到hooks里面 降低耦合度
  // const echartInstance = echarts.init(echartDivRef.value)
  // echartInstance.setOption(props.options)
  const { setOptions, echartInstance } = useEchart(echartDivRef.value)
  instance.value = echartInstance
  // defineExpose(echartInstance);
  watchEffect(() => {
    // let options = props.options;
    setOptions(props.options)
  })
})
</script>
<style lang="scss" scoped>
.base-echart {
  width: 100%;
  height: 100%;
}
</style>
