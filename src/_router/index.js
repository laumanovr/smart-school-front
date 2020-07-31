import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '@/views/login/Login'
import Chronicle from '@/views/super-admin/Chronicle'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
    {
        path: '/login',
        name: 'login',
        component: Login
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
        },
          {
              name: 'superAdminChronicle',
              path: 'chronicle',
              component: Chronicle
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
