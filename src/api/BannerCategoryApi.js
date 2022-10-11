import axios from 'axios'
import {clarify} from "@/utils/clear"

class BannerCategoryApi {
  constructor() {
    this.endpoint = process.env.VUE_APP_GW_URL;
  }


  findAll(activated) {
    const body = {"activated": activated}
    const params = new URLSearchParams(clarify(body));

    return axios.get(`${this.endpoint}/banner/categories`, {params}).then(response => response.data);
  }

  findById(id) {
    return axios.get(`${this.endpoint}/banner/categories/${id}`, {}).then(response => response.data);
  }

  save(banner) {
    return axios.post(`${this.endpoint}/banner/categories`, banner).then(response => response.data);
  }

  disable(id) {
    return axios.post(`${this.endpoint}/banner/categories/${id}`, {}).then(response => response.data);
  }

  delete(id) {
    return axios.delete(`${this.endpoint}/banner/categories/${id}`, {}).then(response => response.data);
  }

}


export default new BannerCategoryApi();
