import { BaseApiService } from '@/_services/baseApi.service'

export  class RayonService extends BaseApiService {
    constructor () {
        super();
    }

    getById (id) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/location/rayon/edit/${id}`;
        return this.sendGetRequest(url);
    }

    _delete (id) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/location/rayon?id=${id}`;
        return this.sendDeleteRequest(url);
    }

    create (data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/location/rayon/create`;
        return this.sendPostRequest(url, data);
    }

    edit (data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/location/rayon/edit/${data.id}`;
        return this.sendPostRequest(url, data);
    }

    list () {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/location/rayon/list`;
        return this.sendGetRequest(url);
    }

    listByRegion (id) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/location/rayon/get?region_id=${id}`;
        return this.sendGetRequest(url);
    }
}
