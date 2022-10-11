import jwt from 'jwt-decode'
import AuthApi from '@/api/Auth'

const TokenKey = 'X-Token'


export function getToken() {
    return sessionStorage.getItem(TokenKey);
}

export function refreshToken() {

    if (jwt(getRefresh()) !== false) {
        return AuthApi.refresh(getRefresh())
            .then(data => {
                // console.log(data)
                setToken(data.access_token);
                setRefresh(data.refresh_token);
                return data.access_token;
            })
    }
    return '';
}

export function setToken(token) {
    return sessionStorage.setItem(TokenKey, token);
}

export function removeToken() {
    return sessionStorage.removeItem(TokenKey);
}

export function setRefresh(token) {
    return sessionStorage.setItem('refresh_token', token);
}

export function getRefresh() {
    return sessionStorage.getItem('refresh_token');
}
