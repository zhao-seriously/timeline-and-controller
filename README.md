# timeline-and-controller/时间轴播放器+时间轴控制器

### 功能说明

- 顶部为日期展示和日期选择功能，点击顶部日期可以进行日期选择，选择日期后底部时间轴会有联动，不过不可以选择未来的时间，默认展示的是实时时间，并且动态更新。
- 底部为图表+时间轴+时间轴控制器控件，时间轴默认展示 15 天的时间，可通过底部黄色部分的控制器进行选择，来控制时间轴的区间范围。
- 底部绿色部分为时间轴，为了开发效率基于 el-slider 开发，可以对时间轴进行拖拽滑动，点击左侧播放按钮即可播放，同样是不可以播放未来的时间的，且默认是当前实时时间，所以不进行向前拖动无法播放。
- 黄色部分为时间轴控制器，两侧可以进行拖拽对时间轴进行缩放，缩放后黄色部分可以进行拖拽，控制时间轴左右移动。

注意：
如果在启动时出现格式错误警告，可以在运行前执行 `yarn prettier` 或`npm run prettier`,然后再启动 
### 效果演示

![输入图片说明](src/assets/image/demo.gif)

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Lints and fixes files

```
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
