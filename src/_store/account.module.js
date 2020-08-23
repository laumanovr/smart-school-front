import {userService} from '@/_services/user.service'
import router from '@/_router'

const user = JSON.parse(localStorage.getItem('user'))
const profile = JSON.parse(localStorage.getItem('profile'))

const roles = [
	{
		code: 'ROLE_SUPER_ADMIN',
		url: '/super-admin'
	},
	{
		code: 'ROLE_ADMIN',
		url: '/school-admin'
	},
	{
		code: 'ROLE_INSTRUCTOR',
		url: '/instructor-page'
	}
]

const state = {
	user: user ? user : {},
	profile: profile ? profile : {}
}

const actions = {
	login({commit, dispatch}, data) {
		userService.login(data).then(res => {
			localStorage.setItem('user', JSON.stringify(res));
			commit('SET_USER', res);
			dispatch('getProfile');
			const role = roles.find(i => i.code === res.roles[0].code)
			router.push(role.url);
		}).catch(err => console.log(err));
	},
	getProfile({commit}) {
		userService.getProfile().then(res => {
			commit('SET_PROFILE', res);
			localStorage.setItem('profile', JSON.stringify(res));
		}).catch(err => console.log(err));
	},
	logout({commit}) {
		userService.logout();
		commit('REMOVE_USER');
	}
}

const mutations = {
	SET_USER(state, data) {
		state.user = data;
	},
	REMOVE_USER(state) {
		state.user = null;
	},
	SET_PROFILE(state, data) {
		state.profile = data;
	}
}

export const account = {
	namespaced: true,
	state,
	actions,
	mutations
}
