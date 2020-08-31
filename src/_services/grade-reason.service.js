import { BaseApiService } from '@/_services/baseApi.service'

export class GradeReasonService extends BaseApiService {
    constructor () {
        super();
    }

    getByInstructor(instructorId, klassLevel, courseId) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/grade/reason/list/instructor/${instructorId}?classLevel=${klassLevel}&courseId=${courseId}`;
        return this.sendGetRequest(url);
    }

    create(body) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/grade/reason/create`;
        return this.sendPostRequest(url, body);
    }

    update(body) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/grade/reason/edit/${body.id}`;
        return this.sendPostRequest(url, body);
    }

    deleteReason(id) {
    }
}
export default new GradeReasonService();
