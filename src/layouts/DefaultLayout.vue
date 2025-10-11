<template>
  <div
    class="w-full min-h-screen bg-[#F6F8FE] text-gray-700 relative overflow-hidden"
  >
    <!-- 背景装饰圆形 -->
    <div class="background-decorations">
      <div class="decoration-circle decoration-circle-1"></div>
      <div class="decoration-circle decoration-circle-2"></div>
      <div class="decoration-circle decoration-circle-3"></div>
      <div class="decoration-circle decoration-circle-4"></div>
      <div class="decoration-circle decoration-circle-5"></div>
    </div>

    <!-- 顶部栏（Arco） -->
    <a-layout class="bg-white relative z-10">
      <a-layout-header class="bg-white px-6 shadow-sm">
        <div class="mx-auto max-w-6xl flex items-center justify-between h-14">
          <div class="flex items-center gap-2">
            <div class="logo-icon">
              <div class="logo-v">
                <img alt="avatar" src="@/assets/images/logo.png" />
              </div>
            </div>
            <span class="text-base font-semibold text-blue-700"
              >TMJ数字医生</span
            >
          </div>
          <a-avatar :size="32" class="bg-gray-100">
            <img
              alt="avatar"
              src="@/assets/images/user-avatar.png"
            />
          </a-avatar>
        </div>
      </a-layout-header>
    </a-layout>
    <!-- 主体区域由子路由渲染 -->
    <div class="main-container relative z-10">
      <keep-alive>
        <RouterView />
      </keep-alive>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * DefaultLayout - 应用通用布局：顶部栏 + 子路由容器
 * 子页面在此容器内通过 <RouterView /> 渲染。
 */
</script>

<style lang="scss" scoped>
/* 主背景样式 */
.main-container {
  width: 100vw;
  height: calc(100vh - 56px);
  overflow-y: auto;
  padding: 24px;
  box-sizing: border-box;

  /* 隐藏滚动条但保持滚动功能 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
}

/* 背景装饰圆形 */
.background-decorations {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.3;
  animation: float 20s ease-in-out infinite;
}

.decoration-circle-1 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  top: 10%;
  left: -5%;
  animation-delay: 0s;
}

.decoration-circle-2 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  top: 30%;
  right: -10%;
  animation-delay: 5s;
}

.decoration-circle-3 {
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  bottom: 20%;
  left: 5%;
  animation-delay: 10s;
}

.decoration-circle-4 {
  width: 250px;
  height: 250px;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  top: 60%;
  right: 15%;
  animation-delay: 15s;
}

.decoration-circle-5 {
  width: 180px;
  height: 180px;
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  bottom: 10%;
  right: 5%;
  animation-delay: 8s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) rotate(90deg);
  }
  50% {
    transform: translateY(0px) rotate(180deg);
  }
  75% {
    transform: translateY(20px) rotate(270deg);
  }
}

/* Logo样式 */
.logo-icon {
  position: relative;
  // width: 32px;
  // height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-v {
  width: 50px;
  height: 50px;
  // background: linear-gradient(135deg, #8b5cf6 0%, #fbbf24 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
  font-family: "Arial", sans-serif;
}
</style>
