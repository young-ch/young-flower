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

  save(boardId, articleId, recomment) {

    console.log(recomment);

    //if (recomment.upperCommentId == null) {

      return axios.post(`${this.endpoint}/boards/${boardId}/articles/${articleId}/comments`, recomment).then(response=>response.data);

    // }else{

    //   return axios.post(`${this.endpoint}/boards/${boardId}/articles/${articleId}/comments/${recomment.upperCommentId}`, recomment).then(response=>response.data);
    // }

    
  }

  delete(boardId, articleId, commentId) {
    return axios.delete(`${this.endpoint}/boards/${boardId}/articles/${articleId}/comments/${commentId}`, {}).then(response=>response.data);
  }

  total(boardId, articleId) {
    return axios.get(`${this.endpoint}/boards/${boardId}/articles/${articleId}/totalComment`).then(response=>response.data);
  }

  list(boardId, articleId, body) {
    const params = new URLSearchParams(clarify(body));

    return axios.get(`${this.endpoint}/boards/${boardId}/articles/${articleId}/TreeComment`, {params}).then(response=>response.data);
  }
  
}


export default new CommentApi()
