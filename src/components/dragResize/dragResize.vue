<template>
<div ref="dragresize" :class="{'dragre-current' : materialParams.id === currentId}" class="dragresize not-selected" @mousedown="changeCurrent" @dblclick="enlarge">
  <div class="window-move" @mousedown="handleMouseDown"></div>
  <div class="showAdd-icons close" id="close_wnd" @click="close"></div>
  <div class="window-name">{{materialParams.name}}</div>
  <div class="ui-resizable-handle ui-resizable-n" @mousedown="(ev)=>transformXY(ev, 'u')" style="z-index: 90;"></div>
  <div class="ui-resizable-handle ui-resizable-e" @mousedown="(ev)=>transformXY(ev, 'r')" style="z-index: 90;"></div>
  <div class="ui-resizable-handle ui-resizable-s" @mousedown="(ev)=>transformXY(ev, 'b')" style="z-index: 90;"></div>
  <div class="ui-resizable-handle ui-resizable-w" @mousedown="(ev)=>transformXY(ev, 'l')" style="z-index: 90;"></div>
  <div class="ui-resizable-handle ui-resizable-se" @mousedown="(ev)=>transformXY(ev, 'rb')" style="z-index: 90;"></div>
  <div class="ui-resizable-handle ui-resizable-sw" @mousedown="(ev)=>transformXY(ev, 'lb')" style="z-index: 90;"></div>
  <div class="ui-resizable-handle ui-resizable-ne" @mousedown="(ev)=>transformXY(ev, 'ru')" style="z-index: 90;"></div>
  <div class="ui-resizable-handle ui-resizable-nw" @mousedown="(ev)=>transformXY(ev, 'lu')" style="z-index: 90;"></div>
</div>
</template>
<script>
import {
  mapState,
  mapMutations
} from 'vuex'

