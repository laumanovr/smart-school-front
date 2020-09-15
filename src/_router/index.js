import Vue from 'vue'
import VueRouter from 'vue-router'
import $user from './protect-route'
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
import Calendar from "@/views/super-admin/Calendar";

const loadComponent = path => () => import(`@/views/${path}.vue`);

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Login,
	},
	{
		path: '/login',
		name: 'login',
		component: Login
	},

    // SUPER-ADMIN
	{
		path: '/super-admin',
		component: () => import('@/views/super-admin/Dashboard'),
        beforeEnter: (to, from, next) => {
            $user.checkSuperAdmin(next);
        },
		children: [
			{
				path: '/',
				name: 'superAdminDashboard',
				component: () => import('@/views/super-admin/SuperAdminDashboard')
			},
			{
				name: 'superAdminSchools',
				path: 'schools',
				component: () => import('@/views/super-admin/Schools')
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
                name: 'superAdminStudents',
                path: 'students',
                component: Students
            },
			{
				name: 'superAdminCourses',
				path: 'courses',
				component: Courses
			},
			{
				name: 'superAdminRayon',
				path: 'rayon',
				component: Rayon
			},
			{
				name: 'superAdminCalendar',
				path: 'calendar',
				component: Calendar
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
			},
            {
                name: 'superAdminChronicle',
                path: 'chronicle',
                component: Chronicle
            },
            {
                name: 'superAdminGradeReason',
                path: 'grade-reason',
                component: loadComponent('super-admin/AdminGradeReason')
            }
		],
	},

    // SCHOOL-ADMIN
	{
		path: '/school-admin',
		component: SchoolAdminManage,
        beforeEnter: (to, from, next) => {
            $user.checkSchoolAdmin(next);
        },
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
		],
	},

    // INSTRUCTOR
	{
        path: '/instructor-page',
        component: loadComponent('instructor/InstructorManage'),
        beforeEnter: (to, from, next) => {
            $user.checkInstructor(next);
        },
        children: [
            {
                name: 'instructorDashboard',
                path: '/',
                component: loadComponent('instructor/InstructorDashboard'),
            },
	        {
		        name: 'instructorQuarterGrade',
		        path: 'quarter-grade',
		        component: loadComponent('instructor/InstructorQuarterGrade'),
	        },
	        {
		        name: 'instructorTopics',
		        path: 'topics',
		        component: loadComponent('instructor/InstructorTopic'),
	        },
            {
                name: 'instructorClasses',
                path: 'classes',
                component: loadComponent('instructor/InstructorClasses')
            },
            {
                name: 'instructorSchedule',
                path: 'schedule',
                component: loadComponent('instructor/InstructorSchedule')
            },
            {
                name: 'instructorJournalGrade',
                path: 'journal-grade',
                component: loadComponent('instructor/InstructorJournalGrade')
            },
            {
                name: 'instructorMessage',
                path: 'message',
                component: SuperAdminEmpty // Временно
            }
        ],
    },
	{ path: '*', redirect: '/' }
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})
router.beforeEach((to, from, next) => {
	const publicPages = [ '/login', '/' ];
	const authRequired = !publicPages.includes(to.path);
	const loggedIn = localStorage.getItem('user');

	if (authRequired && !loggedIn) {
		return next('/login');
	}

	next();
});

export default router
