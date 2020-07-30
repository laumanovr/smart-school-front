import { authHeader, handleResponse } from '@/utils/authHeader';

export const userService = {
	login (data) {
		const options = {
			method: 'POST',
			header: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		};
		return fetch('/v1/login', options).then(handleResponse, this.logout);
	},
	logout () {
		localStorage.removeItem('user');
	}
};
