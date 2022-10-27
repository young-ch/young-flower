import axios from 'axios';
import {clarify} from "@/utils/clear"

class HistoryStoryApi {
  constructor() {
    this.endpoint = process.env.VUE_APP_GW_URL;
  }

  treelist() {


    return axios.get(`${this.endpoint}/history/categories/TreeHistory`).then(response=>response.data);
  }


  changeOrder(historyId, body){
  
    
    // return axios.delete(`${this.endpoint}/region/${idx}?userId=${userId}`, {}).then((response) => response.data);

  return axios.put(`${this.endpoint}/diary/${historyId}/enquete/index/orders`, body).then((response) => {response.data
  
    
    return response.data;
  });
}

  // reaction(id, boardId){
  //   return axios.post(`${this.endpoint}/boards/${boardId}/articles/${id}/reaction`, {}).then(response => response);
  // }

}


export default new HistoryStoryApi();
