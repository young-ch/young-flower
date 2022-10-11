import Vue from 'vue'
import App from './App.vue'

// VUEX - https://vuex.vuejs.org/
import store from './store'

// VUE-ROUTER - https://router.vuejs.org/
import router from './router'

// PLUGINS
import vuetify from './plugins/vuetify'
import i18n from './plugins/vue-i18n'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
import './plugins/vue-google-maps'
import './plugins/vue-shortkey'
import './plugins/vue-head'
import './plugins/vue-gtag'
import './plugins/apexcharts'
import './plugins/echarts'
import './plugins/animate'
import './plugins/clipboard'
import './plugins/moment'
import './plugins/daumpost'

// FILTERS
import './filters/capitalize'
import './filters/lowercase'
import './filters/uppercase'
import './filters/formatCurrency'
import './filters/formatDate'


// STYLES
// Main Theme SCSS
import './assets/scss/theme.scss'

// Animation library - https://animate.style/
import 'animate.css/animate.min.css'

import naver from 'vue-naver-maps';
Vue.use(naver, {
  clientID: process.env.VUE_APP_NAVER_APP_KEY,
  useGovAPI: false, //공공 클라우드 API 사용 (선택)
  subModules:'' // 서브모듈 (선택)
});

// Set this to false to prevent the production tip on Vue startup.
Vue.config.productionTip = false
Vue.use(Viewer)

/*
|---------------------------------------------------------------------
| Main Vue Instance
|---------------------------------------------------------------------
|
| Render the vue application on the <div id="app"></div> in index.html
|
| https://vuejs.org/v2/guide/instance.html
|
*/
export default new Vue({
  i18n,
  vuetify,
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
