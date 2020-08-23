import { BaseApiService } from '@/_services/baseApi.service';

export class ScheduleWeekService extends BaseApiService {
    constructor () {
        super();
    }

    getAllBySchoolAndShift(schoolId, shiftId) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/instructor/schedule/week/list/school/${schoolId}?shiftId=${shiftId}`;
        return this.sendGetRequest(url);
    }
    
    getByInstructor (id, weekDay = '') {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/instructor/schedule/week/list/instructor/${id}?weekDay=${weekDay}`;
        return this.sendGetRequest(url);
    }

    create(data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/instructor/schedule/week/create`;
        return this.sendPostRequest(url, data);
    }

    update(data) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/instructor/schedule/week/edit/${data.id}`;
        return this.sendPostRequest(url, data);
    }

    deleteSchedule(id) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/instructor/schedule/week/${id}`;
        return this.sendDeleteRequest(url);
    }
}
export default new ScheduleWeekService();
