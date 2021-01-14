import { BaseApiService } from '@/_services/baseApi.service';

export class NotificationService extends BaseApiService {
    constructor() {
        super();
        this.baseUrl = `${process.env.VUE_APP_BASE_URL}/v1/`;
    }

    getAllUnread(userId) {
        const url = this.baseUrl + `notification/user-interface/${userId}?status=UNREAD&limit=50&offset=0`;
        return this.sendGetRequest(url);
    }
}
export default new NotificationService();
