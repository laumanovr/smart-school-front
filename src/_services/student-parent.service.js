import { BaseApiService } from '@/_services/baseApi.service'

export class StudentParentService extends BaseApiService {
    constructor () {
        super();
    }

    getStudentParentList(schoolId, classId='') {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student-parent/list?schoolId=${schoolId}&classId=${classId}`;
        return this.sendGetRequest(url);
    }

    getByStudent(studentId) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student-parent/list/student/${studentId}`;
        return this.sendGetRequest(url);
    }

    create (data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student-parent/create`;
        return this.sendPostRequest(url, data);
    }

    update (data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/student-parent/edit/${data.id}`;
        return this.sendPostRequest(url, data);
    }
}
