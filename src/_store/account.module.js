import {userService} from '@/_services/user.service';
import router from '@/_router';
import {QuarterService} from '@/_services/quarter.service';
const quarterService = new QuarterService();
import {SchoolService} from '@/_services/school.service';
const schoolService = new SchoolService();

const user = JSON.parse(localStorage.getItem('user'));
const profile = JSON.parse(localStorage.getItem('profile'));

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
		url: '/instructor'
	},
    {
        code: 'ROLE_RAYON_HEADER',
        url: '/rayon-head'
    }
];

const state = {
	user: user ? user : {},
	profile: profile ? profile : {},
    onError: ''
};

const actions = {
	login({commit, dispatch}, data) {
		userService.login(data).then((res) => {
			localStorage.setItem('user', JSON.stringify(res));
            commit('SET_USER', res);
            dispatch('getProfile');
        }).catch((err) => {
            console.log(err);
            commit('SET_ERROR', err);
        });
    },

    getProfile({commit, dispatch}) {
        userService.getProfile().then((res) => {
            dispatch('updateProfileData', res);
            const role = roles.find(i => i.code === res.role[0].code);
            router.push(role.url);
            dispatch('fetchCurrentQuarterData', res);
            dispatch('checkSchoolQuarter', res);
            dispatch('fetchRegions', res);
        }).catch((err) => {
            console.log(err);
            commit('SET_ERROR', err);
        });
    },

    checkSchoolQuarter({commit, dispatch}, user) {
        if (user.role[0].code.includes('ROLE_ADMIN')) {
            quarterService.checkQuarter(user.schools[0]).then((res) => {
                if (res.success) {
                    schoolService.getById(user.schools[0].id).then((school) => {
                        user.schools[0] = school;
                        dispatch('updateProfileData', user);
                    });
                }
            }).catch((err) => {
                console.log(err);
                commit('SET_ERROR', err);
            })
        }
    },

    fetchCurrentQuarterData({commit, dispatch}, user) {
	    if (user.role[0].code.includes('ROLE_INSTRUCTOR')) {
	        quarterService.getById(user.schools[0].quarterId).then((res) => {
                user.schools[0].quarterStart = res.startDate;
                user.schools[0].quarterEnd = res.endDate;
                user.schools[0].semester = res.semester;
                dispatch('updateProfileData', user);
            }).catch((err) => {
                console.log(err);
                commit('SET_ERROR', err);
            })
        }
    },

    updateProfileData({commit}, res) {
        commit('SET_PROFILE', res);
        localStorage.setItem('profile', JSON.stringify(res));
    },

    fetchRegions({dispatch}, res) {
        if (res.role[0].code.includes('ROLE_SUPER_ADMIN')) {
            dispatch('location/fetchRegions', {}, {root: true});
        }
    },

    logout({commit}) {
        userService.logout();
        commit('REMOVE_USER');
    }
};

const mutations = {
	SET_USER(state, data) {
		state.user = data;
	},
	REMOVE_USER(state) {
		state.user = null;
	},
	SET_PROFILE(state, data) {
		state.profile = data;
	},
    SET_ERROR(state, err) {
	    state.onError = err;
    }
};

export const account = {
	namespaced: true,
	state,
	actions,
	mutations
}
