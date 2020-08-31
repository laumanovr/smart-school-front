import { BaseApiService } from '@/_services/baseApi.service'

export  class FileImportService extends BaseApiService {
    constructor () {
        super();
    }

    importInstructor (data) {
        const fd = new FormData();
        for (let key in data) {
            fd.append(key, data[key]);
        }
        const url = `${process.env.VUE_APP_BASE_URL}/v1/file/instructor/import`;
        return this.sendPostRequest(url, fd);
    }
    
    importIsouInstructor (data) {
        const fd = new FormData();
        for (let key in data) {
            fd.append(key, data[key]);
        }
        const url = `${process.env.VUE_APP_BASE_URL}/v1/file/instructor/isuo/import`;
        return this.sendPostRequest(url, fd);
    }

    importStudent (data) {
        const fd = new FormData();
        for (let key in data) {
            fd.append(key, data[key]);
        }
        const url = `${process.env.VUE_APP_BASE_URL}/v1/file/student/import`;
        return this.sendPostRequest(url, fd);
    }
    
    importIsouStudent (data) {
        const fd = new FormData();
        for (let key in data) {
            fd.append(key, data[key]);
        }
        const url = `${process.env.VUE_APP_BASE_URL}/v1/file/student/isuo/import`;
        return this.sendPostRequest(url, fd);
    }
}
