import { BaseApiService } from '@/_services/baseApi.service'

export  class RegionService extends BaseApiService {
    constructor () {
        super();
    }

    getById (id) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/location/region/${id}`;
        return this.sendGetRequest(url);
    }

    _delete (id) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/location/region?id=${id}`;
        return this.sendDeleteRequest(url);
    }

    create (data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/location/region/create`;
        return this.sendPostRequest(url, data);
    }

    edit (data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/location/region/edit/${data.id}`;
        return this.sendPostRequest(url, data);
    }

    list (page) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/location/region?page=${page}`;
        return this.sendGetRequest(url);
    }

    listByCountry (id) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/location/region/get?country_id=${id}`;
        return this.sendGetRequest(url);
    }
}
