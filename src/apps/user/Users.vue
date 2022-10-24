<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">{{ this.pageName }} 관리</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="$router.push({path:'/users/form'})" v-if="this.$route.params.searchState !== 'STATE_WITHDRAW'">
        <v-icon left>mdi mdi-playlist-plus</v-icon>
        {{ pageName }} 추가
      </v-btn>
    </div>

    <v-card>
      <!-- users list -->
      <v-row dense class="pa-2 align-center">

        <v-col cols="6">
        </v-col>

        <v-col cols="6" class="d-flex text-right align-center">
          <v-text-field
            v-model="searchKeyword"
            append-icon="mdi-magnify"
            class="flex-grow-1 mr-md-2"
            hide-details
            dense
            clearable
            single-line
            label="검색"
            @click:append="getUsers"
            @keyup.enter="getUsers"
          ></v-text-field>
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
        :items="users"
        class="flex-grow-1"
        :server-items-length="totalItems"
        :options.sync="options"
        item-key="id"
        :footer-props="{showFirstLastPage: true, 'items-per-page-options' : [5,10,20,50,100], showCurrentPage:true}"
        disable-sort
        :loading="loading"
      >
        <!--        <template v-slot:item.userId="{ item }">-->
        <!--          <div class="font-weight-bold"># <copy-label :text="item.userId + ''" /></div>-->
        <!--        </template>-->
        <template v-slot:item.no="{ index }">
          {{totalItems - ((options.page-1) * (options.itemsPerPage === -1 ? 0 : options.itemsPerPage)) - index}}
        </template>

        <template v-slot:item.systemId="{ value }">
          <div>
            {{ systemName(value) }}
          </div>
        </template>

        <template v-slot:item.loginId="{ item }">
          <div>
            <router-link :to="{path:`/users/${item.id}/form`}">{{item.loginId}}</router-link>
          </div>
        </template>

        <template v-slot:item.mobileNo="{ value }">
          <div class="d-flex align-center py-1">
            <div class="ml-1 caption font-weight-bold">
              <copy-label :text="value" />
            </div>
          </div>
        </template>

        <template v-slot:item.email="{ item }">
          <div class="d-flex align-center py-1">
            <!--            <v-avatar size="32" class="elevation-1 grey lighten-3">-->
            <!--              <v-img :src="item.avatar" />-->
            <!--            </v-avatar>-->
            <div class="ml-1 caption font-weight-bold">
<!--              <router-link :to="{path:`/users/detail/${item.id}`}">{{item.email}}</router-link>-->
                  <copy-label :text="item.email" />
            </div>
          </div>
        </template>

        <!--        <template v-slot:item.verified="{ item }">-->
        <!--          <v-icon v-if="item.verified" small color="success">-->
        <!--            mdi-check-circle-->
        <!--          </v-icon>-->
        <!--          <v-icon v-else small>-->
        <!--            mdi-circle-outline-->
        <!--          </v-icon>-->
        <!--        </template>-->

        <!--        <template v-slot:item.disabled="{ item }">-->
        <!--          <div>{{ item.disabled.toString() | capitalize }}</div>-->
        <!--        </template>-->

        <!--        <template v-slot:item.role="{ item }">-->
        <!--          <v-chip-->
        <!--            label-->
        <!--            small-->
        <!--            class="font-weight-bold"-->
        <!--            :color="item.role === 'ADMIN' ? 'primary' : undefined"-->
        <!--          >{{ item.role | capitalize }}</v-chip>-->
        <!--        </template>-->

        <template v-slot:item.createdAt="{ value }">
          <div>{{ value | formatDate('YYYY-MM-DD') }}</div>
        </template>
        <template v-slot:item.loginAt="{ value }">
          <div>{{ value | formatDate('YYYY-MM-DD HH:mm:ss') }}</div>
        </template>

        <template v-slot:item.state="{ value }">
          <div>{{ stateName(value) }}</div>
        </template>

               <!-- <template v-slot:item.lastSignIn="{ item }">
                 <div>{{ item.lastSignIn | formatDate('lll') }}</div>
               </template>

               <template v-slot:item.action="{ }">
                 <div class="actions">
                   <v-btn icon to="/users/edit">
                     <v-icon>mdi-open-in-new</v-icon>
                   </v-btn>
                 </div>
               </template> -->
        <!--        -->
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
      <v-btn color="primary" @click="$router.push({path:'/users/form'})" v-if="this.$route.params.searchState !== 'STATE_WITHDRAW'">
        <v-icon left>mdi mdi-playlist-plus</v-icon>
        {{ pageName }} 추가
      </v-btn>
    </div>
  </div>
</template>

<script>
// import users from './content/users'

import UserApi from "../../api/UserApi"
import config from "@/configs";
import CopyLabel from '@/components/common/CopyLabel'
import _ from 'lodash'

