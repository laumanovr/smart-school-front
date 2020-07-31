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
	}
};
