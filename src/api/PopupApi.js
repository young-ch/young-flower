import axios from 'axios'
import {clarify} from "@/utils/clear"

class PopupApi {
  constructor() {
    this.endpoint = process.env.VUE_APP_GW_URL;
  }


  list(categoryId) {
    const body = {
      "categoryId": categoryId
    }
    const params = new URLSearchParams(clarify(body));

    return axios.get(`${this.endpoint}/popups`, {params}).then(response => response.data);
  }

  get(popupId) {
    return axios.get(`${this.endpoint}/popups/${popupId}`, {}).then(response => response.data);
  }

  save(popup) {
    return axios.post(`${this.endpoint}/popups`, popup).then(response => response.data);
  }

  delete(popupId) {
    return axios.delete(`${this.endpoint}/popups/${popupId}`, {}).then(response => response.data);
  }

  uploadImage(f) {
    const formData = new FormData();
    formData.append('file', f);
    return axios.post(`${this.endpoint}/popups/popup/image/upload`, formData, {headers: {'Content-Type': 'multipart/form-data'}}).then(response => response.data);
  }

  order(popupId, newOrderNo) {
    return axios.post(`${this.endpoint}/popups/${popupId}/order`, {newOrderNo}).then(response => response.data);
  }

}


export default new PopupApi();
