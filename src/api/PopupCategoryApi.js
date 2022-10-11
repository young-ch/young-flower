import axios from 'axios'
import {clarify} from "@/utils/clear"

class PopupCategoryApi {
  constructor() {
    this.endpoint = process.env.VUE_APP_GW_URL;
  }


  findAll(activated) {
    const body = {"activated": activated}
    const params = new URLSearchParams(clarify(body));

    return axios.get(`${this.endpoint}/popup/categories`, {params}).then(response => response.data);
  }

  findById(id) {
    return axios.get(`${this.endpoint}/popup/categories/${id}`, {}).then(response => response.data);
  }

  save(popup) {
    return axios.post(`${this.endpoint}/popup/categories`, popup).then(response => response.data);
  }

  disable(id) {
    return axios.post(`${this.endpoint}/popup/categories/${id}`, {}).then(response => response.data);
  }

  delete(id) {
    return axios.delete(`${this.endpoint}/popup/categories/${id}`, {}).then(response => response.data);
  }

}


export default new PopupCategoryApi();
