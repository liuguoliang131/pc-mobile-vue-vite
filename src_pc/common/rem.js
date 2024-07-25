// pc浏览器
export function pcRem() {
  // 设置最小宽度
  document.querySelector('html').style.minWidth = '1280px'

  const calc = function () {
    let rootFontSize = document.documentElement.clientWidth / 10
    rootFontSize = rootFontSize > 128 ? rootFontSize : 128
    document.documentElement.style.fontSize = rootFontSize + 'px'
  }
  calc()
  window.addEventListener('resize', calc)
}




(function () {
  pcRem()
})()