export default {
  props: {
    canvasParams: {
      type: Object,
      default: () => {
        return {
          w: 950,
          h: 536
        }
      }
    },
    materialParams: {
      type: Object,
      default: () => {
        return {
          id: 1,
          name: '图片',
          type: 'img',
          index: 1,
          position: {
            x: 0,
            y: 0,
            w: 385,
            h: 215
          }
        }
      }
    },
    boxIndex: {
      type: Number,
      default: () => {
        return 0
      }
    },
    minParams: {
      type: Object,
      default: () => {
        return {
          minW: 80,
          minH: 50
        }
      }
    }
  },
  data() {
    return {
      oDiv: null,
      elementParams: {
        x: 0,
        y: 0,
        w: 385,
        h: 215
      },
      elementStore: {}
    }
  },
  computed: {
    ...mapState('show', {
      canvasList: 'canvasList',
      canvasIndex: 'canvasIndex',
      materialIndex: 'materialIndex'
    }),
    currentId() { // 当前点中的素材块
      return this.canvasList[this.canvasIndex].materialList[this.materialIndex] ? this.canvasList[this.canvasIndex].materialList[this.materialIndex].id : 0
    },
    fullFlag: function() {
      let el = this.elementParams
      return el.x === 0 && el.y === 0 && el.w === this.canvasParams.w && el.h === this.canvasParams.h
    }
  },
  watch: {
    // 素材元素跟随画布变化做值变化
    canvasParams(val, oldVal) {
      this.elementParams.x = val.w / oldVal.w * this.elementParams.x
      this.elementParams.y = val.h / oldVal.h * this.elementParams.y
      this.elementParams.w = val.w / oldVal.w * this.elementParams.w
      this.elementParams.h = val.h / oldVal.h * this.elementParams.h
    },
    // 素材元素跟随画布变化做移动、伸缩
    elementParams: {
      handler: function(val) {
        this.oDiv.style.left = val.x + 'px'
        this.oDiv.style.top = val.y + 'px'
        this.oDiv.style.width = val.w + 'px'
        this.oDiv.style.height = val.h + 'px'
        if (JSON.stringify(this.materialParams.position) !== JSON.stringify(this.transformToB(val))) {
          this.updateMaterial({
            index: this.boxIndex,
            position: this.transformToB(val)
          })
        }
      },
      deep: true
    },
    'materialParams.position'(val) {
      this.elementParams = this.transformToF(val)
    },
    'materialParams.index'(val) {
      this.oDiv.style['z-index'] = val
    }
  },
  mounted() {
    this.oDiv = this.$refs.dragresize
    if (this.materialParams.position.x === undefined) {
      this.elementParams = { // 新增情况，统一赋初始值
        x: 0,
        y: 0,
        w: this.canvasParams.w * 0.41,
        h: this.canvasParams.h * 0.41
      }
    } else {
      console.log('toF')
      this.elementParams = this.transformToF(this.materialParams.position)
    }
    this.oDiv.style['z-index'] = this.materialParams.index
  },
  methods: {
    ...mapMutations('show', {
      updateMaterial: 'updateMaterial',
      selectMeterial: 'selectMeterial'
    }),
    handleMouseDown(ev) {
      if (this.fullFlag) return
      let that = this
      const disX = ev.clientX - that.oDiv.offsetLeft
      const disY = ev.clientY - that.oDiv.offsetTop
      // 拖拽移动
      document.onmousemove = (ev) => {
        let l = ev.clientX - disX
        let t = ev.clientY - disY
        const maxL = this.canvasParams.w - that.oDiv.offsetWidth // 最右值
        const maxT = this.canvasParams.h - that.oDiv.offsetHeight // 最下值
        if (l < 0) { // 边界限制判定
          l = 0
        } else if (l > maxL) {
          l = maxL
        }
        if (t < 0) {
          t = 0
        } else if (t > maxT) {
          t = maxT
        }
        this.elementParams.x = l
        this.elementParams.y = t
      }
      document.onmouseup = function() {
        document.onmousemove = null
        document.onmouseup = null
      }
    },
    // XY轴方向伸缩
    transformXY(ev, type) {
      let that = this
      let oEvent = ev || event
      const disX = oEvent.clientX
      const leftX = that.oDiv.offsetLeft
      const disY = oEvent.clientY
      const topY = that.oDiv.offsetTop
      const width = that.oDiv.offsetWidth
      const height = that.oDiv.offsetHeight
      document.onmousemove = (ev) => {
        let offsetX = ev.clientX - disX
        let offsetY = ev.clientY - disY
        let maxR = this.canvasParams.w - leftX - width
        let maxB = this.canvasParams.h - topY - height
        if (type.indexOf('r') > -1) {
          if (width + offsetX > this.minParams.minW) {
            offsetX = offsetX > maxR ? maxR : offsetX // 右边界限制判定
            this.elementParams.w = width + offsetX
          }
        }
        if (type.indexOf('l') > -1) {
          if (width - offsetX > this.minParams.minW) {
            offsetX = -offsetX > leftX ? -leftX : offsetX // 左边界限制判定
            that.elementParams.w = width - offsetX
            that.elementParams.x = leftX + offsetX
          }
        }
        if (type.indexOf('b') > -1) {
          if (height + offsetY > this.minParams.minH) {
            offsetY = offsetY > maxB ? maxB : offsetY // 下边界限制判定
            this.elementParams.h = height + offsetY
          }
        }
        if (type.indexOf('u') > -1) {
          if (height - offsetY > this.minParams.minH) {
            offsetY = -offsetY > topY ? -topY : offsetY // 上边界限制判定
            this.elementParams.h = height - offsetY
            this.elementParams.y = topY + offsetY
          }
        }
      }
      document.onmouseup = () => {
        document.onmousemove = null
        document.onmousemove = null
      }
    },
    // 双击放大缩小
    enlarge() {
      if (!this.fullFlag) {
        this.elementStore = JSON.parse(JSON.stringify(this.elementParams))
        this.elementParams = {
          x: 0,
          y: 0,
          w: this.canvasParams.w,
          h: this.canvasParams.h
        }
      } else {
        this.elementParams = this.elementStore
      }
    },
    close() {
      this.$emit('del-material', this.materialParams.id)
    },
    changeCurrent() {
      this.selectMeterial(this.boxIndex)
    },
    // 后端参数转换成前端参数
    transformToF(params) {
      console.log('F')
      let obj = JSON.parse(JSON.stringify(params))
      const width = this.oDiv.offsetWidth
      const height = this.oDiv.offsetHeight
      obj.x = width / this.canvasParams.w * obj.x
      obj.w = width / this.canvasParams.w * obj.w
      obj.y = height / this.canvasParams.h * obj.y
      obj.h = height / this.canvasParams.h * obj.h
      return obj
    },
    // 前端参数转换后端参数
    transformToB(params) {
      console.log(params)
      let obj = JSON.parse(JSON.stringify(params))
      const width = this.oDiv.offsetWidth
      const height = this.oDiv.offsetHeight
      obj.x = this.canvasParams.w / width * obj.x
      obj.w = this.canvasParams.w / width * obj.w
      obj.y = this.canvasParams.h / height * obj.y
      obj.h = this.canvasParams.h / height * obj.h
      console.log(obj)
      return obj
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./style";
.dragresize {
    .showAdd-icons {
        background-image: url("../../assets/image/show/showAdd-icons.png");
        background-repeat: no-repeat;
    }
    .close {
        display: none;
        position: absolute;
        width: 14px;
        height: 14px;
        right: 1px;
        top: 1px;
        background-position: -450px 0;
        cursor: pointer;
    }
    &:hover {
        .close {
            display: block;
        }
    }
}
.not-selected {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
</style>
