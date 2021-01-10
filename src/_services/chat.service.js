import { BaseApiService } from '@/_services/baseApi.service';

export class ChatService extends BaseApiService {
    constructor() {
        super();
    }

    establishChannel(data) {
        const url = `${process.env.VUE_APP_BASE_URL}/private-chat/channel`;
        return this.sendPutRequest(url, data);
    }

    getExistingMessages(channelId) {
        const url = `${process.env.VUE_APP_BASE_URL}/rest/private-chat/chat-status/${channelId}/0?size=100`;
        return this.sendGetRequest(url);
    }
}

export default new ChatService();
