import { BaseApiService } from '@/_services/baseApi.service'

export  class PersonService extends BaseApiService {
    constructor () {
        super();
    }

    getById (id) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/person/${id}`;
        return this.sendGetRequest(url);
    }

    create (data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/person/create`;
        return this.sendPostRequest(url, data);
    }

    edit (data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/person/edit/${data.id}`;
        return this.sendPostRequest(url, data);
    }

    listSchoolAdmins (regionId='', rayonId='', schoolId='', query='') {
        const baseUrl = `${process.env.VUE_APP_BASE_URL}/v1/person/list-school-admin`;
        const url = baseUrl + `?regionId=${regionId}&rayonId=${rayonId}&schoolId=${schoolId}&query=${query}`;
        return this.sendGetRequest(url);
    }

    deleteSchoolAdmin(personId) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/person/${personId}`;
        return this.sendDeleteRequest(url);
    }
}
