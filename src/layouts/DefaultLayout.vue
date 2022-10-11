<template>
  <div
    v-shortkey="['ctrl', '/']"
    class="d-flex flex-grow-1"
    @shortkey="onKeyup"
  >
    <!-- Navigation -->
    <v-navigation-drawer
      v-model="drawer"
      app
      floating
      class="elevation-1"
      :right="$vuetify.rtl"
      :light="menuTheme === 'light'"
      :dark="menuTheme === 'dark'"
    >
      <!-- Navigation menu info -->
      <template v-slot:prepend>
        <div class="pa-2">
<!--          <div class="title font-weight-bold text-uppercase primary&#45;&#45;text">{{ product.name }}</div>-->
          <div class="title font-weight-bold primary--text">{{ product.name }}</div>
          <div class="overline grey--text">{{ product.version }}</div>
        </div>
      </template>

      <!-- Navigation menu -->
      <main-menu :menu="navigation.menu" />

      <!-- Navigation menu footer -->
      <template v-slot:append>
        <!-- Footer navigation links -->
        <div class="pa-1 text-center">
          <v-btn
            v-for="(item, index) in navigation.footer"
            :key="index"
            :href="item.href"
            :target="item.target"
            small
            text
          >
            {{ item.key ? $t(item.key) : item.text }}
          </v-btn>
        </div>

      </template>
    </v-navigation-drawer>

    <!-- Toolbar -->
    <v-app-bar
      app
      :color="isToolbarDetached ? 'surface' : undefined"
      :flat="isToolbarDetached"
      :light="toolbarTheme === 'light'"
      :dark="toolbarTheme === 'dark'"
    >
      <v-card class="flex-grow-1 d-flex" :class="[isToolbarDetached ? 'pa-1 mt-3 mx-1' : 'pa-0 ma-0']" :flat="!isToolbarDetached">
        <div class="d-flex flex-grow-1 align-center">

          <!-- search input mobile -->
<!--          <v-text-field-->
<!--            v-if="showSearch"-->
<!--            append-icon="mdi-close"-->
<!--            placeholder="Search"-->
<!--            prepend-inner-icon="mdi-magnify"-->
<!--            hide-details-->
<!--            solo-->
<!--            flat-->
<!--            autofocus-->
<!--            @click:append="showSearch = false"-->
<!--          ></v-text-field>-->

          <div v-if="!showSearch" class="d-flex flex-grow-1 align-center">
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
<!--            <v-switch @click.stop="drawer = !drawer" :label="drawer ? '메뉴 숨김' : '메뉴 열림'" :value="true" :false-value="false" hide-details inset/>-->
            <v-spacer class="d-none d-lg-block"></v-spacer>

            <!-- search input desktop -->
<!--            <v-text-field-->
<!--              ref="search"-->
<!--              class="mx-1 hidden-xs-only"-->
<!--              :placeholder="$t('menu.search')"-->
<!--              prepend-inner-icon="mdi-magnify"-->
<!--              hide-details-->
<!--              filled-->
<!--              rounded-->
<!--              dense-->
<!--            ></v-text-field>-->

            <v-spacer class="d-block d-sm-none"></v-spacer>

            <v-btn class="d-block d-sm-none" icon @click="showSearch = true">
              <v-icon>mdi-magnify</v-icon>
            </v-btn>

<!--            <toolbar-language />-->

            <div class="hidden-xs-only mx-1">
<!--              <toolbar-currency />-->
            </div>

<!--            <toolbar-apps />-->

<!--            <div :class="[$vuetify.rtl ? 'ml-1' : 'mr-1']">-->
<!--              <toolbar-notifications />-->
<!--            </div>-->

            <toolbar-user />
          </div>
        </div>
      </v-card>
    </v-app-bar>

    <v-main>
      <v-container class="fill-height" :fluid="!isContentBoxed">
        <v-layout>
          <slot></slot>
        </v-layout>
      </v-container>

      <v-footer app inset>
        <v-spacer></v-spacer>
        <div class="overline" style="text-transform: none;">
          Copyright ⓒ <!--v-icon small color="pink">mdi-heart</v-icon--> <a class="text-decoration-none" href="http://flower.dangamsoft.com" target="_blank">Dangamsoft</a>
        </div>
      </v-footer>
    </v-main>
  </div>
