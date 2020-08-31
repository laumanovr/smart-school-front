export const superAdminSidebars = [
	{
		name: 'Аналитика',
		icon: 'chart.svg',
		route: '/super-admin'
	},
	{
		name: 'Школы',
		icon: 'schools.svg',
		route: '/super-admin/schools'
	},
	{
		name: 'Администратор',
		icon: 'teachers.svg',
		route: '/super-admin/school-admin'
	},
	{
		name: 'Учителя',
		icon: 'teachers.svg',
		route: '/super-admin/instructors'
	},
	{
		name: 'Ученики',
		icon: 'students.svg',
		route: '/super-admin/students'
	},
	{
		name: 'Предметы',
		icon: 'courses.svg',
		route: '/super-admin/courses'
	},
	{
		name: 'Районы',
		icon: 'country.svg',
		route: '/super-admin/rayon'
	},
	{
		name: 'Календарь',
		icon: 'calendar.svg',
		route: '/super-admin/calendar'
	},
	{
		name: 'Объявления',
		icon: 'announcement.svg',
		route: '/super-admin/announcements'
	},
	{
		name: 'Библиотека',
		icon: 'library.svg',
		route: '/super-admin/library'
	},
	{
		name: 'Академический год',
		icon: 'library.svg',
		route: '/super-admin/chronicle'
	}
];

export const schoolAdminSidebars = [
	{
		name: 'Аналитика',
		icon: 'chart.svg',
		route: '/school-admin'
	},
	{
		name: 'О школе',
		icon: 'schools.svg',
		route: '/school-admin/about-school'
	},
	{
		name: 'Учителя',
		icon: 'teachers.svg',
		route: '/school-admin/teachers'
	},
	{
		name: 'Предметы',
		icon: 'courses.svg',
		route: '/school-admin/courses'
	},
	{
		name: 'Классы',
		icon: 'courses.svg',
		route: '/school-admin/classes'
	},
	{
		name: 'Ученики',
		icon: 'students.svg',
		route: '/school-admin/students'
	},
	{
		name: 'Объявления',
		icon: 'announcement.svg',
		route: '/school-admin/announcements'
	},
	{
		name: 'Расписание',
		icon: 'schedule.svg',
		route: '/school-admin/schedule-week'
	},
	{
		name: 'Библиотека',
		icon: 'library.svg',
		route: '/school-admin/library'
	},
	{
		name: 'Четверть',
		icon: 'schedule.svg',
		route: '/school-admin/school-quarter'
	},
]

export const instructorSidebars = [
	{
		name: 'Аналитика',
		icon: 'chart.svg',
		route: '/instructor-page'
	},
	{
		name: 'Журнал',
		icon: 'journal.svg',
		route: '/instructor-page/journal-grade'
	},
	{
		name: 'Ит.Оценки',
		icon: 'quarter-grade.svg',
		route: '/instructor-page/quarter-grade'
	},
	{
		name: 'Мои классы',
		icon: 'my-class.svg',
		route: '/instructor-page/classes'
	},
    {
        name: 'Типы оценок',
        icon: 'courses.svg',
        route: '/instructor-page/grade-reason'
    },
	{
		name: 'Уроки',
		icon: 'book-open.svg',
		route: '/instructor-page/topic'
	},
	{
		name: 'Расписание',
		icon: 'schedule.svg',
		route: '/instructor-page/schedule'
	},
	{
		name: 'Сообщения',
		icon: 'message.svg',
		route: '/instructor-page/message'
	},
]
