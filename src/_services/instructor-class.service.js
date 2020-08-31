import { BaseApiService } from '@/_services/baseApi.service'

export class InstructorClassService extends BaseApiService {
    constructor () {
        super();
    }

    getAllClasses(schoolId) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/instructor/class/list/school/${schoolId}`;
        return this.sendGetRequest(url);
    }

    create (data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/instructor/class/create`;
        return this.sendPostRequest(url, data);
    }

    update (data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/instructor/class/edit/${data.id}`;
        return this.sendPostRequest(url, data);
    }

    getByInstructorId(insId, page = 0, size = 20) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/instructor/class/list/instructor/${insId}?page=${page}&size=${size}`;
        return this.sendGetRequest(url);
    }
    
    getByClassId(classId, page = 0, size = 20) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/instructor/class/list/class/${classId}?page=${page}&size=${size}`;
        return this.sendGetRequest(url);
    }

    _delete (id) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/instructor/class/${id}`;
        return this.sendDeleteRequest(url);
    }
}
