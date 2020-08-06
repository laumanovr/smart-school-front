import { BaseApiService } from '@/_services/baseApi.service'

export  class InstructorService extends BaseApiService {
    constructor () {
        super();
    }

    list (page=0) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/instructor/list?page=${page}`;
        return this.sendGetRequest(url);
    }
}
