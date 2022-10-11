import axios from 'axios'
import {clarify} from "@/utils/clear"
const SYSTEM_ID = 1;
class FileApi {
  constructor() {
    this.endpoint = process.env.VUE_APP_GW_URL
  }
  deleteOne(systemId, fileId, serviceType) {
    return axios.delete(`${this.endpoint}/files/${systemId}/${serviceType}/delete/single/${fileId}`).then(response => response.data)
  }

  uploadOne(systemId, serviceType, userId, vfileinputFile) {
    console.log("systemId, serviceType, userId, vfileinputFile&&&&&&&", vfileinputFile)
    let frm = new FormData();
    frm.append("userId", userId);
    //for(const f of vfileinputFile){
      frm.append("files",vfileinputFile);
    //}




    return axios.post(`${this.endpoint}/files/${systemId}/${serviceType}/upload`, frm, {
      headers: {
        'Content-Type': 'multipart/form-data',
     //   'Authorization' : 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiZGFuZ2FtIl0sInN5c3RlbUlkIjoxLCJsb2dpbklkIjoibWFuYWdlciIsInVzZXJfbmFtZSI6Im1hbmFnZXIiLCJzY29wZSI6WyJyZWFkIiwid3JpdGUiLCJhZG1pbiJdLCJyb2xlcyI6W3siYXV0aG9yaXR5IjoiUk9MRV9VU0VSIn0seyJhdXRob3JpdHkiOiJST0xFX01BTkFHRVIifV0sIm5hbWUiOiLrsJjrqqjqtIDrpqzsnpAiLCJpZCI6MzcsImV4cCI6MTYyMDM3NjE5MywiYXV0aG9yaXRpZXMiOlsiUk9MRV9NQU5BR0VSIiwiUk9MRV9VU0VSIl0sImp0aSI6IjFmMTVkNGE0LTljMWQtNDk2MC1iNWQ3LWQ2NzAwZWQxNTM5NSIsImNsaWVudF9pZCI6ImRhbmdhbSJ9.TAMvbk2mtN2_kiHuA78YZUfZb7oNOURZPJUQD7qco8o'
      }
    })
  }


  upload(systemId, serviceType, userId, vfileinputFile) {
    let frm = new FormData();
    frm.append("userId", userId);
    for(const f of vfileinputFile){
      frm.append("files",f);
    }

    return axios.post(`${this.endpoint}/files/${systemId}/${serviceType}/upload`, frm, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
  }
  uploadMultiple(files, systemId, serviceType) {

    const formData = new FormData();
    for (const f of files) {
      formData.append('files', f);
    }
    return axios.post(`${this.endpoint}/files/${systemId}/${serviceType}/upload`, formData, {headers: {'Content-Type': 'multipart/form-data'}}).then(response=>response.data);

  }
  delete(systemId, serviceType, fileId) {
    return axios.delete(`${this.endpoint}/files/${systemId}/${serviceType}/delete/single/${fileId}`).then(response => response.data)
  }
  deleteMultiple(systemId, serviceType, fileIds) {
    // const body = new FormData();
    //
    // fileIds.forEach((id) => {
    //   body.append('files', id);
    // });

    return axios.delete(`${this.endpoint}/files/${systemId}/${serviceType}/delete/multiple`, {data: fileIds}).then(response => response.data)
  }
  getThumbNail(systemId,serviceType,primaryId){
    return axios.get(`${this.endpoint}/files/${systemId}/${serviceType}/${primaryId}`).then(response=>response.data)
  }
}


export default new FileApi()

