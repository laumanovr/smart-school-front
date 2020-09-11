import { BaseApiService } from '@/_services/baseApi.service'

export  class AssignmentService extends BaseApiService {
  constructor () {
    super();
  }
  
  getById (id) {
    const url = `${process.env.VUE_APP_BASE_URL}/v1/assignment/${id}`;
    return this.sendGetRequest(url);
  }
  
  _delete (id) {
    const url = `${process.env.VUE_APP_BASE_URL}/v1/assignment/${id}`;
    return this.sendDeleteRequest(url);
  }
  
  create (data) {
    const url = `${process.env.VUE_APP_BASE_URL}/v1/assignment/create`;
    return this.sendPostRequest(url, data);
  }
  
  edit (data) {
    const url = `${process.env.VUE_APP_BASE_URL}/v1/assignment/edit/${data.id}`;
    return this.sendPostRequest(url, data);
  }
  
  getByInstructor (id) {
    const url = `${process.env.VUE_APP_BASE_URL}/v1/assignment/list/instructor/${id}`
    return this.sendGetRequest(url)
  }
  
  getByInstructorCourse (instructorId, courseId) {
    const url = `${process.env.VUE_APP_BASE_URL}/v1/assignment/list/instructor/${instructorId}/course/${courseId}`
    return this.sendGetRequest(url)
  }
  
  getByTopic (id) {
    const url = `${process.env.VUE_APP_BASE_URL}/v1/assignment/list/topic/${id}`
    return this.sendGetRequest(url)
  }
}
