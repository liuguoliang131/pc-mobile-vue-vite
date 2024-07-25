import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from '@vant/auto-import-resolver';
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import pxtorem from "postcss-pxtorem"
import { createFile, removeDir } from './floderName.js';

const basePath = {
  development: './',
  testing: `http://test-yjc-browser.hanhoukeji.cn/yjc-chain-browser/`,
  production: `./`
}

export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  return {
    build: {
      rollupOptions: {
        input: {
          mobile: '/mobile.html'
        }
      },

      sourcemap: false,//生成map文件
      minify: true, // 代码混淆器 开启后缩减代码量
      outDir: `dist`,
      assetsDir: 'assets_mobile',
      emptyOutDir: true

    },
    base: basePath[mode], // 静态文件路径


    plugins: [
      vue(),
      AutoImport({
        resolvers: [VantResolver()],
      }),
      Components({
        resolvers: [VantResolver()],
      }),
    ],
    css: {
      postcss: {
        plugins: [
          pxtorem({
            // 要忽略的CSS属性
            propList: ['*'],
            exclude: () => false,  // 忽略哪个目录? 不忽略
            rootValue: 37.5
          })
        ],
      },


      // css模块化配置项
      modules: {
        // ....
      },
      // 预处理器配置项
      preprocessorOptions: {
        less: {
          // 一些配置项
        }
      }
    },

    server: {
      host: '0.0.0.0',
      port: '8090',
      proxy: {
        '/api': {
          target: 'http://test-achilles.hanhoukeji.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/'),
        },
      }
    },

    resolve: {
      alias: {
        // 设置别名 "@", 指向项目的 "src" 目录
        '@': path.resolve(__dirname, 'src_mobile')
      },
    }
  }
})