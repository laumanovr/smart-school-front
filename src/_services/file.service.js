import { BaseApiService } from '@/_services/baseApi.service';
import { authHeader } from '@/utils/authHeader';

export class FileService extends BaseApiService {
    constructor() {
        super()
    }

    downloadFile(fileName) {
        const requestOptions = {
            method: 'GET',
            headers: { ...authHeader() },
        };
        const url = `${process.env.VUE_APP_BASE_URL}/v1/file/downloadFile/${fileName}`;
        return fetch(url, requestOptions).then((res) => {
            return res;
        }).catch((err) => {
            return err;
        });
    }
}

export default new FileService();
