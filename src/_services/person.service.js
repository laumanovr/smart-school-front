import { BaseApiService } from '@/_services/baseApi.service'

export  class PersonService extends BaseApiService {
    constructor () {
        super();
    }

    getById (id) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/person/${id}`;
        return this.sendGetRequest(url);
    }

    // _delete (id) {
    //     const url = `${process.env.VUE_APP_BASE_URL}/v1/chronicle/${id}`;
    //     return this.sendDeleteRequest(url);
    // }

    create (data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/person/create`;
        return this.sendPostRequest(url, data);
    }

    edit (data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/person/edit/${data.id}`;
        return this.sendPostRequest(url, data);
    }

    list (rayon_id = '') {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/person/list-school-admin?rayon_id=${rayon_id}`;
        return this.sendGetRequest(url);
    }
}
