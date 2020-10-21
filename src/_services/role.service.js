import { BaseApiService } from '@/_services/baseApi.service'

export  class RoleService extends BaseApiService {
    constructor () {
        super();
    }

    getById (id) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/security/role/get/${id}`;
        return this.sendGetRequest(url);
    }

    _delete (id) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/security/role?id=${id}`;
        return this.sendDeleteRequest(url);
    }

    create (data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/security/role/create`;
        return this.sendPostRequest(url, data);
    }

    edit (data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/security/role/edit/${data.id}`;
        return this.sendPostRequest(url, data);
    }

    listPageable() {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/security/role/interface`;
        return this.sendGetRequest(url);
    }
}
