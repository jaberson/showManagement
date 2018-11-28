<template>
<div class="flex-col canvas-area">
  <div class="canvas-elements flex-row">
    <template v-for="item in actions">
      <el-button type="iconButton" :key="item.sig" @click="addMeterial(item)">
        <div class="flex-row">
          <div :class="className(item)"></div>
          <div class="text-right">{{item.name}}</div>
        </div>
      </el-button>
    </template>
  </div>
  <div ref="canvasContainer" class="canvas-container">
    <div ref="canvas" class="canvas-hon">
      <!-- <div v-drag :style="{width:'100px', height:'100px', background:'blue', position:'absolute', right:0, top:0}"></div> -->
      <dragElement :canvas-params="canvasParams" :material-params="item" :boxIndex="index" @del-material="delMaterial" v-for="(item, index) in materialList" :key="item.id"></dragElement>
    </div>
  </div>
</div>
</template>
<script>
import actions from './config'
import dragElement from '@/components/dragResize/dragResize'
import {
  mapMutations
} from 'vuex'
// let vuex = require('vuex')
export default {
  components: {
    dragElement
  },
  props: {
    resolution: {
      type: String,
      default: () => {
        return 'yoko'
      }
    }
  },
  data() {
    return {
      actions: actions,
      canvasParams: {} // 画布宽高参数-主要传递给子组件
    }
  },
  computed: {
    materialList() {
      return this.$store.state.show.canvasList[this.$store.state.show.canvasIndex].materialList
    }
  },
  watch: {
    resolution(val) {
      if (val === 'tate') {
        this.$refs.canvas.style.width = this.$refs.canvas.clientHeight * 1080 / 1920 + 'px'
      } else {
        this.$refs.canvas.style.width = 90 + '%'
      }
      this.canvasParams = {
        w: this.$refs.canvas.clientWidth,
        h: this.$refs.canvas.clientHeight
      }
    },
    '$store.state.windowWidth'(val) {
      this.$refs.canvas.style.height = this.$refs.canvas.clientWidth * 1080 / 1920 < 536 ? this.$refs.canvas.clientWidth * 1080 / 1920 + 'px' : 536 + 'px'
      this.canvasParams = {
        w: this.$refs.canvas.clientWidth,
        h: this.$refs.canvas.clientHeight
      }
    }
  },
  mounted() {
    this.$refs.canvas.style.height = this.$refs.canvas.clientWidth * 1080 / 1920 + 'px'
    this.canvasParams = {
      w: this.$refs.canvas.clientWidth,
      h: this.$refs.canvas.clientHeight
    }
  },
  methods: {
    ...mapMutations('show', {
      addMeterial: 'addMeterial',
      delMaterial: 'delMaterial'
    }),
    className(item) {
      return {
        [`imgDiv-${item.sig}`]: true,
        img24: true
      }
    },
    // 改变素材index
    changeIndex(val) {
      let meterialId
      this.materialList.forEach((item, n) => { // 先找出index+1的素材层
        if (item.index === val.index) {
          meterialId = n // 找到当前素材的下标
        }
      })
      if (meterialId === this.materialList.length - 1) return // 如果当前层是最上层者不执行
      let temp = val.index // 互换index
      this.materialList[meterialId].index = this.materialList[meterialId + 1].index
      this.materialList[meterialId + 1].index = temp
      temp = this.materialList[meterialId] // 再互换对象在数组中的位置
      this.materialList[meterialId] = this.materialList[meterialId + 1]
      this.materialList[meterialId + 1] = temp
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./style";
</style>
