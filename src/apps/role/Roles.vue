<template>
  <div class="d-flex flex-column flex-grow-1">

    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">역할 관리</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
      <v-spacer></v-spacer>
      <v-btn color="primary" to="/roles/form" style="margin-right:1rem">
        <v-icon left>mdi mdi-playlist-plus</v-icon>
        역할 추가
      </v-btn>
    </div>

    <v-card>
      <v-card-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="검색"
          dense
          single-line
          hide-details
          clearable
        ></v-text-field>
      </v-card-title>

      <v-data-table
        :search="search"
        :headers="headers"
        :items="roles"
        item-key="id"
        class="elevation-1"
        :sortable="true"
        :footer-props="{showFirstLastPage: true, 'items-per-page-options' : [10,20,50,100,-1], showCurrentPage:true}"
        :options.sync="options"
      >
<!--        @click:row="(item, row) => row.select(!row.isSelected)"-->
<!--        @click:row="updateRole"-->
<!--        style="cursor: pointer"-->

        <template v-slot:item.roleName="{ item }">
          <router-link :to="{path:`/roles/${item.id}`}">{{ item.roleName }}</router-link>
        </template>

        <template v-slot:item.activated="{ item }">
          {{ item.activated ?'사용':'사용안함' }}
        </template>
        <template v-slot:item.manager="{ item }">
          {{ item.manager ? '관리자 역할':'사용자 역할' }}
        </template>
        <template v-slot:item.createdAt="{ value }">
          <div>{{ value | formatDate('YYYY-MM-DD HH:mm:ss') }}</div>
        </template>
        <template v-slot:item.updatedAt="{ value }">
          <div>{{ value | formatDate('YYYY-MM-DD HH:mm:ss') }}</div>
        </template>

        <template v-slot:item.action="{ item }">
          <v-icon
            class="mr-2"
            @click.stop="updateRole(item)"
            small
          >
            mdi-pencil
          </v-icon>
          <v-icon
            class="mr-2"
            @click.stop="deleteRole(item)"
            small
          >
            mdi-delete
          </v-icon>
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
      <v-btn color="primary" to="/roles/form" style="margin-right:1rem">
        <v-icon left>mdi mdi-playlist-plus</v-icon>
        역할 추가
      </v-btn>
    </div>

  </div>
</template>

<script>
import RoleApi from '../../api/RoleApi';

export default {
  name:'roles',
  data() {
    return {
      breadcrumbs: [{
        text: '역할 관리',
        disabled: false,
        href: '#'
      }, {
        text: '역할 목록'
      }],

      search: '',
      headers: [
        {text: '역할 명', value: 'roleName'},
        {text: '사용 여부', value: 'activated'},
        {text: '역할 타입', value: 'manager'},
        // {text: '생성자', value: 'createdBy'},
        {text: '생성일', value: 'createdAt'},
        // {text: '수정자', value: 'updatedBy'},
        {text: '수정일', value: 'updatedAt'},
        {text: '관리', value: 'action', sortable: false }
      ],
      selected: [],
      roles: [],
      totalCount: null,
      dialog: false,
      options: {},
    }
  },
  watch: {
    options: {
      handler() {
        this.$store.commit('setParams', this.options);
      },
      deep: true,
    },
    search: {
      handler(nv) {
        this.options.search = nv;
        this.$store.commit('setParams', this.options);
      }
    }
  },
  methods: {
    getRoles(storedParams) {
      RoleApi.getRoles().then(roles => {
        this.roles = roles
        if(storedParams)
          this.options = storedParams
      })
    },
    updateRole(role) {
      this.$router.push({path : `/roles/${role.id}`})
    },
    deleteRole(role) {
      if(role.id === 1) {
        alert("관리자 역할은 수정하거나 삭제하실 수 없습니다.")
        return false
      }
      if (confirm('삭제하시겠습니까?'))
        RoleApi.deleteRole(role.id).then(() => {
          this.roles = this.roles.filter(r => r !== role)
          alert("삭제되었습니다.")
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
        search:null,
        name:this.$options.name
      }

      storedParams = this.options
      this.$store.commit('setParams', storedParams)

    } else {
      storedParams.name = this.$options.name
      this.options = storedParams
    }
    await this.getRoles(storedParams)
    this.search = this.options.search ? this.options.search : null

  }

};
</script>
