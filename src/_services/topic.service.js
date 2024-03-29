import { BaseApiService } from '@/_services/baseApi.service'

export  class TopicService extends BaseApiService {
	constructor () {
		super();
	}

	getById (id) {
		const url = `${process.env.VUE_APP_BASE_URL}/v1/topic/${id}`;
		return this.sendGetRequest(url);
	}

	_delete (id) {
		const url = `${process.env.VUE_APP_BASE_URL}/v1/topic/${id}`;
		return this.sendDeleteRequest(url);
	}

	create (data) {
		const url = `${process.env.VUE_APP_BASE_URL}/v1/topic/create`;
		return this.sendPostRequest(url, data);
	}

	edit (data) {
		const url = `${process.env.VUE_APP_BASE_URL}/v1/topic/edit/${data.id}`;
		return this.sendPostRequest(url, data);
	}

	getByInstructor (page, insId, courseId, classLevel='', quarterId='', size=15, classId='') {
		const baseUrl = `${process.env.VUE_APP_BASE_URL}/v1/topic/list/instructor/${insId}`;
		const url = baseUrl + `?courseId=${courseId}&page=${page}&classLevel=${classLevel}&quarterId=${quarterId}&size=${size}&classId=${classId}&sort=startDate,desc`;
		return this.sendGetRequest(url);
	}

	getInstructorTopicInterface(instrId, courseId, quarterId='', classId='', classLevel='',) {
        const baseUrl = `${process.env.VUE_APP_BASE_URL}/v1/topic/list-interface/instructor/${instrId}`;
        const url = baseUrl + `?courseId=${courseId}&quarterId=${quarterId}&classId=${classId}&classLevel=${classLevel}`;
        return this.sendGetRequest(url);
    }

    importData(body) {
        const url = `${process.env.VUE_APP_BASE_URL}/v1/topic/import`;
        return this.sendPostRequest(url, body);
    }
}
