/**
 * 新建节目store
 *
 * @author jiaxs
 * @date 2018-3-7
 */
const state = {
  canvasList: [{name: '新建页面1', id: 1, meterialN: 0, materialList: []}],
  canvasIndex: 0,
  canvasN: 1,
  materialIndex: null
}

const mutations = {
  selectCanvas (state, index) {
    state.canvasIndex = index
    state.materialIndex = 0
  },
  moveCanvas (state, type) {
    if (type === 'up' && state.canvasIndex !== 0) {
      let temp = JSON.parse(JSON.stringify(state.canvasList[state.canvasIndex]))
      state.canvasList.splice(state.canvasIndex, 1)
      state.canvasList.splice(state.canvasIndex - 1, 0, temp)
      state.canvasIndex--
    } else if (type === 'down' && state.canvasIndex !== state.canvasList.length - 1) {
      let temp = JSON.parse(JSON.stringify(state.canvasList[state.canvasIndex]))
      state.canvasList.splice(state.canvasIndex, 1)
      state.canvasList.splice(state.canvasIndex + 1, 0, temp)
      state.canvasIndex++
    }
  },
  addCanvas (state, item) {
    if (state.canvasN >= 8) return
    state.canvasN++
    state.canvasList.push({
      name: '新建页面' + state.canvasN,
      id: state.canvasN,
      meterialN: 0,
      materialList: []
    })
  },
  delCanvas (state) {
    state.canvasList.splice(state.canvasIndex, 1)
    state.canvasIndex = state.canvasIndex === 0 ? 0 : state.canvasIndex - 1
  },
  selectMeterial (state, index) {
    if (state.materialIndex !== index) state.materialIndex = index
  },
  addMeterial (state, item) {
    let n = ++state.canvasList[state.canvasIndex].meterialN
    state.materialIndex = state.canvasList[state.canvasIndex].materialList.length
    state.canvasList[state.canvasIndex].materialList.push({
      id: n,
      name: n + '-' + item.name,
      type: item.sig,
      index: n,
      position: {}
    })
  },
  delMaterial (state, id) {
    state.canvasList[state.canvasIndex].materialList.forEach((item, index) => {
      if (item.id === id) {
        state.canvasList[state.canvasIndex].materialList.splice(index, 1)
        state.materialIndex = state.materialIndex === 0 ? 0 : state.materialIndex - 1
      }
    })
  },
  updateMaterial (state, item) {
    state.canvasList[state.canvasIndex].materialList[item.index].position = item.position
    // console.log(state.canvasList[state.canvasIndex].materialList)
  },
  changeMaterialIndex (state, type) {
    let materialList = state.canvasList[state.canvasIndex].materialList
    if (materialList.length < 2) return
    let temp = materialList[state.materialIndex].index
    if (type === 'up' && state.materialIndex < materialList.length - 1) {
      materialList[state.materialIndex].index = materialList[state.materialIndex + 1].index  // 先互换index
      materialList[state.materialIndex + 1].index = temp
      temp = JSON.parse(JSON.stringify(materialList[state.materialIndex]))
      materialList.splice(state.materialIndex, 1)  // 再互换对象在数组中的位置
      materialList.splice(state.materialIndex + 1, 0, temp)
      state.materialIndex++
    } else if (type === 'down' && state.materialIndex !== 0) {
      materialList[state.materialIndex].index = materialList[state.materialIndex - 1].index // 先互换index
      materialList[state.materialIndex - 1].index = temp
      temp = JSON.parse(JSON.stringify(materialList[state.materialIndex]))
      materialList.splice(state.materialIndex, 1)  // 再互换对象在数组中的位置
      materialList.splice(state.materialIndex - 1, 0, temp)
      state.materialIndex--
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
