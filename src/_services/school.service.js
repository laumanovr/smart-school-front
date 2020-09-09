import { BaseApiService } from '@/_services/baseApi.service'

export  class SchoolService extends BaseApiService {
    constructor () {
        super();
    }

    getById (id) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/school/${id}`;
        return this.sendGetRequest(url);
    }

    _delete (id) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/school/${id}`;
        return this.sendDeleteRequest(url);
    }

    create (data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/school/create`;
        return this.sendPostRequest(url, data);
    }

    update(data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/school/edit/${data.id}`;
        return this.sendPostRequest(url, data);
    }

    listPageable(page, regionId='', rayonId='') {
        const baseUrl = `${process.env.VUE_APP_BASE_URL}/v1/school/pageable/list`;
        const url = baseUrl + `?page=${page}&regionId=${regionId}&rayonId=${rayonId}`;
        return this.sendGetRequest(url);
    }
}
