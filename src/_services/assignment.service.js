import { BaseApiService } from '@/_services/baseApi.service'

export  class AssignmentService extends BaseApiService {
  constructor () {
    super();
  }

  getById (id) {
    const url = `${process.env.VUE_APP_BASE_URL}/v1/assignment/${id}`;
    return this.sendGetRequest(url);
  }

  getByClassAndChronicle(classId, chronicleId) {
      const url = `${process.env.VUE_APP_BASE_URL}/v1/assignment/list/class/${classId}/chronicle/${chronicleId}?size=50`;
      return this.sendGetRequest(url);
  }

  _delete (id) {
    const url = `${process.env.VUE_APP_BASE_URL}/v1/assignment/${id}`;
    return this.sendDeleteRequest(url);
  }

  create(data) {
      const url = `${process.env.VUE_APP_BASE_URL}/v1/assignment/create`;
      const formData = new FormData();
      for (let key in data) {
          formData.append(key, data[key]);
      }
      return this.sendPostRequest(url, formData);
  }

  attachFile(assignmentId, file) {
      const url = `${process.env.VUE_APP_BASE_URL}/v1/assignment/add-file/${assignmentId}`;
      const formData = new FormData();
      formData.append('files', file);
      return this.sendPostRequest(url, formData);
  }

  edit(data) {
      const url = `${process.env.VUE_APP_BASE_URL}/v1/assignment/edit/${data.id}`;
      const formData = new FormData();
      for (let key in data) {
          formData.append(key, data[key]);
      }
      return this.sendPostRequest(url, formData);
  }

  getByInstructor (id) {
    const url = `${process.env.VUE_APP_BASE_URL}/v1/assignment/list/instructor/${id}`;
    return this.sendGetRequest(url)
  }

  getByInstructorCourse (instructorId, courseId) {
    const url = `${process.env.VUE_APP_BASE_URL}/v1/assignment/list/instructor/${instructorId}/course/${courseId}`;
    return this.sendGetRequest(url)
  }

  getByTopic (id) {
    const url = `${process.env.VUE_APP_BASE_URL}/v1/assignment/list/topic/${id}`;
    return this.sendGetRequest(url)
  }
}
