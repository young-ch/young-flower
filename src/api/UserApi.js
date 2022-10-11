import axios from 'axios'
import {clarify} from "@/utils/clear"

class UserApi {
  constructor() {
    // this.endpoint = "http://localhost:38084"
    this.endpoint = process.env.VUE_APP_GW_URL
  }

  /* eslint-disable no-unused-vars */
  findAllByParam(body) {
    let params = new URLSearchParams(body ? clarify(body) : body)
    return axios.get(`${this.endpoint}/users`, {
      // headers: {'authUserId':1},
      params
    }).then(response => response.data)
  }

  get(userId) {
    return axios.get(`${this.endpoint}/users/${userId}`, {}).then(response => response.data)
  }

  existLoginId(loginId) {
    return axios.get(`${this.endpoint}/users/exists/${loginId}`, {}).then(response => response.data)
  }

  existEmail(email) {
    return axios.get(`${this.endpoint}/users/email/exists/${email}`, {}).then(response => response.data)
  }

  existMobile(mobileNo) {
    return axios.get(`${this.endpoint}/users/mobile/exists/${mobileNo}`, {}).then(response => response.data)
  }

  save(user) {
    return axios.post(`${this.endpoint}/users`, user).then(response => response.data)
  }

  delete(userId) {
    return axios.delete(`${this.endpoint}/users/${userId}`, {}).then(response => response.data)
  }

  join(user) {
    return axios.post(`${this.endpoint}/users/join`, user).then(response => response.data)
  }
  edit(user) {
    return axios.post(`${this.endpoint}/users/edit`, user).then(response => response.data)
  }
  getMyProfile() {
    return axios.get(`${this.endpoint}/users/my/profile`).then(response => response.data)
  }
  findAccount(email, userName) {
    const formData = new FormData();
    formData.append('email', email)
    formData.append('name', userName)
    return axios.post(`${this.endpoint}/users/find/account`, formData).then(response => response.data)
  }

  getUserHistory(userId, body) {
    const params = new URLSearchParams(clarify(body));
    return axios.get(`${this.endpoint}/users/${userId}/history`, {params}).then(response=>response.data);
  }

}


export default new UserApi()
