import { BaseApiService } from '@/_services/baseApi.service';

export class AnalyticsService extends BaseApiService {
    constructor () {
        super();
    }

    userTrackPage(startDate, endDate, roleId, schoolId='') {
        const baseUrl = `${process.env.VUE_APP_BASE_URL}/v1/user-track-page/list`;
        const url = baseUrl + `?startDate=${startDate}&endDate=${endDate}&roleId=${roleId}&schoolId=${schoolId}`;
        return this.sendGetRequest(url);
    }

    trackPageListRayono(startDate, endDate, roleId, rayonId, schoolId='') {
        const baseUrl = `${process.env.VUE_APP_BASE_URL}/v1/user-track-page/list-rayon`;
        const url = baseUrl + `?startDate=${startDate}&endDate=${endDate}&roleId=${roleId}&rayonId=${rayonId}&schoolId=${schoolId}`;
        return this.sendGetRequest(url);
    }

    quarterAverage(chronicleId, schoolId='', quarterId='', rayonId='') {
        const baseUrl = `${process.env.VUE_APP_BASE_URL}/v1/analytic/quarter-grade`;
        const url = baseUrl + `?chronicleId=${chronicleId}&schoolId=${schoolId}&quarterId=${quarterId}&rayonId=${rayonId}`;
        return this.sendGetRequest(url);
    }

    getStudentPerformance(schoolId='', chronicleId='', quarterId='', classId='', courseId='') {
        const baseUrl = `${process.env.VUE_APP_BASE_URL}/v1/analytic/performance`;
        const url = baseUrl + `?chronicleId=${chronicleId}&schoolId=${schoolId}&quarterId=${quarterId}&classId=${classId}&courseId=${courseId}`;
        return this.sendGetRequest(url);
    }

    getTotalStudentsCount(schoolId, classId, rayonId='') {
        const baseUrl = `${process.env.VUE_APP_BASE_URL}/v1/analytic/student-count`;
        const url = baseUrl + `?schoolId=${schoolId}&classId=${classId}`;
        return this.sendGetRequest(url);
    }

    getClassPerformance(classId, quarterId) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/analytic/class-performance?classId=${classId}&quarterId=${quarterId}`;
        return this.sendGetRequest(url);
    }

    // ATTENDANCE REPORT
    getClassAttendanceCount(classId, quarterId) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/analytic/attendance-count?classId=${classId}&quarterId=${quarterId}`;
        return this.sendGetRequest(url);
    }

    // CLASS-MOVE-ACTIVITY
    createClassActivity(data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/class-move-history/create`;
        return this.sendPostRequest(url, data);
    }

    getClassActivityList(schoolId='', chronicleId='', quarterId='', classId='') {
        const baseUrl = `${process.env.VUE_APP_BASE_URL}/v1/class-move-history/list`;
        const url = baseUrl + `?schoolId=${schoolId}&chronicleId=${chronicleId}&quarterId=${quarterId}&classId=${classId}`;
        return this.sendGetRequest(url);
    }

    updateClassActivity(data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/class-move-history/edit/${data.id}`;
        return this.sendPostRequest(url, data);
    }

    //  VEDOMOST STATEMENT
    getClassStatement(chronicleId='', quarterId='', classId='') {
        const baseUrl = `${process.env.VUE_APP_BASE_URL}/v1/analytic/statement/quarter-grade`;
        const url = baseUrl + `?chronicleId=${chronicleId}&quarterId=${quarterId}&classId=${classId}`;
        return this.sendGetRequest(url);
    }
}

export default new AnalyticsService();
