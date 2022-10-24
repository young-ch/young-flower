import axios from 'axios';
import {getToken, refreshToken} from '@/utils/auth';
import jwt_decode from 'jwt-decode';
// import {throttle} from 'lodash'
export function intercept($store) {
    // const refresh = throttle((config)=>{
    //     const access_token = getToken();
    //     if (access_token && jwt_decode(access_token).exp > Date.now()/1000) {
    //         return axios.request(config);
    //     } else {
    //         return refreshToken().then(()=> {
    //             return axios.request(config);
    //         })
    //     }
    // }, 1000);

    const refresh = (config)=> {
        const access_token = getToken();

        if (access_token && jwt_decode(access_token).exp > Date.now() / 1000) {
            return axios.request(config);
        } else {
            return refreshToken().then(() => {
                return axios.request(config);
            }).catch(error => {
                if (error.response && error.response.status === 401 && error.response?.data?.error_description?.startsWith('Invalid refresh token (expired)')) {
                    $store.dispatch('app/showError', {message: '로그인 세션이 종료되었습니다. 다시 로그인해주세요.', error:{message: ''}});
                    return Promise.reject(error);
                }
            })
        }
    };
    axios.interceptors.request.use(config => {
        const token =  getToken();
        // console.log(jwt_decode(token));
        // console.log(config);
         config.headers['Authorization'] = `bearer ${token}`;
        // console.log(config)
        return config;
    }, error => {
        return Promise.reject(error);
    });

    axios.interceptors.response.use(response => {
        return response;
    }, error => {


        if (error.response && error.response.status === 401 && error.response?.data?.error_description?.startsWith('Access token expired')) {
            return refresh(error.config);
        }

        const errorCode = error?.response?.data?.errorCode??''
        if(errorCode === 'UNAUTHORIZED' ) {
          $store.commit('user/CLEAR')
          $store.dispatch('app/showError', {message: error.response.data?.errorMessage??'Error!', error:{message: error.response.data?.errorCode}, logout: true});
        } else {

          if (error.message === 'Network Error') {
            $store.dispatch('app/showError', {message: '서버에 문제가 발생했습니다. 관리자에게 문의 바랍니다.', error:{message: ''}});
          } else if (error.response && error.response.status === 401) {
            $store.dispatch('app/showError', {message: error.response.data?.errorMessage, error:{message: error.response?.data?.errorMessage??''}});
            return Promise.reject(error);
          } else if (error.response && error.response.status === 400) {
            $store.dispatch('app/showError', {message: error.response.data.message || error.response.data.error_description, error:{message: ''}});
          } else if (error.response && error.response.status === 599) {
            $store.dispatch('app/showError', {message: error.response.data.message || error.response.data.error_description, error:{message: ''}});
            return Promise.reject(error);
          } else if (error.response && error.response.status === 403) {
            // $store.dispatch('app/showError', {message: error.response.data.message || error.response.data.error_description, error:{message: ''}});
            return Promise.reject(error);
          } else
            return Promise.reject(error);

        }

        // return Promise.reject(error);
    })
}
