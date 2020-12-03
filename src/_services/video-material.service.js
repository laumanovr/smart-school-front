import { BaseApiService } from '@/_services/baseApi.service';

export class VideoMaterialService extends BaseApiService {
    constructor() {
        super();
    }

    getListByRole(roleCode) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/video-instructor/role/${roleCode}`;
        return this.sendGetRequest(url);
    }

    create(data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/video-instructor/create`;
        return this.sendPostRequest(url, data);
    }

    update(data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/video-instructor/edit/${data.id}`;
        return this.sendPostRequest(url, data);
    }

    remove(id) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/video-instructor/${id}`;
        return this.sendDeleteRequest(url);
    }
}

export default new VideoMaterialService();
