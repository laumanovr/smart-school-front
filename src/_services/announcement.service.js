import { BaseApiService } from '@/_services/baseApi.service';

export class AnnouncementService extends BaseApiService {
    constructor () {
        super();
    }

    getSchoolAnnouncements(schoolId, roleType, classId='') {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/announcement/school/${schoolId}?roleType=${roleType}&classId=${classId}`;
        return this.sendGetRequest(url);
    }

    getAllAnnouncementsByRole(role, page=0) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/announcement/list?roleType=${role}&page=${page}&size=20`;
        return this.sendGetRequest(url);
    }

    create(data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/announcement/create`;
        return this.sendPostRequest(url, data);
    }

    update(data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/announcement/edit/${data.id}`;
        return this.sendPostRequest(url, data);
    }

    remove(id) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/announcement/${id}`;
        return this.sendDeleteRequest(url);
    }
}

export default new AnnouncementService();
