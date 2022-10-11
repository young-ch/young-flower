import axios from 'axios';

class SettingsApi {
    constructor() {
      this.endpoint = process.env.VUE_APP_GW_URL
    }

    get() {
        return axios.get(`${this.endpoint}/settings`).then(response=>response.data);
    }

    save(body) {
        return axios.post(`${this.endpoint}/settings`, body).then(response=>response.data);
    }

  getConfig() {
    return axios.get(`${this.endpoint}/settings/config`).then(response=>response.data);
  }

  saveConfig(body) {
    return axios.post(`${this.endpoint}/settings/config`, body).then(response=>response.data);
  }

}

export default new SettingsApi();
