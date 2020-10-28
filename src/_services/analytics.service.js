import { BaseApiService } from '@/_services/baseApi.service';

export class AnalyticsService extends BaseApiService {
    constructor () {
        super();
    }

    userTrackPage(startDate, endDate, roleId) {
        const baseUrl = `${process.env.VUE_APP_BASE_URL}/v1/user-track-page/list`;
        const url = baseUrl + `?startDate=${startDate}&endDate=${endDate}&roleId=${roleId}`;
        return this.sendGetRequest(url);
    }

    quarterAverage(chronicleId, schoolId='', quarterId='', rayonId='') {
        const baseUrl = `${process.env.VUE_APP_BASE_URL}/v1/analytic/quarter-grade`;
        const url = baseUrl + `?chronicleId=${chronicleId}&schoolId=${schoolId}&quarterId=${quarterId}&rayonId=${rayonId}`;
        return this.sendGetRequest(url);
    }

    getStudentPerformance(schoolId='', chronicleId='', quarterId='', classId='') {
        const baseUrl = `${process.env.VUE_APP_BASE_URL}/v1/analytic/performance`;
        const url = baseUrl + `?chronicleId=${chronicleId}&schoolId=${schoolId}&quarterId=${quarterId}&classId=${classId}`;
        return this.sendGetRequest(url);
    }

    getTotalStudentsCount(schoolId, classId, rayonId='') {
        const baseUrl = `${process.env.VUE_APP_BASE_URL}/v1/analytic/student-count`;
        const url = baseUrl + `?schoolId=${schoolId}&classId=${classId}`;
        return this.sendGetRequest(url);
    }
}

export default new AnalyticsService();
