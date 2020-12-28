import { authHeader, handleResponse } from '@/utils/authHeader';

export const userService = {
	login ({ username, password }) {
		const options = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password })
		};
		return fetch(`${process.env.VUE_APP_BASE_URL}/v1/auth/login`, options).then(handleResponse);
	},

	logout () {
		localStorage.removeItem('user');
		localStorage.removeItem('profile');
	},

	getProfile () {
		const options = {
			method: 'GET',
			headers: authHeader(),
		};
		return fetch(`${process.env.VUE_APP_BASE_URL}/v1/users/profile`, options).then(handleResponse);
	},

    registerUser(body) {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        };
        return fetch(`${process.env.VUE_APP_BASE_URL}/v1/auth/register`, options).then(handleResponse);
    },

    updateUser(body) {
        const options = {
            method: 'POST',
            headers: {...authHeader(), 'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        };
        return fetch(`${process.env.VUE_APP_BASE_URL}/v1/users/edit/${body.id}`, options).then(handleResponse);
    }
};
