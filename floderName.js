
import * as fs from 'fs'
import * as path from 'path'
export function createFile(timeCode, mode) {

  fs.writeFile('./floder.md', `${timeCode} ${mode == 'testing' ? '测试环境' : '生产环境'}`, (error) => {

    // 创建失败
    if (error) {
      console.log(`文件路径生成失败:${error}`)
    }

    // 创建成功
    console.log(`文件路径已生成到floder.md`)

  })
}


// 删空文件夹
export function removeDir(dir = 'dist') {
  let files = fs.readdirSync(dir)
  for (var i = 0; i < files.length; i++) {
    let newPath = path.join(dir, files[i]);
    let stat = fs.statSync(newPath)
    if (stat.isDirectory()) {
      //如果是文件夹就递归下去
      removeDir(newPath);
    } else {
      //删除文件
      fs.unlinkSync(newPath);
    }
  }
  fs.rmdirSync(dir)//如果文件夹是空的，就将自己删除掉
}