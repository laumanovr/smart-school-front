import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '@/views/login/Login'
import Chronicle from '@/views/super-admin/Chronicle'
import SchoolAdmin from '@/views/super-admin/SchoolAdmin'
import Instructor from '@/views/super-admin/Instructor'
import Courses from '@/views/super-admin/Courses'
import Dashboard from '@/views/school-admin/Dashboard'
import SchoolAdminManage from '@/views/school-admin/SchoolAdminManage'

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
          },
          {
              name: 'superSchoolAdmin',
              path: 'school-admin',
              component: SchoolAdmin
          },
          {
              name: 'superAdminInstructors',
              path: 'instructors',
              component: Instructor
          },
          {
              name: 'superAdminCourses',
              path: 'courses',
              component: Courses
          }

      ]
    },
    {
        name: 'schoolAdmin',
        path: '/school-admin',
        component: SchoolAdminManage,
        children: [
            {
                name: 'schoolAdminDashboard',
                path: '/',
                component: Dashboard
            }
        ]
    }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
