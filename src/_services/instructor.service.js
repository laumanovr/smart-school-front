import { BaseApiService } from '@/_services/baseApi.service'

export class InstructorService extends BaseApiService {
    constructor () {
        super();
    }

    list (page=0, schoolId='', courseCode='', regionId='', rayonId='') {
        const baseUrl = `${process.env.VUE_APP_BASE_URL}/v1/instructor/list`;
        const url = baseUrl + `?page=${page}&schoolId=${schoolId}&courseCode=${courseCode}&regionId=${regionId}&rayonId=${rayonId}`;
        return this.sendGetRequest(url);
    }

    responseList(body) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/instructor/response/list`;
        return this.sendPostRequest(url, body);
    }
}

export default new InstructorService()
