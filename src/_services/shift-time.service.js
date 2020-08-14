import { BaseApiService } from '@/_services/baseApi.service';

export class ShiftTimeService extends BaseApiService {
    constructor () {
        super();
    }

    getAllByShiftId(shiftId) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/shift-time/list/shift/${shiftId}`;
        return this.sendGetRequest(url);
    }

    create (data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/shift-time/create`;
        return this.sendPostRequest(url, data);
    }

    update(data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/shift-time/edit/${data.id}`;
        return this.sendPostRequest(url, data);
    }
}
