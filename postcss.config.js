import * as os from 'os'
const platform = os.platform();  // 系统名称


export const setPxtoremConfig = () => {
  // 返回 pxtorem 插件配置
  return {
    // 要忽略的CSS属性
    propList: ['*'],
    exclude: () => false,  // 忽略哪个目录? 不忽略
    rootValue({ file }) {
      let mobileList = [/mobile.html/, /\/src_mobile/, /\/node_modules\/vant/]
      const isMobile = mobileList.some(item => item.test(file))
      console.log('isMobile:', isMobile, 'file:', file)
      if (isMobile) {
        return 37.5;
      } else {
        return 144;
      }
    },
  }

}




