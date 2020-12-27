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
    },
    {
        code: 'ROLE_DIRECTOR',
        url: '/director'
    },
    {
        code: 'ROLE_MIN_EDUCATION',
        url: '/min-education'
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
            const role = roles.find(i => i.code === res.role[0].code);
            dispatch('updateProfileData', res);
            dispatch('checkSchoolQuarter', {user: res, role: role});
            dispatch('fetchCurrentQuarterData', {user: res, role: role});
            dispatch('fetchRegions', {user: res, role: role});
        }).catch((err) => {
            console.log(err);
            commit('SET_ERROR', err);
        });
    },

    checkSchoolQuarter({commit, dispatch}, data) {
        if (data.role.code === 'ROLE_ADMIN' || data.role.code === 'ROLE_DIRECTOR') {
            if (data.user.schools[0].quarterId) {
                quarterService.checkQuarter(data.user.schools[0]).then((res) => {
                    if (res.success) {
                        schoolService.getById(data.user.schools[0].id).then((school) => {
                            data.user.schools[0] = school;
                            dispatch('updateProfileData', data.user);
                        });
                    }
                    router.push(data.role.url);
                }).catch((err) => {
                    console.log(err);
                    commit('SET_ERROR', err);
                })
            } else {
                router.push({name: 'quarterInitCreate'});
            }
        }
    },

    fetchCurrentQuarterData({commit, dispatch}, data) {
	    if (data.role.code === 'ROLE_INSTRUCTOR') {
	        quarterService.getById(data.user.schools[0].quarterId).then((res) => {
                data.user.schools[0].quarterStart = res.startDate;
                data.user.schools[0].quarterEnd = res.endDate;
                data.user.schools[0].semester = res.semester;
                dispatch('updateProfileData', data.user);
                router.push(data.role.url);
            }).catch((err) => {
                console.log(err);
                commit('SET_ERROR', err);
            })
        }
    },

    fetchRegions({dispatch}, data) {
	    const role = data.role.code;
	    if (role === 'ROLE_SUPER_ADMIN' || role === 'ROLE_RAYON_HEADER' || role === 'ROLE_MIN_EDUCATION') {
            router.push(data.role.url);
            if (role === 'ROLE_SUPER_ADMIN' || role === 'ROLE_MIN_EDUCATION') {
                dispatch('location/fetchRegions', {}, {root: true});
            }
        }
    },

    updateProfileData({commit}, res) {
        commit('SET_PROFILE', res);
        localStorage.setItem('profile', JSON.stringify(res));
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
