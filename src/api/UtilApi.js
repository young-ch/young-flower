import axios from 'axios';

class UtilApi {
    constructor() {
      this.endpoint = process.env.VUE_APP_GW_URL
      //this.endpoint = `http://localhost:38093`
    }

    geo(address) {
        return axios.get(`${this.endpoint}/util/geo`, {params:{address:address}}).then(response => response.data);
    }


}

export default new UtilApi();
