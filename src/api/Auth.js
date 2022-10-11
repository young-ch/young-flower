import axios from 'axios';

class AuthApi {
    constructor() {
        this.endpoint =  process.env.VUE_APP_GW_URL;
    }

    login(username, password) {
        const params = new URLSearchParams();
        params.append('grant_type', 'password');
        params.append('client_id', process.env.VUE_APP_CLIENT_ID);
        params.append('client_secret', process.env.VUE_APP_CLIENT_SECRET);
        params.append('username', username);
        params.append('password', password);

        return axios.post(`${this.endpoint}/oauth/token`, params).then(response=>response?.data);
    }


    async refresh(refresh_token) {
        const params = new URLSearchParams();
        params.append('grant_type', 'refresh_token');
        params.append('client_id', process.env.VUE_APP_CLIENT_ID);
        params.append('client_secret', process.env.VUE_APP_CLIENT_SECRET);
        params.append('refresh_token', refresh_token);
        return axios.create().post(`${this.endpoint}/oauth/token`, params).then(response=>response.data);
    }
}

export default new AuthApi();
