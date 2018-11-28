<template>
<el-select v-model="orgNoown" ref="select" :filter-method="(val)=>{searchVal=val}" filterable placeholder="请选择或输入站点名" @search="searchAreaList" @keyup.enter.native="searchAreaList" search @visible-change="(val)=>{if(val){searchValconfirm = ''}}">
  <el-option class="select-tree" v-show="searchValconfirm.length===0" key="treeid000" value="treevalue000" label="treevalue000">
    <div class="dropdown-tree-container">
      <el-tree v-if="!initTree" :data="areas" ref="tree" node-key="areaId" :props="defaultProps" @node-click="handleNodeClick" @current-change="currentChange" :render-content="renderContent" :before-click="beforeClick" :current-node-key="currentNodeKey">
      </el-tree>
    </div>
  </el-option>
  <template v-if="searchValconfirm.length!==0">
    <el-option v-if="spots.length>0" v-for="item in spots" :key="item.areaId" :value="item.areaId" :label="item.areaName">
    </el-option>
    <el-option v-if="spots.length===0" key="nodata" value="nodata" label="无相关项" :disabled="true">
    </el-option>
  </template>
</el-select>
</template>
<script>
import {
  getAreaTree,
  searchSpotList
} from './proxy'
import treeNode from '@/components/areaTreeNode/areaTreeNode'
export default {
  props: {
    orgNo: {
      type: String,
      default: ''
    },
    orgName: {
      type: String,
      default: ''
    },
    canChooseParent: {
      type: Array,
      default: function() {
        return [1, 2, 3]
      } // 可选择的类型, 1是区域, 2是站点, 3是设备
    },
    includeType: {
      type: Array,
      default: function() {
        return [1, 2]
      } // 树上包括的类型, 1是区域, 2是站点, 3是设备
    },
    type: {
      type: String, // 选中的类型
      default: '2'
    },
    isChooseRoot: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    // this.getData()
  },
  watch: {
    orgNoown(val) {
      if (this.searchValconfirm.length > 0) {
        this.$emit('update:orgNo', val)
        this.$emit('update:orgName', val)
      }
    },
    currentNodeKey(val) {
      if (this.searchValconfirm.length === 0) {
        this.$emit('update:orgNo', val)
      }
    },
    orgNo(val) {
      if (!val) {
        this.orgNoown = ''
        this.searchVal = ''
        this.searchValconfirm = ''
        this.currentNodeKey = ''
        this.initTree = true
        setTimeout(() => {
          this.initTree = false
        }, 100)
      }
    }
  },
  data() {
    return {
      orgNoown: '',
      areas: [], // 区域树
      spots: [], // 站点列表
      currentNodeKey: '', // 树上选中的区域节点key
      currentAreaNode: '', // 树上选中选中的区域节点名
      searchVal: '', // 暂存搜索关键字
      searchValconfirm: '', // 提交搜索关键字
      initTree: false,
      defaultProps: {
        children: 'subAreas',
        label: 'areaName'
      }
    }
  },
  methods: {
    getData() {
      let postdata = {}
      if (this.orgNo && this.orgNo.length > 0) {
        postdata.districtId = this.orgNo
        this.currentNodeKey = this.orgNo
      }
      getAreaTree(postdata).then(res => {
        this.areas = [res.data]
        if (this.orgNo && this.orgNo.length > 0) {
          this.currentChange({
            areaId: this.orgNo,
            areaName: this.orgName
          })
        } else {
          if (this.isChooseRoot) {
            this.orgNoown = res.data.areaName
            this.$emit('update:orgNo', res.data.areaId)
            this.$emit('update:orgName', res.data.areaName)
          }
        }
      })
    },
    // 区域树渲染
    renderContent(h, {
      node,
      data,
      store
    }) {
      return h('span', {
        class: 'el-tree-node__label'
      }, [
        h(treeNode, {
          props: {
            treenode: node,
            treedata: data,
            treestore: store,
            includeType: this.includeType
          }
        })
      ])
    },
    // 只可以选择站点节点或都可以
    beforeClick(data, node) {
      this.$emit('update:type', data.type)
      return this.canChooseParent.indexOf(data.type * 1) > -1
    },
    currentChange(value) {
      this.currentNodeKey = value.areaId
      this.currentAreaNode = value.areaName
      this.$emit('update:orgName', value.areaName)
      this.$refs.select.handleOptionSelect({
        value: value.areaName
      })
    },
    handleNodeClick(data, node) {
      this.$emit('area-node-click', data, node)
    },
    // 搜索站点
    searchAreaList() {
      // this.currentNodeKey = 'fadsfdsaf'
      this.searchValconfirm = this.searchVal
      searchSpotList({
        condition: this.searchVal
      }).then(res => {
        this.spots = res.data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.select-tree {
    // &.el-select-dropdown__item.selected.hover{
    //     background-color:#fff!important;
    // }
    // &.el-select-dropdown__item.selected{
    //     background-color:#fff!important;
    // }
    &.el-select-dropdown__item {
        height: auto !important;
        padding: 13px 0 0 !important;
        background-color: #fff !important;
    }
}
</style>
