import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
      name: 'superAdmin',
      path: '/super-admin',
      component: () => import('@/views/super-admin/Dashboard'),
      children: [
        {
          path: '/',
          name: 'superAdminDashboard',
          component: () => import(/* webpackChunkName: "admin" */ '@/views/super-admin/SuperAdminDashboard')
        },
        {
          name: 'superAdminSchools',
          path: 'schools',
          component: () => import('@/views/super-admin/Schools')
        }
      ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
