const showToast = ({ state, commit }, message) => {
  if (state.toast.show) commit('hideToast')

  setTimeout(() => {
    commit('showToast', {
      color: 'black',
      message,
      timeout: state.toast.timeout,
      logout: false
    })
  })
}

const showError = ({ state, commit }, { message = 'Failed!', error, logout = false }) => {
  if (state.toast.show) commit('hideToast')

  setTimeout(() => {
    commit('showToast', {
      color: 'error',
      message: message + ' ' + (message ?'' :error?.message??''),
      timeout: state.toast.timeout,
      logout
    })
  })
}

const showSuccess = ({ state, commit }, message) => {
  if (state.toast.show) commit('hideToast')

  setTimeout(() => {
    commit('showToast', {
      color: 'success',
      message,
      timeout: state.toast.timeout
    })
  })
}

export default {
  showToast,
  showError,
  showSuccess
}
