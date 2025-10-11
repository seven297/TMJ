import type { App } from 'vue'
import SkeletonCard from './SkeletonCard.vue'

/**
 * 注册全局组件（集中管理）
 * - 在此添加需要全局使用的组件
 */
export function registerGlobalComponents(_app: App) {
  // 在此添加需要全局使用的组件
  // 例如：_app.component('BaseButton', BaseButton)
  _app.component('SkeletonCard', SkeletonCard)
}

