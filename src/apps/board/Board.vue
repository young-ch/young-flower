<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">{{ breadcrumbs[0].text }}</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="$router.push({path:'/boards/detail'})">
        <v-icon left>mdi mdi-playlist-plus</v-icon>
        게시판 추가
      </v-btn>
    </div>

    <v-card>
      <!-- users list -->
      <v-row dense class="pa-2 align-center">
        <v-col cols="6">
          <!--          <v-menu offset-y left>-->
          <!--            <template v-slot:activator="{ on }">-->
          <!--              <transition name="slide-fade" mode="out-in">-->
          <!--                <v-btn v-show="selectedUsers.length > 0" v-on="on">-->
          <!--                  Actions-->
          <!--                  <v-icon right>mdi-menu-down</v-icon>-->
          <!--                </v-btn>-->
          <!--              </transition>-->
          <!--            </template>-->
          <!--            <v-list dense>-->
          <!--              <v-list-item @click>-->
          <!--                <v-list-item-title>Verify</v-list-item-title>-->
          <!--              </v-list-item>-->
          <!--              <v-list-item @click>-->
          <!--                <v-list-item-title>Disable</v-list-item-title>-->
          <!--              </v-list-item>-->
          <!--              <v-divider></v-divider>-->
          <!--              <v-list-item @click>-->
          <!--                <v-list-item-title>Delete</v-list-item-title>-->
          <!--              </v-list-item>-->
          <!--            </v-list>-->
          <!--          </v-menu>-->
        </v-col>
        <v-col cols="6" class="d-flex text-right align-center">
          <v-text-field
            v-model="searchKeyword"
            append-icon="mdi-magnify"
            class="flex-grow-1 mr-md-2"
            hide-details
            dense
            clearable
            label="검색"
            @click:append="getBoards"
            @keyup.enter="getBoards"
          ></v-text-field>
<!--          :label="$t('menu.boards.search')"-->

<!--          <v-btn-->
<!--            :loading="isLoading"-->
<!--            icon-->
<!--            small-->
<!--            class="ml-2"-->
<!--            @click="reloadSearch"-->
<!--          >-->
<!--            <v-icon>mdi-refresh</v-icon>-->
<!--          </v-btn>-->
        </v-col>
      </v-row>

      <v-data-table
        :headers="headers"
        :items="boards"
        :search="searchKeyword"
        :options.sync="options"
        item-key="id"
        :footer-props="{showFirstLastPage: true, 'items-per-page-options' : [10,20,50,100,-1], showCurrentPage:true}"
        class="flex-grow-1"
      >

        <template v-slot:item.boardType="{value}">
          <template v-for="(t, index) in boardTypeItems">
              <span v-if="t.value === value" :key="index">
                <v-icon>{{ t.icon }}</v-icon>
                {{ t.text }}
              </span>
          </template>
        </template>
        <template v-slot:item.boardName="{ value, item }">
<!--          <div><router-link :to="{path:`/boards/${item.id}/articles`}">{{ value }}</router-link></div>-->
          <div><router-link :to="{path:`/boards/detail/${item.id}`}">{{ value }}</router-link></div>
        </template>
        <template v-slot:item.createdAt="{ value }">
          <div>{{ value | formatDate('YYYY-MM-DD') }}</div>
        </template>
        <template v-slot:item.updatedAt="{ value }">
          <div>{{ value | formatDate('YYYY-MM-DD') }}</div>
        </template>
        <template v-slot:item.detail="{ item }">
          <div class="actions">
            <v-btn icon :to="{path:`/board/detail/${item.id}`}">
              <v-icon>search</v-icon>
            </v-btn>
          </div>
        </template>
        <template v-slot:item.actions="{ item }">
          <div class="actions">
            <v-icon
              small
              class="mr-2"
              @click.stop="updateBoard(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              small
              class="mr-2"
              @click.stop="deleteBoard(item)"
            >
              mdi-delete
            </v-icon>
            <v-icon
              small
              @click.stop="$router.push({path: `/boards/${item.id}/articles`})"
            >
              mdi-menu
            </v-icon>
          </div>
        </template>
        <template #footer.page-text="props">

          <v-combobox
            v-model="options.page"
            :label="`${props.pageStart}-${props.pageStop} of ${props.itemsLength} rows / ${options.page} page / total ${Math.ceil(props.itemsLength / options.itemsPerPage)} pages`"
            :items="Array.from({length: Math.ceil(props.itemsLength / options.itemsPerPage)}, (v, k) => k+1 )"
            :return-object="false"
            hide-details dense
            type="number"
            suffix="page"
          >
          </v-combobox>
        </template>
      </v-data-table>
    </v-card>

    <div class="d-flex align-center py-3">
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="$router.push({path:'/boards/detail'})">
        <v-icon left>mdi mdi-playlist-plus</v-icon>
        게시판 추가
      </v-btn>
    </div>
  </div>
