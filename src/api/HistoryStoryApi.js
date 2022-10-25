import axios from 'axios';
import {clarify} from "@/utils/clear"

class HistoryStoryApi {
  constructor() {
    this.endpoint = process.env.VUE_APP_GW_URL;
  }

  list(boardId, articleId, body) {
    //const params = new URLSearchParams(clarify(body));

    return axios.get(`${this.endpoint}/histories`).then(response=>response.data);
  }

  save(article, files) {
    // return axios.post(`${this.endpoint}/board/save`, board).then(response=>response.data);
    const formData = new FormData();
    for (const f of files) {
      formData.append('files', f);
    }
    formData.append('article', new Blob([JSON.stringify(article)], { type: "application/json"}));
    return axios.post(`${this.endpoint}/boards/${article.boardId}/articles`, formData, {headers: {'Content-Type': 'multipart/form-data'}}).then(response=>response.data);
  }

  delete(boardId, id) {
    return axios.delete(`${this.endpoint}/boards/${boardId}/articles/${id}`, {}).then(response=>response.data);
  }

  uploadImage(boardId, f) {
    const formData = new FormData();
    formData.append('file', f);

    // return new Promise(resolve => resolve({ url: 'https://uicdn.toast.com/toastui/img/tui-editor-bi-white.png', desc:null}));
    return axios.post(`${this.endpoint}/boards/${boardId}/article/image/upload`, formData, {headers: {'Content-Type': 'multipart/form-data'}}).then(response => response.data);
  }

  downloadFile(boardId, id, fileId) {

    console.log(boardId);
    console.log(id);
    console.log(fileId);
    // return axios.get(`${this.endpoint}/board/${boardId}/article/${id}/file/${fileId}`, {}).then(response=>response);
    return axios.get(`${this.endpoint}/boards/${boardId}/articles/${id}/files/${fileId}/download`, {responseType: 'arraybuffer'}).then(response=>response);
  }

  // reaction(id, boardId){
  //   return axios.post(`${this.endpoint}/boards/${boardId}/articles/${id}/reaction`, {}).then(response => response);
  // }

}


export default new HistoryStoryApi();
