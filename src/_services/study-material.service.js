import { BaseApiService } from '@/_services/baseApi.service';

export class StudyMaterialService extends BaseApiService{
    constructor() {
        super();
    }

    create(data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/school/material/create`;
        return this.sendPostRequest(url, data);
    }

    fetchList(schoolId) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/school/material/school/${schoolId}`;
        return this.sendPostRequest(url);
    }
}

export default new StudyMaterialService();
