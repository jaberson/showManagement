import axios from 'axios'
// 取得终端列表
export var terminalSearch = function (data) {
  return axios.get(window.cchome + window.mock + '/device/deviceList', { data: data })
}
// 取得终端详情
export var terminalDetail = function (data) {
  return axios.get(window.cchome + window.mock + '/device/' + data)
}
// 取得区域树
export var getAreaTree = function (data) {
  return axios.get('/publish/area/areaUserRelTreeForDevice', { data: data })
}
// 区域id取得站点
export var getSpotList = function (data) {
  return axios.get('/publish/area/districtTreeByAreaId', { data: data })
}
// 站点id取得设备
export var getDeviceList = function (data) {
  return axios.get('/publish/area/deviceListByDistrictId', { data: data })
}
// 模糊搜索站点
export var searchSpotList = function (data) {
  return axios.get(window.cchome + window.mock + '/area/districtTreeByCondition', { data: data })
}
// 新增终端
export var addTerminal = function (data) {
  return axios.post(window.cchome + window.mock + '/device', data)
}
// 修改终端
export var editTerminal = function (data) {
  return axios.put(window.cchome + window.mock + '/device/' + data.deviceId, data)
}
// 批量删除终端
export var deleteMulTerminal = function (data) {
  return axios.delete(window.cchome + window.mock + '/device/batchDelete', { data: data })
}
// 统计终端在线情况
export var deviceCountInfo = function () {
  return axios.get(window.cchome + window.mock + '/device/deviceCountInfo')
}
