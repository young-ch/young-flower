import axios from 'axios'
import {clarify} from "@/utils/clear"

class BoardApi {
  constructor() {
    this.endpoint = process.env.VUE_APP_GW_URL
    // this.endpoint = "http://localhost:38086"
    // VUE_APP_BASE_API , VUE_APP_GW_URL
  }

  /* eslint-disable no-unused-vars */
  findAll(body) {
    // let params = new URLSearchParams(body ? clarify(body) : body)
    // return axios.get(`${this.endpoint}/boards`, {params}).then(response => response.data)
    return axios.get(`${this.endpoint}/boards`).then(response => response.data)
  }
  findById(id) {
    return axios.get(`${this.endpoint}/boards/${id}`, {}).then(response => response.data)
  }
  save(body) {
    return axios.post(`${this.endpoint}/boards`, body).then(response => response.data)
  }
  delete(id) {
    return axios.delete(`${this.endpoint}/boards/${id}`).then(response => response.data)
  }

  uploadImage(f) {
    const formData = new FormData();
    formData.append('file', f);
    return axios.post(`${this.endpoint}/boards/board/image/upload`, formData, {headers: {'Content-Type': 'multipart/form-data'}}).then(response => response.data);
  }

  saveCategory(id,content){
    return axios.post(`${this.endpoint}/board/${id}/category/save?categoryCtn=${content}`).then(response => response.data)
  }
  deleteCategory(categoryId) {
    return axios.delete(`${this.endpoint}/board/category/${categoryId}/delete`).then(response => response.data)
  }

  findAssignedPermissionId(id, body) {
    let params = new URLSearchParams(body ? clarify(body) : body)
    return axios.get(`${this.endpoint}/boards/${id}/assigned/permission`, {params}).then(response => response.data)
  }

}


export default new BoardApi()
