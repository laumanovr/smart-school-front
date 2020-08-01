import { BaseApiService } from '@/_services/baseApi.service'

export  class CourseService extends BaseApiService {
    constructor () {
        super();
    }

    getById (id) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/course/${id}`;
        return this.sendGetRequest(url);
    }

    _delete (id) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/course/${id}`;
        return this.sendDeleteRequest(url);
    }

    create (data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/course/create`;
        return this.sendPostRequest(url, data);
    }

    edit (data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/course/edit/${data.id}`;
        return this.sendPostRequest(url, data);
    }

    listBySchool (id) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/course/school/${id}/list`;
        return this.sendGetRequest(url);
    }
}
