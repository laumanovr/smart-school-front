import { BaseApiService } from '@/_services/baseApi.service'

export class StudentClassService extends BaseApiService {
    constructor () {
        super();
    }

    // getAll(schoolId) {
    //     const url = `${process.env.VUE_APP_BASE_URL}/v1/`;
    //     return this.sendGetRequest(url);
    // }

    create (data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student-class/create`;
        return this.sendPostRequest(url, data);
    }
}
