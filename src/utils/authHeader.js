export function authHeader () {

	const user = JSON.parse(localStorage.getItem('user'));

	if (user && user.token) {
		return { 'Authorization': 'Bearer_' + user.token };
	} else {
		return {};
	}
}

export function handleResponse (response, logout) {
	return response.text().then(text => {
		const data = text && JSON.parse(text);
		if (!response.ok) {
			if (response.status === 401) {
				logout();
				location.reload(true);
			}

			const error = (data && data.message) || response.statusText;
			return Promise.reject(error);
		}

		return data;
	});
}
