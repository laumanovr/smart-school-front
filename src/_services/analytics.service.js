import { BaseApiService } from '@/_services/baseApi.service';

export class AnalyticsService extends BaseApiService {
    constructor () {
        super();
    }

    userTrackPage(startDate, endDate, roleId) {
        const baseUrl = `${process.env.VUE_APP_BASE_URL}/v1/user-track-page/list`;
        const url = baseUrl + `?startDate=${startDate}&endDate=${endDate}&roleId=${roleId}`;
        return this.sendGetRequest(url);
    }
}

export default new AnalyticsService();
