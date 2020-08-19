import { BaseApiService } from '@/_services/baseApi.service';

export class StudentService extends BaseApiService {
    constructor () {
        super();
    }

    getAllBySchool(schoolId) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student/list/school/${schoolId}`;
        return this.sendGetRequest(url);
    }

    create (data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student/create`;
        return this.sendPostRequest(url, data);
    }

    edit (data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student/edit/${data.id}`;
        return this.sendPostRequest(url, data);
    }

    list (page = 0) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student/list?page=${page}`;
        return this.sendGetRequest(url);
    }
}