</template>

<script>
import { mapState } from 'vuex'

// navigation menu configurations
import config from '../configs'

import MainMenu from '../components/navigation/MainMenu'
import ToolbarUser from '../components/toolbar/ToolbarUser'
// import ToolbarApps from '../components/toolbar/ToolbarApps'
// import ToolbarLanguage from '../components/toolbar/ToolbarLanguage'
// import ToolbarCurrency from '../components/toolbar/ToolbarCurrency'
// import ToolbarNotifications from '../components/toolbar/ToolbarNotifications'

// import BoardApi from "@/api/BoardApi"
import MenuApi from "@/api/MenuApi"

export default {
  components: {
    MainMenu,
    ToolbarUser,
    // ToolbarApps,
    // ToolbarLanguage,
    // ToolbarCurrency,
    // ToolbarNotifications
  },
  data() {
    return {
      drawer: null,
      showSearch: false,

      navigation: []
    }
  },
  computed: {
    ...mapState('app', ['product', 'isContentBoxed', 'menuTheme', 'toolbarTheme', 'isToolbarDetached'])
  },
  methods: {
    onKeyup(e) {
      this.$refs.search.focus()
    },
    recursiveGeneratedTree(item, depth) {
      item.data = {
        id : item.id,
        menuName : item.menuName,
        menuIcon : item.menuIcon,
        activated : item.activated,
        protected: item.protected
      };
      item.icon = item.menuIcon
      item.text = item.menuName
      item.link = item.url
      item.depth = depth

      // item.exact = false

      if(item.menuType === 'TYPE_BOARD') {
        item.link = `/boards/${item.boardId}/articles`
      }


      // item.options = {expanded: true, dropable: true, draggable: true};
      item.state = {expanded: true, dropable: true, draggable: true};
      item.childMenus?.forEach(t => this.recursiveGeneratedTree(t, depth+1));
      item.items = item.childMenus
      // if(item.id === 15)
      //   item.value = true

      // console.log(item.items)

      // if(item.link) {
      //   const p = item.link.split("/")[1]
      //   item.regex = new RegExp(`^\\/${p}`, "i")
        // item.regex = /^\/farms/
        // console.log(item.regex)
      // }

    }
  },
  async created() {

    // await BoardApi.findAll().then(data => {
    //   this.navigation = config.navigation
    //   this.navigation.menu.find(m => m.text === 'Apps').items.find(s => s.key && s.key === 'menu.boards.menu').items.find(i => i.key === 'menu.boards.article').items = data.map(b => {
    //     return {
    //       text: b.boardName,
    //       link: `/boards/${b.id}/articles`
    //     }
    //   })
    //
    //   // this.navigation.menu[1].items[4].items[1].items = data.map(b => {
    //   //   return {
    //   //     text: b.boardName,
    //   //     link: `/boards/${b.id}/articles`,
    //   //   }
    //   // })
    //
    //   // this.navigation.menu[1].items[4].items[1].items = [
    //   //   { text: '공지사항', link: '/boards/1/articles',id:14},
    //     // { text: 'FAQ', link: '/531/article/list',id:15 },
    //     // { text: '1:1 문의', link: '/530/article/list',id:16 }
    //   // ]
    //
    // })


    this.navigation = config.navigation
    let adminMenus = await MenuApi.findMenusByCategory('ADMIN')
    // console.log(this.navigation)
    // console.log(adminMenus)
    adminMenus.forEach(t => this.recursiveGeneratedTree(t, 1))
    this.navigation.menu.find(m => m.text === 'Apps').items = adminMenus
  }
}
</script>

<style scoped>
.buy-button {
  box-shadow: 1px 1px 18px #ee44aa;
}
</style>
