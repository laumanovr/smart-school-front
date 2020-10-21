import { BaseApiService } from '@/_services/baseApi.service';

export class RayonHeadService extends BaseApiService {
    constructor() {
        super();
    }

    getAllRayonHeads(rayonId='') {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/user-rayon/list?rayonId=${rayonId}`;
        return this.sendGetRequest(url);
    }

    createHeadRayon(body) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/user-rayon/create`;
        return this.sendPostRequest(url, body);
    }

    updateHeadRayon(body) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/user-rayon/edit/${body.id}`;
        return this.sendPostRequest(url, body);
    }
}
export default new RayonHeadService();
