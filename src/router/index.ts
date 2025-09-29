import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/DefaultLayout.vue'),
      children: [
        {
          path: '',
          name: 'effect-default',
          component: () => import('@/views/EffectView.vue')
        },
        {
          path: 'effect',
          name: 'effect',
          component: () => import('@/views/EffectView.vue')
        },
        {
          path: 'case',
          name: 'case',
          component: () => import('@/views/AICaseView.vue')
        },
        {
          path: 'diagnosis',
          name: 'diagnosis',
          component: () => import('@/views/AIDiagnosisView.vue')
        },
        {
          path: 'home',
          name: 'home',
          component: () => import('@/views/HomeView.vue')
        }
      ]
    }
  ]
})

export default router 