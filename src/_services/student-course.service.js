import { BaseApiService } from '@/_services/baseApi.service'

export class StudentCourseService extends BaseApiService {
    constructor () {
        super();
    }

    addCourseToClass(data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student-course/add-course-class`;
        return this.sendPostRequest(url, data);
    }

    createBatch (data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student-course/batch/create`;
        return this.sendPostRequest(url, data);
    }

    getListInterfaceByClass(data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student-course/list/interface/filter`;
        return this.sendPostRequest(url, data);
    }

    getByStudentIdAndChronicle(studentId, chronicleId) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student-course/list/student-interface/${studentId}/chronicle/${chronicleId}`;
        return this.sendGetRequest(url);
    }

    getByStudentId(studentId) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student-course/list/student/${studentId}`;
        return this.sendGetRequest(url);
    }

    removeStudCourse(studentCourseId) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student-course/${studentCourseId}`;
        return this.sendDeleteRequest(url);
    }

    deleteWithArray(data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student-course/remove-massive`;
        return this.sendPostRequest(url, data);
    }

    refreshScheduleCourses(data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student-course/regenerate-course`;
        return this.sendPostRequest(url, data);
    }
}
export default new StudentCourseService();
