<template>
<span class="nodetree">
  <span class="normal-node">
    <template v-if="treedata.sig&&treedata.sig==='load'">
      <el-button type="iconButton" :loading="true">加载中</el-button>
    </template>
    <template v-else>
      <img :src="imgsrc">
      <overflow :title="treenode.label" :length="treenode.level===7?4:16-treenode.level*2"></overflow>
    </template>
  </span>
</span>
</template>
<script>
import {
  getSpotList,
  getDeviceList
} from './proxy'
import deviceicon from '@/assets/image/tree/device.png'
import areaicon from '@/assets/image/tree/area.png'
let id = 1000
export default {
  props: {
    treenode: Object,
    treedata: {
      type: Object,
      default: {
        areaId: '',
        areaName: '',
        parentId: '',
        type: 0
      }
    },
    treestore: Object,
    includeType: {
      type: Array,
      default: function() {
        return [1, 2, 3]
      } // 树上包括的类型, 1是区域, 2是站点, 3是设备
    },
    tree: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      imgsrc: ''
    }
  },
  mounted() {
    this.init()
    if (this.treedata.type * 1 === 3) {
      this.imgsrc = deviceicon
    } else {
      this.imgsrc = areaicon
    }
  },
  watch: {
    'treenode.expanded'(val) {
      if (
        val &&
        this.treedata.type * 1 === 1 &&
        (!this.treedata.subAreas || this.treedata.subAreas.length === 0) &&
        this.includeType.length > 1
      ) {
        this.treedata.subAreas = []
        this.treedata.subAreas.push({
          areaId: id++,
          areaName: 'loading...',
          type: 0,
          sig: 'load'
        })
        this.treenode.updateChildren()
        getSpotList({
          searchType: 2,
          areaId: this.treedata.areaId
        }).then(res => {
          this.treedata.subAreas = res.data
          let checkedlist = []
          if (this.treenode.checked) {
            checkedlist = res.data.map(data => {
              return data.areaId
            })
          }
          this.treenode.updateChildren()
          if (typeof this.tree.getCheckedKeys === 'function') {
            let checkedlistOld = this.tree.getCheckedKeys()
            this.tree.setCheckedKeys([...checkedlist, ...checkedlistOld])
            this.$emit('checkedChange')
          }
        })
      } else if (
        val &&
        this.treedata.type * 1 === 2 &&
        (!this.treedata.subAreas || this.treedata.subAreas.length === 0) &&
        this.includeType.length > 2
      ) {
        this.treedata.subAreas = []
        this.treedata.subAreas.push({
          areaId: id++,
          areaName: 'loading...',
          type: 0,
          sig: 'load'
        })
        this.treenode.updateChildren()
        getDeviceList({
          areaId: this.treedata.areaId
        }).then(res => {
          this.treedata.subAreas = res.data
          let checkedlist = []
          if (this.treenode.checked) {
            checkedlist = res.data.map(data => {
              return data.areaId
            })
          }
          this.treenode.updateChildren()
          if (typeof this.tree.getCheckedKeys === 'function') {
            let checkedlistOld = this.tree.getCheckedKeys()
            this.tree.setCheckedKeys([...checkedlist, ...checkedlistOld])
            this.$emit('checkedChange')
          }
        })
      }
    }
  },
  methods: {
    init() {
      if (this.includeType.length === 1) {
        this.treenode.expanded = true
      } else if (this.includeType.length === 2) {
        if (this.treedata.type * 1 === 1) {
          this.treenode.isLeaf = false
          if (this.treedata.subAreas && this.treedata.subAreas.length > 0) {
            this.treenode.expanded = true
          } else {
            this.treenode.expanded = false
          }
        }
      } else {
        if (this.treedata.type * 1 === 1 || this.treedata.type * 1 === 2) {
          this.treenode.isLeaf = false
          if (this.treedata.subAreas && this.treedata.subAreas.length > 0) {
            this.treenode.expanded = true
          } else {
            this.treenode.expanded = false
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.nodetree {
    flex: 1 0 auto;
}
.normal-node {
    margin-right: 10px;
    display: inline-block;
    & > img,
    & > span {
        vertical-align: middle;
    }
    img {

        width: 24px;
        height: 24px;
    }
}
.tree-action {
    margin: 0 20px;

    opacity: 0;
    align-items: center;
    & > span {
        margin-left: 5px;
        &:hover {
            color: #4a94fe;
        }
    }
}
.tree-action:hover {
    opacity: 1;
}
.input-node {
    width: 120px;
}
</style>
