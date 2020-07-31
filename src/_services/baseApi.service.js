import { authHeader, handleResponse } from '@/utils/authHeader';

export class BaseApiService {

    sendGetRequest (url) {
        return this.sendRequest('GET', url);
    }

    sendDeleteRequest (url) {
        return this.sendRequest('DELETE', url);
    }

    sendPostRequest (url, data) {
        return this.sendRequest('POST', url, data);
    }

    sendPutRequest (url, data) {
        return this.sendRequest('PUT', url, data);
    }

    sendRequest (method, url, data) {
        const isFormData = data instanceof FormData;
        const requestOptions = {
            method: method,
            headers: { ...authHeader() },
        };
        if (!isFormData) {
            requestOptions.headers['Content-Type'] = 'application/json';
        }
        if (data) {
            requestOptions.body = isFormData ? data : JSON.stringify(data);
        }

        return fetch(url, requestOptions)
            .then(handleResponse);
    }
}
