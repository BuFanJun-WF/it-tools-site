import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/components/home/HomePage.vue'),
  },
  {
    path: '/hall',
    name: 'hall',
    component: () => import('@/components/hall/HallPage.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/components/shell/SimplePage.vue'),
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('@/components/shell/SimplePage.vue'),
  },
  {
    path: '/feedback',
    name: 'feedback',
    component: () => import('@/components/shell/SimplePage.vue'),
  },
  {
    path: '/:toolId',
    name: 'tool',
    component: () => import('@/components/tool/ToolView.vue'),
    props: true,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/components/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
