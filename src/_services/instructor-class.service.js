import { BaseApiService } from '@/_services/baseApi.service'

export class InstructorClassService extends BaseApiService {
    constructor () {
        super();
    }

    getAllClasses(schoolId) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/instructor/class/list/school/${schoolId}`;
        return this.sendGetRequest(url);
    }

    create (data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/instructor/class/create`;
        return this.sendPostRequest(url, data);
    }
}
