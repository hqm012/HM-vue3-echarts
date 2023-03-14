import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    // {
    // path: '/about',
    // name: 'about',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import('../views/AboutView.vue')
    // },
    {
      path: '/seller',
      name: 'seller',
      component: () => import('../views/SellerView/index.vue')
    },
    {
      path: '/trend',
      name: 'trend',
      component: () => import('../views/TrendView/index.vue')
    },
    {
      path: '/map',
      name: 'map',
      component: () => import('../views/MapView/index.vue')
    },
    {
      path: '/rank',
      name: 'rank',
      component: () => import('../views/RankView/index.vue')
    },
    {
      path: '/hot',
      name: 'hot',
      component: () => import('../views/HotView/index.vue')
    },
    {
      path: '/stock',
      name: 'stock',
      component: () => import('../views/StockView/index.vue')
    },
  ]
})

export default router