</template>

<script>
// import users from './content/users'

import BoardApi from "@/api/BoardApi"
// import CopyLabel from '../../components/common/CopyLabel'

export default {
  name: 'board',
  components: {
    // CopyLabel
  },
  data() {
    return {
      isLoading: false,
      breadcrumbs: [{
        text: '게시판 관리',
        disabled: false,
        href: '#'
      }, {
        text: '게시판 목록'
      }],
      searchKeyword: '',
      // searchQuery: '',
      waitingSearch: false,
      selectedUsers: [],
      headers: [
        {text: 'Id', align: 'left', value: 'id'},
        {text: '게시판 명', align: 'left', value: 'boardName'},
        {text: '게시판 유형', value: 'boardType'},
        // {text: '생성자', value: 'createdBy'},
        {text: '생성일', value: 'createdAt'},
        // {text: '상세', sortable: false, value: 'detail'},
        // {text: '게시물 목록', sortable: false, value: 'list'},
        {text: '관리', sortable: false, value: 'actions'}
      ],
      boardTypeItems: [
        {
          'value': 'TYPE_GENERAL',
          'text': '일반게시판',
          'icon': 'mdi mdi-clipboard-text-outline'
        },
        {
          'value': 'TYPE_PHOTO',
          'text': '사진게시판',
          'icon': 'mdi mdi-camera'
        },
        {
          'value': 'TYPE_SCHEDULE',
          'text': '일정게시판',
          'icon': 'mdi mdi-calendar'
        }
      ],
      options: {},
      totalItems: 0,
      boards: []
    }
  },
  watch: {
    options: {
      handler() {
        this.$store.commit('setParams', this.options);
      },
      deep: true,
    },
    searchKeyword: {
      handler(nv) {
        this.options.searchKeyword = nv;
        this.$store.commit('setParams', this.options);
      }
    }
  },
  // watch: {
  // options: {
  //   handler() {
  //     this.getBoards();
  //   },
  //   deep: true,
  // },
  // searchQuery: {
  //   handler(nv) {
  //     this.param.searchKeyword = nv;
  //     if (!this.waitingSearch) {
  //       setTimeout(() => {
  //         this.getBoards();
  //         this.waitingSearch = false;
  //       }, 500); // 0.5 sec delay
  //     }
  //     this.waitingSearch = true;
  //   }
  // },
  // },
  methods: {
    reloadSearch() {
      this.param = {}
      this.searchKeyword = ''
      this.getBoards()
    },
    updateBoard(board) {
      this.$router.push({path: `/boards/detail/${board.id}`})
    },
    deleteBoard(board) {
      if (confirm(`${board.boardName} 게시판을 삭제하시겠습니까?`))
        BoardApi.delete(board.id).then(() => {
          alert('삭제되었습니다.')
          this.getBoards()
        })
    },
    getBoards(storedParams) {
      // const {page, itemsPerPage, size} = this.options;
      // let params = {
      //   ...this.param, ...{
      //     page: page,
      //     size: size ? size : itemsPerPage
      //   }
      // };
      BoardApi.findAll().then(data => {
        // console.log(data)
        // this.totalItems = data.totalElements;
        this.boards = data
        if(storedParams)
          this.options = storedParams
      })
    }
  },
  async created() {
    let storedParams = this.$store.getters?.params??{};

    // first load
    if(!storedParams.name || storedParams.name !== this.$options.name) {
      this.options = {
        page:1,
        itemsPerPage:10,
        searchKeyword:null,
        name:this.$options.name
      }

      storedParams = this.options
      this.$store.commit('setParams', storedParams)

    } else {
      storedParams.name = this.$options.name
      this.options = storedParams
    }
    await this.getBoards(storedParams)
    this.searchKeyword = this.options.searchKeyword ? this.options.searchKeyword : null
  }
}
</script>

<style lang="scss" scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
