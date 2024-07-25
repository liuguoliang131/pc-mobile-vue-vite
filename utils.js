const utils = {}


// 判断浏览器是否是移动设备
utils.isMobile = function () {
  const flag = navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  )
  return flag
}

// 判断浏览器是否是微信浏览器
utils.isWechat = function () {
  var ua = window.navigator.userAgent.toLowerCase()
  if (ua.match(/micromessenger/i) == 'micromessenger') {
    return true
  } else {
    return false
  }
}

// 判断设备是否为ios
utils.isIOS = function () {
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua);
}




export default utils