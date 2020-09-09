import { BaseApiService } from '@/_services/baseApi.service'

export class InstructorService extends BaseApiService {
    constructor () {
        super();
    }

    list (page=0, schoolId='', courseCode='') {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/instructor/list?page=${page}&schoolId=${schoolId}&courseCode=${courseCode}`;
        return this.sendGetRequest(url);
    }
}

export default new InstructorService()
