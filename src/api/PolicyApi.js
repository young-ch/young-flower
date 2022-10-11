import axios from 'axios';
import {clarify} from "@/utils/clear";

class PolicyApi {
  constructor() {
    this.endpoint = process.env.VUE_APP_GW_URL;
  }

  findPolicies(body) {
    let params = new URLSearchParams(body ? clarify(body) : body)
    return axios.get(`${this.endpoint}/policies`, {params}).then(response => response.data);
  }

  findPolicyById(id) {
    return axios.get(`${this.endpoint}/policies/${id}`, {}).then(response => response.data);
  }

  save(menu) {
    return axios.post(`${this.endpoint}/policies`, menu).then(response => response.data);
  }

  delete(id) {
    return axios.delete(`${this.endpoint}/policies/${id}`, {}).then(response => response.data);
  }

}

export default new PolicyApi();
