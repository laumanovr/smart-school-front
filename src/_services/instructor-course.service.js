import { BaseApiService } from '@/_services/baseApi.service'

export  class InstructorCourseService extends BaseApiService {
    constructor () {
        super();
    }

    getById (id) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/instructor/course/${id}`;
        return this.sendGetRequest(url);
    }

    _delete (id) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/instructor/course/${id}`;
        return this.sendDeleteRequest(url);
    }

    create (data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/instructor/course/create`;
        return this.sendPostRequest(url, data);
    }

    edit (data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/instructor/course/edit/${data.id}`;
        return this.sendPostRequest(url, data);
    }

    listByInstructor (id, page = 0) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/instructor/course/list/instructor/${id}?page=${page}`;
        return this.sendGetRequest(url);
    }

    listBySchool (id, page = 0) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/instructor/course/list/school/${id}?size=500`;
        return this.sendGetRequest(url);
    }
}
