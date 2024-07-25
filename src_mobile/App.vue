<template>
  <router-view v-slot="{ Component }">
    <Transition>
      <keep-alive include="HomeView">
        <component :is="Component" />
      </keep-alive>
    </Transition>
  </router-view>
</template>
<script setup>
import utils from "../utils";
if (!utils.isMobile() && window.location.pathname.includes("mobile.html")) {
  // 如果不是移动设备但处于移动版页面，则重定向到桌面版
  window.location.replace("./index.html");
}
</script>
<style lang="less">
.mobile_test {
  height: 37.5px;
}
* {
  padding: 0;
  margin: 0;
  overscroll-behavior: none; // 取消ios系统回弹动画效果
}

::-webkit-scrollbar {
  width: 6px;
  display: none;
}

::-webkit-scrollbar-thumb {
  background-color: #0003;
  border-radius: 10px;
  transition: all 0.2s ease-in-out;
}

::-webkit-scrollbar-track {
  border-radius: 10px;
}

:root:root {
  --van-base-font: "HYYakuHei";
}

#app {
  width: 100%;
  height: 100%;
  font-family: HYYakuHei;
  font-size: 12px;
  font-weight: 400;
  text-align: left;
  color: #383838;
  overflow-x: hidden;
  overflow-y: hidden;
}

/*  强制一行显示 超出显示省略号 */
.nowrap {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* 多行文本 超出显示省略号 */
/* 2行 */
.lineClamp2 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 3行 */
.lineClamp3 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
