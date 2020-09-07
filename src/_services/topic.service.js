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
	
	getByInstructor (insId, courseId, page, quarterId='') {
		const url = `${process.env.VUE_APP_BASE_URL}/v1/topic/list/instructor/${insId}?courseId=${courseId}&page=${page}&quarterId=${quarterId}`;
		return this.sendGetRequest(url);
	}
}