<template>
  <v-app>
    <!-- Layout component -->
    <component :is="currentLayout" v-if="isRouterLoaded">
      <transition name="fade" mode="out-in">
        <router-view :key="$route.fullPath"/>
      </transition>
    </component>

    <v-snackbar v-model="toast.show" :timeout="toast.timeout" :color="toast.color" bottom v-if="toast.message || (toast.logout && $router.currentRoute.fullPath !== '/auth/signin')">
      {{ toast.message }}
<!--      <v-btn v-if="toast.timeout === 0" color="white" text @click="toast.show = false"></v-btn>-->
      <v-btn v-if="toast.message" dark :text="false" @click="toast.show = false; toast.message = null" style="margin-right:2px">{{ $t('common.close') }}</v-btn>

      <!--      로그인 페이지가 아닐 경우에만 로그인 버튼 출력-->
      <v-btn v-if="toast.logout && $router.currentRoute.fullPath !== '/auth/signin' " dark :text="false" @click="toast.message = null; $router.push('/auth/signin')">로그인</v-btn>
    </v-snackbar>

    <!-- Demo customization menu -->
<!--    <customization-menu />-->
  </v-app>
</template>

<script>
import { mapState } from 'vuex'

import {intercept} from "@/api/interceptor/auth.interceptor";

// Demo Menu
// import CustomizationMenu from './components/demo/CustomizationMenu'

import config from './configs'

// Layouts
import defaultLayout from './layouts/DefaultLayout'
// import landingLayout from './layouts/LandingLayout'
import simpleLayout from './layouts/SimpleLayout'
import authLayout from './layouts/AuthLayout'
import errorLayout from './layouts/ErrorLayout'

/*
|---------------------------------------------------------------------
| Main Application Component
|---------------------------------------------------------------------
|
| In charge of choosing the layout according to the router metadata
|
*/
export default {
  components: {
    // CustomizationMenu,
    defaultLayout,
    // landingLayout,
    simpleLayout,
    authLayout,
    errorLayout
  },
  watch: {
    'toast.show'(nv, ov) {
      if(ov && !nv) {
        this.toast.show = false
        this.toast.message = null
        this.$store.commit('error/HIDE_ALERT')

        if(this.toast.logout) {
          if(this.$router.currentRoute.fullPath !== '/auth/signin') {
            this.$router.push('/auth/signin')
          }
        }

      }
    }
  },
  beforeCreate() {
    if(!(this.$store.getters?.['user/data']?.isManager ??false))
      this.$router.push('/')
  },
  mounted() {

    if(this.toast.logout) {
      this.toast.show = false
      this.toast.message = null
      this.$store.commit('error/HIDE_ALERT')
    }
  },
  computed: {
    ...mapState('app', ['toast']),
    isRouterLoaded: function() {
      return this.$route.name !== null;
    },
    currentLayout: function() {
      const layout = this.$route.meta.layout || 'default'
      return layout + 'Layout'
    }
  },
  head: {
    link: [
      // adds config/icons into the html head tag
      ...config.icons.map((href) => ({ rel: 'stylesheet', href }))
    ]
  },
  created() {
    intercept(this.$store);
  }
}
</script>

<style scoped>
/**
 * Transition animation between pages
 */
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.2s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
