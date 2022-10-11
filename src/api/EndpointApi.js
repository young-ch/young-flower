import axios from 'axios'

import {clarify} from "@/utils/clear"

class EndpointApi {
  constructor() {
    this.endpoint = process.env.VUE_APP_GW_URL
  }

  getEndpoints() {
    return axios.get(`${this.endpoint}/endpoints`).then(result => result.data)
  }

  getPublicEndpoints() {
    return axios.get(`${this.endpoint}/public-endpoints`).then(result => result.data)
  }

  savePublicEndpoint(endpoints) {
    return axios.post(`${this.endpoint}/public-endpoints`, endpoints).then(result => result.data)
  }

  deletePublicEndpoints(endpoints) {
    // let params = new URLSearchParams(endpoints ? clarify(endpoints) : endpoints)
    return axios.put(`${this.endpoint}/public-endpoints`, endpoints).then(result => result)
  }

  changePublicEndpoint(endpoint) {
    return axios.put(`${this.endpoint}/public-endpoint`, endpoint).then(result => result)
  }

}

export default new EndpointApi();
