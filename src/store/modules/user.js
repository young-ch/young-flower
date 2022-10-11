import {getToken, setToken, removeToken, setRefresh} from '@/utils/auth'
import jwt_decode from 'jwt-decode';
import authApi from '@/api/Auth'

const state = () => {
  const token = getToken();
  try {
    const data = jwt_decode(token);
    return {
      token,
      name: data['name'],
      id: data['id'],
      roles: data.authorities,
      policies: data.policies,
      menus: data['adminMenus'],
      data: data,
      photo: data.photo
      // menus: data.adminMenus
    }
  } catch (e) {
    return {
      token: '',
      name: '',
      id: '',
      roles: [],
      policies: {},
      menus: [],
      data: {},
      photo: ''
    }
  }
}

const actions = {
  login: ({commit, dispatch}, payload) => {
    commit('CLEAR');

    return authApi.login(payload.loginId, payload.loginPw).then((data) => {

      if(!data) {
        throw new Error('일치하는 정보가 없습니다.');
      }
      dispatch('error/hide', {}, {root: true});
      commit('app/resetToast', {}, {root: true});

      const access = jwt_decode(data.access_token);

      // console.log(access)
      // console.log(data)

      commit('SET_TOKEN', data.access_token);
      commit('SET_REFRESH', data.refresh_token);
      commit('SET_NAME', data.name);
      commit('SET_ID', data.id);
      commit('SET_ROLES', access.authorities);
      // commit('SET_ROLES', data.authorities);
      commit('SET_POLICIES', access.policies);
      commit('SET_MENUS', data.adminMenus);
      commit('SET_DATA', data);
      commit('SET_PHOTO', data.photoFile);

      // if(!data.isManager && !access.roles) {
      if(!data.isManager && !access.authorities) {
        throw new Error('접근 권한이 없습니다.');
      }

      // // if (access.authorities && access.authorities.indexOf('관리자')>=0) {
      if (access.authorities.includes("1") || access.adminMenus && access.adminMenus.length > 0) {
        return true;
      } else {
        throw new Error('접근 가능한 관리 메뉴가 없습니다.');
      }

    });
  },
  logout: ({commit}) => {
    commit('CLEAR');
  }
}
const getters = {
  token: state => state?.token,
  name: state => state?.name || '',
  id: state => state?.id || '',
  roles: state => state?.roles,
  menus: state => state?.menus,
  data: state => state?.data,
  photo: state => state?.photo || ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    setToken(token);
  },
  SET_REFRESH: (state, refresh) => {
    setRefresh(refresh);
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_ID: (state, userId) => {
    state.id = userId;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
  SET_POLICIES: (state, roles) => {
    state.policies = roles;
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus;
  },
  SET_DATA: (state, data) => {
    state.data = data;
  },
  SET_PHOTO: (state, photo) => {
    state.photo = photo;
  },
  CLEAR: (state) => {
    state.token = '';
    state.roles = [];
    state.name = '';
    state.id = '';
    state.menus = '';
    state.data = {};
    state.photo = '';
    removeToken();
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
