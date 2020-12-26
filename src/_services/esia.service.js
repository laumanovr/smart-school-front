import { BaseApiService } from '@/_services/baseApi.service';

export class EsiaService extends BaseApiService {
    constructor () {
        super();
    }

    authenticateWithESI() {
        const esiUrl = 'https://dev-esia.tunduk.kg/connect/authorize' +
                       '?response_type=code&scope=openid profile' +
                       '&code_challenge=ugQcrcOWLQxGma6yqnnK-9UyzbD_iYtHWRDilkTT3QA' +
                       '&code_challenge_method=S256' +
                       '&client_id=smart_school_socservice_kg&redirect_uri=http://ds.edu.gov.kg/oauth2/login/esia';
        const options = {
            method: 'GET',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        };
        return fetch(esiUrl, options).then((res) => res);
    }

    getAccessToken(code) {
        const encodedClientData = window.btoa('smart_school_socservice_kg:XGWrKZnfbXWEyVbJHvgGpnUaGfxtdPTp');
        const tokenUrl = 'https://dev-esia.tunduk.kg/connect/token';
        debugger
        const options = {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + encodedClientData,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=authorization_code' +
                  '&code=' + code +
                  '&redirect_uri=http://ds.edu.gov.kg/oauth2/login/esia' +
                  '&code_verifier=MLofakM9ZLYo6j7Iofqm7dPC7sOvIKsPzv2UKQ4COSZntJoW'
        };
        return fetch(tokenUrl, options).then((res) => res);
    }

    getUserInfo(token) {
        const userInfoUrl = 'https://dev-esia.tunduk.kg/connect/userinfo';
        const options = {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };
        return fetch(userInfoUrl, options).then((res) => res);
    }
}

export default new EsiaService();


