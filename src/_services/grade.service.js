import { BaseApiService } from '@/_services/baseApi.service'

export class GradeService extends BaseApiService {
    constructor () {
        super();
    }

    getByClassCourseInstructor(classId, courseId, body) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/grade/class/${classId}/course/${courseId}`;
        return this.sendPostRequest(url, body);
    }

    createWithArray(body) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/grade/create-massive-web`;
        return this.sendPostRequest(url, body);
    }
}
export default new GradeService();
