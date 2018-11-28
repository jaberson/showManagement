<template>
<div class="showAdd">
  <div class="flex-row-between" style="height:50px;display: none;">
    <div class="module-title">新建节目</div>
    <div class="flex-row-between submit-area">
      <el-checkbox v-model="autoAudit">自动审核</el-checkbox>
      <el-button type="primary" @click="submit">提交</el-button>
    </div>
  </div>
  <div class="info-content">
    <div class="main-contents-top">
      <el-form class="head-form" :model="formData" :rules="formRule" ref="form" label-width="70px" content-width="150px" message-position="right" :inline="true">
        <el-form-item label="节目名称" class="inline-item" prop="showName">
          <el-input v-model="formData.showName"></el-input>
        </el-form-item>
        <el-form-item label="分辨率" class="inline-item" prop="reso">
          <el-select v-model="formData.reso" placeholder="请选择">
            <el-option v-for="item in resoList" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="属性" class="inline-item" prop="scheduleAttr">
          <el-select v-model="formData.scheduleAttr" placeholder="请选择">
            <el-option v-for="item in scheduleAttrList" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组织" prop="orgId">
          <areaTree :orgNo.sync="formData.orgId"></areaTree>
        </el-form-item>
        <!-- <el-form-item label="描述" class="inline-item" prop="scheduleRemark">
          <el-input v-model="formData.scheduleRemark"></el-input>
        </el-form-item> -->
      </el-form>
    </div>
    <div class="main-contents-bottom">
      <canvasArea :resolution="formData.reso"></canvasArea>
      <div class="config-area">
        <el-tabs v-model="activeTab" type="border-card" @tab-click="changeTab">
          <el-tab-pane label="页面管理" name="page">
            <div class="tool">
              <el-button type="primary" size="small" icon="el-icon-plus" @click="addCanvas"></el-button>
              <el-button type="primary" size="small" icon="el-icon-close" @click="delCanvas"></el-button>
              <el-button type="primary" size="small" icon="el-icon-arrow-up" @click="moveCanvas('up')"></el-button>
              <el-button type="primary" size="small" icon="el-icon-arrow-down" @click="moveCanvas('down')"></el-button>
              <el-button type="primary" size="small" icon="el-icon-check" @click="saveCanvas"></el-button>
            </div>
            <div class="page-panel">
              <div class="page-panel-item" :class="{'selected': index === canvasIndex}" @click="selectCanvas(index)" v-for="(item, index) in canvasList" :key="item.id">{{item.name}}</div>
            </div>
            <div class="select-window">
              <div class="select-window-label">页面名称</div>
              <div class="select-window-content">
                <el-input type="text" v-model="pageParams.name" />
              </div>
            </div>
            <div class="select-window">
              <div class="select-window-label">页面布局</div>
              <div class="select-window-content">
                <el-select placeholder="请选择" v-model="pageParams.layout">
                  <el-option v-for="item in layoutList" :key="item.value" :label="item.name" :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="select-window">
              <div class="select-window-label">背景颜色</div>
              <div class="select-window-content">
                <el-color-picker v-model="pageParams.bgColor"></el-color-picker>
              </div>
            </div>
            <div class="select-window">
              <div class="select-window-label">播放时间类型</div>
              <div class="select-window-content">
                <el-select placeholder="请选择" v-model="pageParams.tiemType">
                  <el-option v-for="item in timeTypeList" :key="item.value" :label="item.name" :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="select-window" v-if="pageParams.tiemType">
              <div class="select-window-label">播放时间</div>
              <div class="select-window-content">
                <el-input type="number" min="0" max="604800" v-model="pageParams.time" />
              </div>
            </div>
            <div class="select-window">
              <div class="select-window-label">背景图片</div>
              <div class="select-window-content">
                <el-select placeholder="请选择" v-model="pageParams.bgp">
                  <el-option v-for="item in bgpList" :key="item.value" :label="item.name" :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="窗口素材管理" name="element">
            <div class="select-material">
              <div class="select-material-label">当前窗口</div>
              <div class="select-material-content">
                <el-select v-model="materialIndex">
                  <el-option v-for="(item, index) in materialList" :key="item.id" :label="item.name" :value="index"></el-option>
                </el-select>
                <el-button-group>
                  <el-button type="primary" icon="h-icon-arrow_up" @click="changeMaterialIndex('up')"></el-button>
                  <el-button type="primary" icon="h-icon-arrow_down" @click="changeMaterialIndex('down')"></el-button>
                </el-button-group>
              </div>
            </div>
            <div class="material-params">
              <div class="material-params-label">窗口位置</div>
              <div class="material-params-content">
                <div class="material-params-items">
                  <div class="material-params-item">
                    <span class="material-params-item-label">X</span>
                    <input type="number" v-model="materialPosition.x" min="0" max="1000">
                  </div>
                  <div class="material-params-item">
                    <span class="material-params-item-label">Y</span>
                    <input type="number" v-model="materialPosition.y" min="0" max="1000">
                  </div>
                </div>
                <div class="material-params-items">
                  <div class="material-params-item">
                    <span class="material-params-item-label">W</span>
                    <input type="number" v-model="materialPosition.w" min="0" max="1000">
                  </div>
                  <div class="material-params-item">
                    <span class="material-params-item-label">H</span>
                    <input type="number" v-model="materialPosition.h" min="0" max="1000">
                  </div>
                </div>
              </div>
            </div>
            <div class="tool">
              <el-button type="primary" size="small" icon="h-icon-plus" @click=""></el-button>
              <el-button type="primary" size="small" icon="h-icon-close" @click=""></el-button>
              <el-button type="primary" size="small" icon="h-icon-arrow_up" @click=""></el-button>
              <el-button type="primary" size="small" icon="h-icon-arrow_down" @click=""></el-button>
            </div>
            <div class="title">
              <div class="title_name">&nbsp;&nbsp;名称</div>
              <div class="title_type">|&nbsp;&nbsp;类型</div>
              <div class="title_desc">|&nbsp;&nbsp;描述</div>
            </div>
            <div class="content">
              <div class="content_name">名称1</div>
              <div class="content_type">类型1</div>
              <div class="content_desc">描述1</div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import areaTree from '@/components/areaTreeSelect/areaTreeSelect'
