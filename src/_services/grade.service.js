import { BaseApiService } from '@/_services/baseApi.service'

export class GradeService extends BaseApiService {
    constructor () {
        super();
    }

    getByClassCourseInstructor(classId, courseId, body) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/grade/class/${classId}/course/${courseId}`;
        return this.sendPostRequest(url, body);
    }

    getStudentSpecificGrade(grade) {
        const baseUrl = `${process.env.VUE_APP_BASE_URL}/v1/grade/student/${grade.studentId}/date/${grade.gradeDate}`;
        const url = baseUrl + `?courseId=${grade.courseId}&shiftTimeId=${grade.shiftTimeId}`;
        return this.sendGetRequest(url);
    }

    createWithArray(body) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/grade/create-massive-web`;
        return this.sendPostRequest(url, body);
    }

    checkStudentsGrade(ids) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/grade/list-by-student`;
        return this.sendPostRequest(url, ids);
    }

    deleteStudentGrades(ids) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/grade/delete-by-list`;
        return this.sendDeleteRequest(url, ids);
    }
}
export default new GradeService();
