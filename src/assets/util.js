exports.filterBuildInfo = function (data) {
  let tempArrs = data.split('-')
  return {
    community: tempArrs[0],
    zhuang: tempArrs[1],
    danyuan: tempArrs[2],
    roomId: tempArrs[3]
  }
}
exports.copy = (data) => { return JSON.parse(JSON.stringify(data)) }
exports.checkNumber = (rule, value, callback, length) => {  // 12.5有更改,需要必填
  if (value !== '') {
    if (isNaN(value)) {
      callback(new Error('请输入数字'))
    } else {
      if (!Number.isInteger(value * 1) || value * 1 < 0 || value.toString().indexOf('.') > -1 || value.toString().indexOf('+') > -1) {   // 12.20 不能出现小数点
        callback(new Error('请输入数字'))
      } else {
        if (value && value.length > length) {
          callback(new Error('长度不超过' + length + '个数字'))
        } else {
          callback()
        }
      }
    }
  } else {
    callback(new Error(' '))
  }
}

exports.checkSpecialCharOut = (str) => {
  let pattern = new RegExp("[`~!@#%$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）;———|{}【】‘；：”“'。，、？\\\\]+")
  return pattern.test(str)
}
exports.checkSpecialChar = (rule, value, callback) => {
  let pattern = new RegExp("[`~!@#%$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）;———|{}【】‘；：”“'。，、？\\\\]+")
  if (pattern.test(value)) {
    callback(new Error('内容含有特殊字符'))
  } else {
    callback()
  }
}

exports.checkUseName = (rule, value, callback) => {
  let pattern = new RegExp('^[\u4e00-\u9fa5a-zA-Z0-9]+$')
  if (!pattern.test(value)) {
    callback(new Error('只能使用汉字,英文大小写或数字'))
  } else {
    callback()
  }
}
// 英文+数字
exports.checkCharNum = (rule, value, callback) => {
  let pattern = new RegExp('^[a-zA-Z0-9]+$')
  if (!pattern.test(value)) {
    callback(new Error('只能使用英文大小写或数字'))
  } else {
    callback()
  }
}
// 密码:包含数字,字母及特殊字符且8到20位
exports.checkPass = (rule, value, callback) => {
  let pattern = /^(?![a-zA-Z0-9]+$)(?![^a-zA-Z/D]+$)(?![^0-9/D]+$).{8,}$/
  if (!value) {
    callback(new Error('密码不能为空'))
  } else if (!pattern.test(value)) {
    callback(new Error('包含数字,字母及特殊字符且8到20位'))
  } else {
    callback()
  }
}
exports.checkPasswordComplexity = function (szPwd) {
  var iResult = 0
  szPwd.match(/[a-z]/g) && iResult++
  szPwd.match(/[A-Z]/g) && (iResult += iResult ? 2 : 1)
  szPwd.match(/[0-9]/g) && iResult++
  szPwd.match(/[^a-zA-Z0-9]/g) && (iResult += iResult ? 2 : 1)
  if (szPwd.length < 8) {
    iResult = 0
  }
  iResult && iResult--
  iResult = iResult > 3 ? 3 : iResult
  return iResult
}
exports.convertDateFromString = function (dateString) {
  if (dateString) {
    return new Date(dateString.replace(/-/g, '/'))
  }
}

exports.setsCookie = function (key, value, options) {
  // key and value given, set cookie...
  if (
    arguments.length > 1 &&
    (value === null || typeof value !== 'object')
  ) {
    options = { ...options }

    if (value === null) {
      options.expires = -1
    }

    if (typeof options.expires === 'number') {
      let days = options.expires
      let t = (options.expires = new Date())
      t.setDate(t.getDate() + days)
    }

    return (document.cookie = [
      encodeURIComponent(key),
      '=',
      options.raw ? String(value) : encodeURIComponent(String(value)),
      options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
      options.path ? '; path=' + options.path : '; path=/',
      options.domain ? '; domain=' + options.domain : '',
      options.secure ? '; secure' : ''
    ].join(''))
  }

  // key and possibly options given, get cookie...
  options = value || {}
  let result
  let decode = options.raw
      ? function (s) {
        return s
      }
      : decodeURIComponent
  return (result = new RegExp(
    '(?:^|; )' + encodeURIComponent(key) + '=([^;]*)'
  ).exec(document.cookie))
    ? decode(result[1])
    : null
}
