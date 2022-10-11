import axios from 'axios';
import {clarify} from "@/utils/clear";

class ContentApi {
    constructor() {
        this.endpoint = process.env.VUE_APP_GW_URL;
    }


    findContents(body) {
        const params = body ? new URLSearchParams(clarify(body)) : {};
        return axios.get(`${this.endpoint}/contents`, {params}).then(response=>response.data);
    }

    findContentById(pageId) {
        return axios.get(`${this.endpoint}/contents/${pageId}`, {}).then(response=>response.data);
    }

    save(page) {
        return axios.post(`${this.endpoint}/contents`, page).then(response=>response.data);
    }

    delete(pageId) {
        return axios.delete(`${this.endpoint}/contents/${pageId}`, {}).then(response=>response.data);
    }

    uploadImage(f) {
        const formData = new FormData();
        formData.append('file', f);
        return axios.post(`${this.endpoint}/contents/content/image/upload`, formData, {headers: {'Content-Type': 'multipart/form-data'}}).then(response => response.data);
    }

}


export default new ContentApi();
