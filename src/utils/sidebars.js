export default {
    superAdmin: [
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
            users: [
                {
                    name: 'Пользователи',
                    icon: 'teachers.svg',
                    route: '#'
                },
                {
                    name: 'Администратор',
                    icon: 'teachers.svg',
                    route: '/super-admin/school-admin'
                },
                {
                    name: 'Районо',
                    icon: 'teachers.svg',
                    route: '/super-admin/rayon-head'
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
            ]
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
        },
        {
            name: 'Типы оценок',
            icon: 'journal.svg',
            route: '/super-admin/grade-reason'
        }
    ],

    schoolAdmin: [
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
    ],

    instructor: [
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
            name: 'Темы',
            icon: 'book-open.svg',
            route: '/instructor-page/topics'
        },
        {
            name: 'Расписание',
            icon: 'schedule.svg',
            route: '/instructor-page/schedule'
        },
        {
            name: 'Онлайн Урок',
            icon: 'videocam.svg',
            route: '/instructor-page/online-lesson'
        },
        {
            name: 'Сообщения',
            icon: 'message.svg',
            route: '/instructor-page/message'
        },
    ],

    rayonHead: [
        {
            name: 'Аналитика',
            icon: 'chart.svg',
            route: '/rayon-head'
        },
        {
            name: 'Школы',
            icon: 'schools.svg',
            route: '/rayon-head/schools'
        },
        {
            name: 'Учителя',
            icon: 'teachers.svg',
            route: '/rayon-head/instructors'
        },
        {
            name: 'Ученики',
            icon: 'students.svg',
            route: '/rayon-head/students'
        },
        {
            name: 'Календарь',
            icon: 'calendar.svg',
            route: '/rayon-head/calendar'
        }
    ]
}
