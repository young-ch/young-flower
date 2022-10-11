import axios from 'axios'
import {clarify} from "@/utils/clear"

class BannerApi {
  constructor() {
    this.endpoint = process.env.VUE_APP_GW_URL;
  }


  list(categoryId) {
    const body = {
      "categoryId": categoryId
    }
    const params = new URLSearchParams(clarify(body));

    return axios.get(`${this.endpoint}/banners`, {params}).then(response => response.data);
  }

  get(bannerId) {
    return axios.get(`${this.endpoint}/banners/${bannerId}`, {}).then(response => response.data);
  }

  save(banner, file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('banner', new Blob([JSON.stringify(banner)], { type: 'application/json' }));

    return axios.post(`${this.endpoint}/banners`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => response.data);
  }

  delete(bannerId) {
    return axios.delete(`${this.endpoint}/banners/${bannerId}`, {}).then(response => response.data);
  }

  uploadImage(f) {
    const formData = new FormData();
    formData.append('file', f);
    return axios.post(`${this.endpoint}/banners/banner/image/upload`, formData, {headers: {'Content-Type': 'multipart/form-data'}}).then(response => response.data);
  }

  order(bannerId, newOrderNo) {
    return axios.post(`${this.endpoint}/banners/${bannerId}/order`, {newOrderNo}).then(response => response.data);
  }

}


export default new BannerApi();
