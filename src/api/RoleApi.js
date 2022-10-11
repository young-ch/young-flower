import axios from 'axios'
import {clarify} from "@/utils/clear";

// import {clarify} from "@/utils/clear"

class RoleApi {
  constructor() {
    this.endpoint = process.env.VUE_APP_GW_URL
  }

  getRoles(activated) {
    const params = {
      activated: activated
    }
    return axios.get(`${this.endpoint}/roles`, {params}).then(result => result.data)
  }

  getRole(id) {
    return axios.get(`${this.endpoint}/roles/${id}`).then(result => result)
  }

  saveRole(roles) {
    return axios.post(`${this.endpoint}/role`, roles).then(result => result.data)
  }

  deleteRole(id) {
    return axios.delete(`${this.endpoint}/roles/${id}`).then(result => result)
  }

}

export default new RoleApi();
