import { BaseApiService } from '@/_services/baseApi.service';

export class StudentService extends BaseApiService {
    constructor () {
        super();
    }

    getAllBySchool(schoolId) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student/list/school/${schoolId}`;
        return this.sendGetRequest(url);
    }

    getByClass(classId) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student/list/class/${classId}`;
        return this.sendGetRequest(url);
    }

    getDetails(studentId) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student/detail/${studentId}`;
        return this.sendGetRequest(url);
    }

    create (data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student/create`;
        return this.sendPostRequest(url, data);
    }

    edit (data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student/edit/${data.id}`;
        return this.sendPostRequest(url, data);
    }

    list (page=0, schoolId='', classLevel='', regionId='', rayonId='') {
        const baseUrl = `${process.env.VUE_APP_BASE_URL}/v1/student/list`;
        const url = baseUrl + `?page=${page}&schoolId=${schoolId}&classLevel=${classLevel}&regionId=${regionId}&rayonId=${rayonId}`;
        return this.sendGetRequest(url);
    }

    _delete (id) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student/${id}`;
        return this.sendDeleteRequest(url);
    }

    massDelete (ids) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student/mass-delete`;
        return this.sendDeleteRequest(url, ids);
    }
}
