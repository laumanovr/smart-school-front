import { BaseApiService } from '@/_services/baseApi.service';

export class QuarterGradeService extends BaseApiService {
    constructor () {
        super();
    }

    getStudentsQuarterGrades(classId, courseId, yearId, instrId) {
        const baseUrl = `${process.env.VUE_APP_BASE_URL}/v1/`;
        const url = baseUrl + `quarter/grade/class/${classId}/course/${courseId}/chronicle/${yearId}?instructor_id=${instrId}`;
        return this.sendGetRequest(url);
    }

    createWithArray(body) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/quarter/grade/create-massive`;
        return this.sendPostRequest(url, body);
    }

    // postQuarterGrade(classId, courseId, body) {
    //     const url = `${process.env.VUE_APP_BASE_URL}/v1/quarter/grade/course/${courseId}/class/${classId}`;
    //     return this.sendPostRequest(url, body);
    // }
}

export default new QuarterGradeService();
