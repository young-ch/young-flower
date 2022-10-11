const state = () => {
    return {snackbar: false, message: ''}
}

const actions = {
    alert: ({commit}, message) => {
        commit('SHOW_ALERT', message);
    },
    hide: ({commit}) => {
        commit('HIDE_ALERT');
    }
}
const getters = {
    snackbar: state => state.snackbar,
    message: state => state.message
}

const mutations = {
    SHOW_ALERT: (state, message) => {
        state.snackbar = true;
        state.message = message;
    },
    HIDE_ALERT: (state) => {
      state.snackbar = false;
      state.message ='';
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
