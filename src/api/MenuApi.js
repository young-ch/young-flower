import axios from 'axios';

// import {clarify} from "@/utils/clear";

class MenuApi {
  constructor() {
    this.endpoint = process.env.VUE_APP_GW_URL;
  }

  findMenusByCategory(category) {
    console.log(category);
    // let params = new URLSearchParams(body ? clarify(body) : body)
    return axios.get(`${this.endpoint}/menus?category=${category}`, {}).then(response => response.data);
  }

  findMenuById(menuId) {
    return axios.get(`${this.endpoint}/menus/${menuId}`, {}).then(response => response.data);
  }

  saveMenu(menu) {
    return axios.post(`${this.endpoint}/menus`, menu).then(response => response.data);
  }

  deleteMenu(menuId) {
    return axios.delete(`${this.endpoint}/menus/${menuId}`, {}).then(response => response.data);
  }

  moveMenu(source, destination, position) {
    let param = {
      sourceId: source,
      destinationId: destination,
      position: position
    }

    axios.put(`${this.endpoint}/menus/${source}/move`, param).then(response => response.data);
  }

}

export default new MenuApi();
