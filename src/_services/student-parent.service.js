import { BaseApiService } from '@/_services/baseApi.service'

export class StudentParentService extends BaseApiService {
    constructor () {
        super();
    }

    getByStudent(studentId) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student-parent/list/student/${studentId}`;
        return this.sendGetRequest(url);
    }

    create (data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student-parent/create`;
        return this.sendPostRequest(url, data);
    }
    
    update (data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student-parent/edit/${data.id}`;
        return this.sendPostRequest(url, data);
    }
}
