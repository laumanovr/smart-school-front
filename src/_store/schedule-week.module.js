import scheduleWeekService from "@/_services/schedule-week.service";

const state = {
	data: []
}
const actions = {
	fetchScheduleWeek ({ commit }, id) {
		return scheduleWeekService.getByInstructor(id).then(res => {
			commit('SET_DATA', res)
			return res
		}).catch(err => console.log(err))
	}
}
const mutations = {
	SET_DATA (state, data) {
		state.data = data
	}
}
const getters = {
	getClasses: (state) => {
		const classes = [];
		state.data.forEach(i => {
			if (!classes.some(el => el.classId === i.classId)) classes.push(i)
		});
		return classes
	},
	getCourses: (state) => {
		const courses = []
		state.data.forEach(i => {
			if (!courses.some(c => c.courseId === i.courseId)) courses.push(i)
		})
		return courses
	}
}

export const scheduleWeek = {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}
