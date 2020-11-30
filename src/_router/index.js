import Vue from 'vue'
import VueRouter from 'vue-router'
import $user from './protect-route'
import Login from '@/views/login/Login'
import Chronicle from '@/views/super-admin/Chronicle'
import SchoolAdmin from '@/views/super-admin/SchoolAdmin'
import Instructor from '@/views/super-admin/Instructor'
import Courses from '@/views/super-admin/Courses'
import Dashboard from '@/views/school-admin/Dashboard'
import Teachers from '@/views/school-admin/Teachers'
import SchoolAdminCourses from '@/views/school-admin/SchoolAdminCourses'
import SuperAdminEmpty from '@/views/super-admin/SuperAdminEmpty'
import Rayon from "@/views/super-admin/Rayon";
import Students from "@/views/super-admin/Students";
import Calendar from "@/views/super-admin/Calendar";

const loadComponent = path => () => import(`@/views/${path}.vue`);

Vue.use(VueRouter);

const routes = [
	{
		path: '/login',
		name: 'login',
		component: Login,
        meta: {
            requireAuth: false
        }
	},
    {
        path: '/oauth2/login/esia',
        name: 'loginEsia',
        component: loadComponent('login/LoginEsi'),
        meta: {
            requireAuth: false
        }
    },

    // LANDING
    {
        path: '/',
        name: 'home',
        component: loadComponent('landing/MainPage'),
        meta: {
            requireAuth: false
        }
    },
    {
        path: '/about',
        name: 'about',
        component: loadComponent('landing/AboutProject'),
        meta: {
            requireAuth: false
        }
    },
    {
        path: '/support',
        name: 'support',
        component: loadComponent('landing/Support'),
        meta: {
            requireAuth: false
        }
    },
    {
        path: '/opportunity',
        name: 'opportunity',
        component: loadComponent('landing/Opportunities'),
        meta: {
            requireAuth: false
        }
    },
    {
        path: '/teacher-opportunity',
        name: 'teacherOpportunity',
        component: loadComponent('landing/TeacherOpportunity'),
        meta: {
            requireAuth: false
        }
    },
    {
        path: '/gos-opportunity',
        name: 'gosOpportunity',
        component: loadComponent('landing/GosOpportunity'),
        meta: {
            requireAuth: false
        }
    },
    {
        path: '/parent-opportunity',
        name: 'parentOpportunity',
        component: loadComponent('landing/ParentOpportunity'),
        meta: {
            requireAuth: false
        }
    },
    {
        path: '/student-opportunity',
        name: 'studentOpportunity',
        component: loadComponent('landing/StudentOpportunity'),
        meta: {
            requireAuth: false
        }
    },

    // SUPER-ADMIN
	{
		path: '/super-admin',
		component: loadComponent('super-admin/SuperAdminManage'),
        beforeEnter: (to, from, next) => {
            $user.checkSuperAdmin(next);
        },
		children: [
			{
				path: '/',
				name: 'superAdminDashboard',
				component: loadComponent('super-admin/SuperAdminDashboard'),
                meta: {
                    requireAuth: true
                }
			},
			{
				name: 'superAdminSchools',
				path: 'schools',
				component: loadComponent('super-admin/Schools'),
                meta: {
                    requireAuth: true
                }
			},
			{
				name: 'superSchoolAdmin',
				path: 'school-admin',
				component: SchoolAdmin,
                meta: {
                    requireAuth: true
                }
			},
            {
                name: 'rayonHead',
                path: 'rayon-head',
                component: loadComponent('super-admin/RayonHead'),
                meta: {
                    requireAuth: true
                }
            },
			{
				name: 'superAdminInstructors',
				path: 'instructors',
				component: Instructor,
                meta: {
                    requireAuth: true
                }
			},
            {
                name: 'superAdminStudents',
                path: 'students',
                component: Students,
                meta: {
                    requireAuth: true
                }
            },
			{
				name: 'superAdminCourses',
				path: 'courses',
				component: Courses,
                meta: {
                    requireAuth: true
                }
			},
			{
				name: 'superAdminRayon',
				path: 'rayon',
				component: Rayon,
                meta: {
                    requireAuth: true
                }
			},
			{
				name: 'superAdminCalendar',
				path: 'calendar',
				component: Calendar,
                meta: {
                    requireAuth: true
                }
			},
			{
				name: 'superAdminAnnouncement',
				path: 'announcements',
				component: loadComponent('super-admin/Announcements'),
                meta: {
                    requireAuth: true
                }
			},
			{
				name: 'superAdminLibrary',
				path: 'library',
				component: loadComponent('super-admin/Library'),
                meta: {
                    requireAuth: true
                }
			},
            {
                name: 'superAdminChronicle',
                path: 'chronicle',
                component: Chronicle,
                meta: {
                    requireAuth: true
                }
            },
            {
                name: 'superAdminGradeReason',
                path: 'grade-reason',
                component: loadComponent('super-admin/AdminGradeReason'),
                meta: {
                    requireAuth: true
                }
            }
		],
	},

    // SCHOOL-ADMIN
	{
		path: '/school-admin',
		component: loadComponent('school-admin/SchoolAdminManage'),
        beforeEnter: (to, from, next) => {
            $user.checkSchoolAdmin(next);
        },
		children: [
			{
				name: 'schoolAdminDashboard',
				path: '/',
				component: Dashboard,
                meta: {
                    requireAuth: true
                }
			},
			{
				name: 'schoolAdminTeachers',
				path: 'teachers',
				component: Teachers,
                meta: {
                    requireAuth: true
                }
			},
			{
				name: 'schoolAdminCourses',
				path: 'courses',
				component: SchoolAdminCourses,
                meta: {
                    requireAuth: true
                }
			},
			{
				name: 'schoolAdminClasses',
				path: 'classes',
				component: loadComponent('school-admin/SchoolAdminClasses'),
                meta: {
                    requireAuth: true
                }
			},
			{
				name: 'schoolAdminStudents',
				path: 'students',
				component: loadComponent('school-admin/Students'),
                meta: {
                    requireAuth: true
                }
			},
			{
				name: 'schoolAdminAnnouncements',
				path: 'announcements',
				component: loadComponent('school-admin/Announcements'),
                meta: {
                    requireAuth: true
                }
			},
			{
				name: 'library',
				path: 'library',
				component: loadComponent('school-admin/Library'),
                meta: {
                    requireAuth: true
                }
			},
			{
				name: 'schoolAdminScheduleWeek',
				path: 'schedule-week',
				component: loadComponent('school-admin/SchoolAdminScheduleWeek'),
                meta: {
                    requireAuth: true
                }
			},
			{
				name: 'aboutSchool',
				path: 'about-school',
				component: loadComponent('school-admin/AboutSchool'),
                meta: {
                    requireAuth: true
                }
			},
			{
				name: 'schoolAdminQuarter',
				path: 'school-quarter',
				component: loadComponent('school-admin/QuarterCalendar'),
                meta: {
                    requireAuth: true
                }
			},
			{
				name: 'shifts',
				path: 'shifts',
				component: loadComponent('school-admin/Shift'),
                meta: {
                    requireAuth: true
                }
			},
            {
                name: 'adminReport',
                path: 'admin-report',
                component: loadComponent('school-admin/SchoolAdminReport'),
                meta: {
                    requireAuth: true
                }
            }
		],
	},

    // INSTRUCTOR
	{
        path: '/instructor',
        component: loadComponent('instructor/InstructorManage'),
        beforeEnter: (to, from, next) => {
            $user.checkInstructor(next);
        },
        children: [
            {
                name: 'instructorDashboard',
                path: '/',
                component: loadComponent('instructor/InstructorDashboard'),
                meta: {
                    requireAuth: true
                }
            },
	        {
		        name: 'instructorQuarterGrade',
		        path: 'quarter-grade',
		        component: loadComponent('instructor/InstructorQuarterGrade'),
                meta: {
                    requireAuth: true
                }
	        },
	        {
		        name: 'instructorTopics',
		        path: 'topics',
		        component: loadComponent('instructor/InstructorTopic'),
                meta: {
                    requireAuth: true
                }
	        },
            {
                name: 'instructorClasses',
                path: 'classes',
                component: loadComponent('instructor/InstructorClasses'),
                meta: {
                    requireAuth: true
                }
            },
            {
                name: 'instructorSchedule',
                path: 'schedule',
                component: loadComponent('instructor/InstructorSchedule'),
                meta: {
                    requireAuth: true
                }
            },
            {
                name: 'instructorJournalGrade',
                path: 'journal-grade',
                component: loadComponent('instructor/InstructorJournalGrade'),
                meta: {
                    requireAuth: true
                }
            },
            {
                name: 'instructorOnlineLesson',
                path: 'online-lesson',
                component: loadComponent('instructor/InstructorOnlineLesson'),
                meta: {
                    requireAuth: true
                }
            },
            {
                name: 'instructorReport',
                path: 'instructor-report',
                component: loadComponent('instructor/InstructorReport'),
                meta: {
                    requireAuth: true
                }
            },
            {
                name: 'instructorMessage',
                path: 'message',
                component: SuperAdminEmpty,
                meta: {
                    requireAuth: true
                }
                // Временно
            },
        ],
    },

    // RAYON-HEAD
    {
        path: '/rayon-head',
        component: loadComponent('rayon-head/RayonHeadManage'),
        beforeEnter: (to, from, next) => {
            $user.checkRayonHead(next);
        },
        children: [
            {
                path: '/',
                name: 'rayonHeadDashboard',
                component: loadComponent('rayon-head/Dashboard'),
                meta: {
                    requireAuth: true
                },
            },
            {
                name: 'rayonHeadSchools',
                path: 'schools',
                component: loadComponent('rayon-head/Schools'),
                meta: {
                    requireAuth: true
                },
            },
            {
                name: 'rayonHeadInstructors',
                path: 'instructors',
                component: loadComponent('rayon-head/Instructors'),
                meta: {
                    requireAuth: true
                },
            },
            {
                name: 'rayonHeadStudents',
                path: 'students',
                component: loadComponent('rayon-head/Students'),
                meta: {
                    requireAuth: true
                },
            },
            {
                name: 'rayonHeadReport',
                path: 'rayon-head-report',
                component: loadComponent('rayon-head/RayonHeadReport'),
                meta: {
                    requireAuth: true
                },
            },
            // {
            //     name: 'rayonHeadCalendar',
            //     path: 'calendar',
            //     component: loadComponent('rayon-head/Calendar')
            // },
        ],
    },
	{ path: '*', redirect: '/' }
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
});

router.beforeEach((to, from, next) => {
	const loggedIn = localStorage.getItem('user');
	if (to.meta.requireAuth && !loggedIn) {
		return next('/login');
	}
	next();
});

export default router
