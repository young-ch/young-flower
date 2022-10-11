import axios from 'axios'
import {clarify} from "@/utils/clear"

class CommentApi {
  constructor() {
    this.endpoint = process.env.VUE_APP_GW_URL
  }


  findAllByArticleId(boardId, articleId, body) {
    const params = new URLSearchParams(clarify(body));
    return axios.get(`${this.endpoint}/boards/${boardId}/articles/${articleId}/comments`, {params}).then(response=>response.data);
  }

  findById(boardId, articleId, commentId) {
    return axios.get(`${this.endpoint}/boards/${boardId}/articles/${articleId}/comments/${commentId}`, {}).then(response=>response.data);
  }

  save(boardId, articleId, comment) {
    return axios.post(`${this.endpoint}/boards/${boardId}/articles/${articleId}/comments`, comment).then(response=>response.data);
  }

  delete(boardId, articleId, commentId) {
    return axios.delete(`${this.endpoint}/boards/${boardId}/articles/${articleId}/comments/${commentId}`, {}).then(response=>response.data);
  }

}


export default new CommentApi()
