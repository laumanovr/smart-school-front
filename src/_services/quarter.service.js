import { BaseApiService } from '@/_services/baseApi.service';

export class QuarterService extends BaseApiService {

    constructor() {
        super();
    }

    getListAll() {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/quarter/list`;
        return this.sendGetRequest(url);
    }

    generateQuarter(school_id, chronicle_id){
        const url = `${process.env.VUE_APP_BASE_URL}/v1/quarter/generate?chronicleId=${chronicle_id}&schoolId=${school_id}`;
        return this.sendPostRequest(url, {});
    }

    getBySchoolAndChronicle(school_id, chronicle_id){
        const url = `${process.env.VUE_APP_BASE_URL}/v1/quarter/list/school/${school_id}/chronicle/${chronicle_id}`;
        return this.sendGetRequest(url);
    }

    getById(id) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/quarter/${id}`;
        return this.sendGetRequest(url);
    }

    create(data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/quarter/create`;
        return this.sendPostRequest(url, data);
    }

    edit(data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/quarter/edit/${data.id}`;
        return this.sendPostRequest(url, data);
    }

    _delete(id) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/quarter/${id}`;
        return this.sendDeleteRequest(url);
    }
}
