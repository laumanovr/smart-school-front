import { BaseApiService } from '@/_services/baseApi.service'

export  class AdminCourseService extends BaseApiService {
    constructor () {
        super();
    }

    getById (id) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/admin/course/${id}`;
        return this.sendGetRequest(url);
    }

    _delete (id) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/admin/course/${id}`;
        return this.sendDeleteRequest(url);
    }

    create (data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/admin/course/create`;
        return this.sendPostRequest(url, data);
    }

    edit (data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/admin/course/edit/${data.id}`;
        return this.sendPostRequest(url, data);
    }

    list () {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/admin/course/list`;
        return this.sendGetRequest(url);
    }
}
