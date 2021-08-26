import { BaseApiService } from '@/_services/baseApi.service';

export class StudentService extends BaseApiService {
    constructor () {
        super();
    }

    getAllBySchool(schoolId, query='', archived=false) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student/list/school/${schoolId}?archived=${archived}&query=${query}`;
        return this.sendGetRequest(url);
    }

    getByPin(pin) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student/get-by-pin?pin=${pin}`;
        return this.sendGetRequest(url);
    }

    getGeneratedCode(studentId) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student/get-code/${studentId}`;
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

    list (page=0, schoolId='', classLevel='', regionId='', rayonId='', query='') {
        const baseUrl = `${process.env.VUE_APP_BASE_URL}/v1/student/list`;
        const url = baseUrl + `?page=${page}&schoolId=${schoolId}&classLevel=${classLevel}&regionId=${regionId}&rayonId=${rayonId}&query=${query}`;
        return this.sendGetRequest(url);
    }

    getAllStudents(data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student/list-interface`;
        return this.sendPostRequest(url, data);
    }

    getDeletedClassStudents(classId, quarterId, chronicleId) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student-move/list/class/${classId}?quarterId=${quarterId}&chronicleId=${chronicleId}`;
        return this.sendGetRequest(url);
    }

    _delete(id, data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student/${id}`;
        return this.sendDeleteRequest(url, data);
    }

    massDelete (ids) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student/mass-delete`;
        return this.sendDeleteRequest(url, ids);
    }

    activate(studentId) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student/activate/${studentId}`;
        return this.sendPostRequest(url, {});
    }

    changeSchool(studentSchoolId, body) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student-school/edit/${studentSchoolId}`;
        return this.sendPostRequest(url, body);
    }

    studentClassCreate(body) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student-class/create`;
        return this.sendPostRequest(url, body);
    }

    attachFile(studentId, formData) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student/attachment/${studentId}/create`;
        return this.sendPostRequest(url, formData);
    }

    getAttaches(studentId) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student/attachment/${studentId}`;
        return this.sendGetRequest(url);
    }

    deleteFile(fileId) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student/attachment?id=${fileId}`;
        return this.sendDeleteRequest(url, {});
    }
}