import canvasArea from './canvas/canvas'
// import utils from '@/assets/util.js'
import {
  mapState,
  mapMutations
} from 'vuex'
// import PerfectScrollbar from 'perfect-scrollbar'

export default {
  components: {
    areaTree,
    canvasArea
  },

  data() {
    return {
      autoAudit: false,
      activeTab: 'page',
      // ps: null,
      formData: {
        showName: '',
        reso: 'yoko',
        scheduleAttr: 'share',
        orgId: '',
        scheduleRemark: ''
      },
      filterWord: '',
      formRule: {
        showName: [
          // { validator: validateName, trigger: 'blur' }
          {
            min: 0,
            max: 10,
            message: '不能超过10个字',
            trigger: 'blur'
            // },
            // {
            //   validator: utils.checkSpecialChar,
            //   trigger: 'blur'
          }
        ],
        scheduleRemark: [{
          min: 0,
          max: 25,
          message: '不能超过25个字',
          trigger: 'blur'
        }]
      },
      scheduleAttrList: [{
          name: '共享',
          value: 'share'
        },
        {
          name: '私有',
          value: 'private'
        }
      ],
      resoList: [{
          name: '1920*1080',
          value: 'yoko'
        },
        {
          name: '1080*1920',
          value: 'tate'
        }
      ],
      layoutList: [{
        name: '布局一',
        value: 1
      }],
      timeTypeList: [{
        name: '自定义时间',
        value: 1
      }, {
        name: '自动',
        value: 0
      }],
      bgpList: [{
        name: '图片一',
        vlaue: 1
      }],
      pageParams: {
        name: null,
        layout: null,
        bgColor: null,
        timeType: null,
        time: 60,
        bgp: null
      },
      materialPosition: {
        x: null,
        y: null,
        w: null,
        h: null
      }
    }
  },
  computed: {
    ...mapState('show', {
      canvasList: 'canvasList',
      canvasIndex: 'canvasIndex'
      // materialIndex: 'materialIndex'
    }),
    materialIndex: {
      get() {
        return this.$store.state.show.materialIndex
      },
      set(value) {
        this.$store.commit('show/selectMeterial', value)
      }
    },
    materialList() {
      return this.canvasList[this.canvasIndex].materialList
    }
  },
  watch: {
    materialIndex(val) {
      if (this.materialList.length === 0) return
      this.materialPosition = JSON.parse(JSON.stringify(this.materialList[val].position))
    },
    materialPosition: {
      handler: function(val) {
        if (val.x === null) return
        this.updateMaterial({
          index: this.materialIndex,
          position: JSON.parse(JSON.stringify(val))
        })
      },
      deep: true
    },
    materialList: {
      handler: function(val) {
        if (val.length === 0) {
          this.materialPosition = {
            x: null,
            y: null,
            w: null,
            h: null
          }
          return
        }
        if (JSON.stringify(val[this.materialIndex].position) !== JSON.stringify(this.materialPosition)) { // 判断两个值是否相等，避免陷入死循环
          this.materialPosition = JSON.parse(JSON.stringify(val[this.materialIndex].position))
        }
      },
      deep: true
    }
  },
  mounted() {
    // console.log(this.materialList)
  },
  methods: {
    ...mapMutations('show', {
      selectCanvas: 'selectCanvas',
      moveCanvas: 'moveCanvas',
      addCanvas: 'addCanvas',
      doDelCanvas: 'delCanvas',
      updateMaterial: 'updateMaterial',
      selectMeterial: 'selectMeterial',
      changeMaterialIndex: 'changeMaterialIndex'
    }),
    delCanvas() {
      if (this.canvasList.length <= 1) {
        this.$message.error('至少保留一个页面')
        return false
      }
      this.$confirm(`是否确认删除选中的页面？`, '提示', {
        confirmButtonText: '确定',
        cancalButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.doDelCanvas()
      }).catch(() => {})
    },
    saveCanvas() {
      console.log('save')
    },
    changeTab() {},
    submit() {}
  }
}
</script>
<style lang="scss" scoped>
@import "./style";
</style>
<style lang="scss">
.showAdd .config-area {
    .el-tabs__nav {
        width: 100%;
    }
    .el-tabs__item {
        width: 50% !important;
    }
    .el-tabs--border-card {
        flex: auto;
        .el-tabs__content {
            padding: 0 !important;
            .tool {
                height: 36px;
                width: 100%;
                padding: 3px;
                border: 1px solid #E6E6E6;
                .el-button--primary {
                    background-color: #DFDBDB;
                    color: #000;
                    &:hover {
                        color: #FF672B;
                    }
                }
            }
            .page-panel {
                width: 100%;
                height: 260px;
                border: 1px solid #E6E6E6;
                overflow-y: auto;
                overflow-x: hidden;
                .page-panel-item {
                    cursor: pointer;
                    height: 30px;
                    line-height: 30px;
                    padding: 0 10px;
                    border-bottom: 1px solid #d1d4e5;
                    &:hover {
                        background-color: #F2F2F2;
                    }
                }
                .selected {
                    font-weight: bold;
                    background-color: #DCDBDB !important;
                }
            }
            .select-window {
                width: 100%;
                height: 24px;
                line-height: 24px;
                margin: 7px 0;
                position: relative;
                .select-window-label {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 120px;
                    padding-right: 8px;
                    text-align: right;
                }
                .select-window-content {
                    padding-left: 120px;
                    input {
                        height: 24px;
                        width: 120px;
                    }
                    .el-select {
                        width: 120px;
                        .el-input__icon {
                            top: 13px;
                        }
                    }
                    .el-color-picker {
                        .el-color-picker__trigger {
                            width: 120px;
                            height: 24px !important;
                            padding: 5px;
                            .el-color-picker__color {
                                width: 90px;
                                height: 13px;
                            }
                            .el-color-picker__icon {
                                margin-left: 0;
                                top: -1px;
                                right: -3px;
                            }
                        }
                    }
                }
            }
            .select-material {
                width: 100%;
                height: 26px;
                line-height: 26px;
                margin: 7px 0;
                position: relative;
                .select-material-label {
                    position: absolute;
                    top: 1px;
                    left: 0;
                    width: 96px;
                    padding-right: 10px;
                    text-align: right;
                    font-size: 12px;
                }
                .select-material-content {
                    padding-left: 96px;
                    .el-select {
                        width: 100px;
                        .el-input__icon {
                            top: 14px;
                        }
                        .el-input__inner {
                            height: 26px;
                        }
                    }
                    .el-button-group {
                        position: relative;
                        top: -1px;
                        .el-button {
                            background-color: #DFDBDB;
                            color: #000;
                            padding: 7px 7px 6px;
                            &:hover {
                                color: #FF672B;
                            }
                            i {
                                font-size: 12px;
                            }
                        }
                    }
                }
            }
            .material-params {
                position: relative;
                height: 80px;
                width: 100%;
                .material-params-label {
                    position: absolute;
                    top: 32px;
                    left: 0;
                    width: 96px;
                    padding-right: 10px;
                    text-align: right;
                    font-size: 12px;
                }
                .material-params-content {
                    padding: 1px 1px 1px 96px;
                    height: 80px;
                    .material-params-items {
                        margin-top: 11px;
                        height: 25px;
                        .material-params-item {
                            display: inline-block;
                            width: 80px;
                            height: 25px;
                            .material-params-item-label {
                                display: inline-block;
                                width: 13px;
                                text-align: center;
                            }
                            input {
                                width: 56px;
                            }
                        }
                    }
                }
            }
            .title {
                width: 100%;
                height: 25px;
                line-height: 25px;
                border: 1px solid #e6e6e6;
                border-top: 0;
                display: flex;
                .title_name {
                    width: 30%;
                }
                .title_type {
                    width: 20%;
                }
                .title_desc {
                    width: 50%;
                }
            }
            .content {
                width: 100%;
                height: 220px;
                overflow: auto;
                border: 1px solid #e6e6e6;
                border-top: 0;
                display: flex;
                & > div {
                    height: 24px;
                    line-height: 24px;
                    padding-left: 1%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .content_name {
                    width: 29%;
                }
                .content_type {
                    width: 19%;
                }
                .content_desc {
                    width: 49%;
                }
            }
        }
    }
}
</style>
