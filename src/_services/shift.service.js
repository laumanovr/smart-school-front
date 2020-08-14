import { BaseApiService } from '@/_services/baseApi.service';

export class ShiftService extends BaseApiService {
    constructor () {
        super();
    }

    getAllBySchool(schoolId) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/shift/list/school/${schoolId}`;
        return this.sendGetRequest(url);
    }

    create (data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/shift/create`;
        return this.sendPostRequest(url, data);
    }

    update(data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/shift/edit/${data.id}`;
        return this.sendPostRequest(url, data);
    }
}