export default {
  name:'users',
  components: {
    CopyLabel
  },
  // props: ['id'],
  data() {
    return {
      isLoading: false,
      states:config.meta.user.state,
      systems:config.meta.systems,
      breadcrumbs: [{
        text: '회원 관리',
        disabled: false,
        href: '#'
      }, {
        text: '회원 목록'
      }],
      pageName: '회원',
      searchKeyword: '',
      waitingSearch: false,
      loading: true,
      selectedUsers: [],
      headers: [
        { text: 'No.', align: 'left', value: 'no' },
        { text: '아이디', align: 'left', value: 'id' },
        { text: '로그인아이디', value: 'loginId' },
        { text: '이름', align: 'left', value: 'name' },
        // { text: '닉네임', align: 'left', value: 'nickname' },
        { text: '연락처', value: 'mobileNo' },
        { text: 'Email', value: 'email' },
        { text: '생년월일', align: 'left', value: 'birthDate' },
        { text: '가입일', value: 'createdAt' },
        { text: '최근접속일시', value: 'loginAt' },
        { text: '접속수', value: 'loginCount' },
        { text: '상태', value: 'state' },
        { text: '', sortable: false, align: 'right', value: 'action' }
      ],
      options:{},
      totalItems: 0,
      users: [],
      isFirstLoad: true
    }
  },
  watch: {
    options: {
      handler() {
        this.getUsers();
      },
      deep: true,
    },
    searchKeyword: {
      handler(v) {
        if (!this.waitingSearch) {
          setTimeout(() => {
            // this.getUsers();
            if(this.options.searchKeyword !== v)
              this.options.searchKeyword = v

            this.waitingSearch = false
          }, 800); // 0.8 sec delay
        }
        this.waitingSearch = true;
      }
    },
  },
  methods: {
    stateName(v) {
      return this.states.filter(s => s.value === v)?.[0]?.text;
    },
    systemName(v) {
      return this.systems.filter(s => s.value === v)?.[0]?.text;
    },
    reloadSearch() {
      this.searchKeyword = ''
      this.getUsers()
    },
    getUsers() {

      this.loading = true
      // const states = await UserApi.states();
      const params = {...this.options, ...{size: this.options.itemsPerPage, searchKeyword: this.isFirstLoad ? this.options.searchKeyword : this.searchKeyword, searchRole: this.$route.params.searchRoleId, searchState: this.$route.params.searchState}}
      UserApi.findAllByParam(params).then(data => {
        this.totalItems = data.totalElements;
        this.users = data.content;

        this.users.forEach(u => {
          // u.userStateName = states.filter(s => s.value = u.userState)?.[0]?.label;
        });

        this.$store.commit('setParams', {
          ...params
        })

        if(this.isFirstLoad)
          this.searchKeyword = this.options.searchKeyword
        this.isFirstLoad = false
        this.loading = false
      })
    }
  },
  created() {
    let storedParams = this.$store.getters?.params??{};

    // first load
    if(!storedParams.name || storedParams.name !== this.$options.name) {
      this.options = {
        page:1,
        itemsPerPage:10,
        name:this.$options.name
      }

      storedParams = this.options
      this.$store.commit('setParams', storedParams)

    } else {
      storedParams.name = this.$options.name
      this.options = storedParams
    }

    // this.getUsers(_.cloneDeep(storedParams))

    if(this.$route.params.searchRoleId === '2') {
      this.breadcrumbs[0].text= '관리자 관리'
      this.breadcrumbs[1].text= '관리자 목록'
      this.pageName = '관리자'
    } else if(this.$route.params.searchRoleId === '100') {
      this.breadcrumbs[0].text= '일반 회원 관리'
      this.breadcrumbs[1].text= '일반 회원 목록'
      this.pageName = '일반 회원'
    } else {
      this.breadcrumbs[0].text= '회원 관리'
      this.breadcrumbs[1].text= '회원 목록'
      this.pageName = '회원'
    }

    if(this.$route.params.searchState && this.$route.params.searchState === 'STATE_WITHDRAW') {

      this.breadcrumbs[0].text= '탈퇴 회원 관리'
      this.breadcrumbs[1].text= '탈퇴 회원 목록'
      this.pageName = '탈퇴 회원'
    }
    if(this.$route.params.searchState && this.$route.params.searchState === 'STATE_APPROVAL_REQUEST') {

      this.breadcrumbs[0].text= '신청 회원 관리'
      this.breadcrumbs[1].text= '신청 회원 목록'
      this.pageName = '신청 회원'
    }
    storedParams.pageName = this.pageName

    this.$store.commit('setParams', storedParams)

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
<style lang="scss" scoped>
.v-data-table {
  ::v-deep table {
    th {
      text-transform: none !important;
    }
  }
}
</style>
