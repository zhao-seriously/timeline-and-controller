import { createStore } from 'vuex'

export default createStore({
  state: {
    selectTimeArray: [], // 选中的时间
    isRealTime: true, //是否是实时时间
    timeShaftZoomRatio: 1, // 时间轴缩放比例
    timeShaftPositionRatio: 0, // 时间轴位置比例
  },
  getters: {},
  mutations: {
    // 设置选中时间
    setSelectTimeArray(state, data) {
      state.selectTimeArray = data
    },
    // 设置是否是实时时间
    setIsRealTime(state, bol) {
      state.isRealTime = bol
    },
    // 设置是否是当前时间之前的
    setIsBeforeTime(state, bol) {
      state.isBeforeTime = bol
    },
    // 设置时间轴缩放比例
    setTimeShaftZoomRatio(state, data) {
      state.timeShaftZoomRatio = data
    },
    // 设置时间轴位置比例
    setTimeShaftPositionRatio(state, data) {
      if (data === 100) {
        data = 100 + Math.random() * 0.0001
      }
      state.timeShaftPositionRatio = data
    },
  },
  actions: {},
  modules: {},
})
