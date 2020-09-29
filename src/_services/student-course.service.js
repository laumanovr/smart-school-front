import { BaseApiService } from '@/_services/baseApi.service'

export class StudentCourseService extends BaseApiService {
    constructor () {
        super();
    }

    createBatch (data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student-course/batch/create`;
        return this.sendPostRequest(url, data);
    }

    getByStudentId(studentId) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student-course/list/student/${studentId}`;
        return this.sendGetRequest(url);
    }

    deleteWithArray(data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student-course/remove-massive`;
        return this.sendPostRequest(url, data);
    }
}
export default new StudentCourseService();
