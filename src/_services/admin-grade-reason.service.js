import { BaseApiService } from '@/_services/baseApi.service'

export class AdminGradeReasonService extends BaseApiService {
    constructor () {
        super();
    }

    getAll() {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/admin/grade/reason/list`;
        return this.sendGetRequest(url);
    }

    getByAdminCourse(adminCourseId) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/admin/grade/reason/list-filter?adminCourseId=${adminCourseId}`;
        return this.sendGetRequest(url);
    }

    create(body) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/admin/grade/reason/create`;
        return this.sendPostRequest(url, body);
    }

    update(body) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/admin/grade/reason/edit/${body.id}`;
        return this.sendPostRequest(url, body);
    }

    deleteReason(id) {
        // admin/grade/reason/{id}
    }
}
export default new AdminGradeReasonService();
