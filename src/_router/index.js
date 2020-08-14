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
import Teachers from '@/views/school-admin/Teachers'
import SchoolAdminCourses from '@/views/school-admin/SchoolAdminCourses'
import SuperAdminEmpty from '@/views/super-admin/SuperAdminEmpty'
import Rayon from "@/views/super-admin/Rayon";
import Students from "@/views/super-admin/Students";

const loadComponent = path => () => import(`@/views/${path}.vue`);

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Login
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
      },
      {
        name: 'superAdminStudents',
        path: 'students',
        component: Students
      },
      {
        name: 'superAdminRayon',
        path: 'rayon',
        component: Rayon
      },
      {
        name: 'superAdminCalendar',
        path: 'calendar',
        component: SuperAdminEmpty
      },
      {
        name: 'superAdminAnnouncement',
        path: 'announcements',
        component: loadComponent('super-admin/Announcements')
      },
      {
        name: 'superAdminLibrary',
        path: 'library',
        component: loadComponent('super-admin/Library')
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
      },
      {
        name: 'schoolAdminTeachers',
        path: 'teachers',
        component: Teachers
      },
      {
        name: 'schoolAdminCourses',
        path: 'courses',
        component: SchoolAdminCourses
      },
      {
        name: 'schoolAdminClasses',
        path: 'classes',
        component: loadComponent('school-admin/SchoolAdminClasses')
      },
      {
        name: 'schoolAdminStudents',
        path: 'students',
        component: loadComponent('school-admin/Students')
      },
      {
        name: 'schoolAdminAnnouncements',
        path: 'announcements',
        component: loadComponent('school-admin/Announcements')
      },
      {
        name: 'library',
        path: 'library',
        component: loadComponent('school-admin/Library')
      },
      {
        name: 'schoolAdminScheduleWeek',
        path: 'schedule-week',
        component: loadComponent('school-admin/SchoolAdminScheduleWeek')
      },
      {
        name: 'aboutSchool',
        path: 'about-school',
        component: loadComponent('school-admin/AboutSchool')
      },
      {
        name: 'schoolAdminQuarter',
        path: 'school-quarter',
        component: loadComponent('school-admin/QuarterCalendar')
      },
      {
        name: 'shifts',
        path: 'shifts',
        component: loadComponent('school-admin/Shift')
      }
    ]
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
