import { BaseApiService } from '@/_services/baseApi.service'

export class SchoolClassService extends BaseApiService {
    constructor () {
        super();
    }

    getAllBySchool(schoolId) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/class/list/school/${schoolId}`;
        return this.sendGetRequest(url);
    }

    create (data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/class/create`;
        return this.sendPostRequest(url, data);
    }
}
