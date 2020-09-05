import { BaseApiService } from '@/_services/baseApi.service'

export class StudentClassService extends BaseApiService {
    constructor () {
        super();
    }

    getByStudent(studentId) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student-class/list/${studentId}`;
        return this.sendGetRequest(url);
    }

    create (data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student-class/create`;
        return this.sendPostRequest(url, data);
    }

    edit (data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student-class/edit/${data.id}`;
        return this.sendPostRequest(url, data);
    }
}
