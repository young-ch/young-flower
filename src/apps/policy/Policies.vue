<template>
  <div class="d-flex flex-column flex-grow-1">

    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">정책 정의 관리</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
      <v-spacer></v-spacer>
      <v-btn color="primary" to="/policy/form" style="margin-right:1rem">
        <v-icon left>mdi mdi-playlist-plus</v-icon>
        정책 정의 추가
      </v-btn>
    </div>

    <v-card>
      <v-card-title>

        <v-spacer></v-spacer>
        <v-text-field
          v-model="param.searchKeyword"
          append-icon="mdi-magnify"
          class="flex-grow-1 mr-md-2"
          label="그룹코드, 코드, 명칭, 설명 검색"
          dense
          single-line
          hide-details
          clearable
          @click:append="getPolicies"
          @keyup.enter="getPolicies"
        ></v-text-field>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="policies"
        :server-items-length="totalItems"
        :options.sync="options"
        item-key="id"
        class="elevation-1"
        :sortable="true"
        :footer-props="{showFirstLastPage: true, 'items-per-page-options' : [10,20,50,100,-1], showCurrentPage:true}"
      >
        <template v-slot:item.policyName="{ item }">
          <router-link :to="{path:`/policies/${item.id}`}">{{ item.policyName }}</router-link>
        </template>

        <template v-slot:item.createdAt="{ value }">
          <div>{{ value | formatDate('YYYY-MM-DD HH:mm:ss') }}</div>
        </template>

        <template v-slot:item.updatedAt="{ value }">
          <div>{{ value | formatDate('YYYY-MM-DD HH:mm:ss') }}</div>
        </template>

        <template v-slot:item.action="{ item }">
<!--          <v-icon-->
<!--            class="mr-2"-->
<!--            @click.stop="updatePolicy(item)"-->
<!--            small-->
<!--          >-->
<!--            mdi-pencil-->
<!--          </v-icon>-->
          <v-icon
            class="mr-2"
            @click.stop="deletePolicy(item)"
            small
          >
            mdi-delete
          </v-icon>
        </template>
        <template #footer.page-text="props">

          <v-combobox
            v-model="options.page"
            :label="`${props.pageStart}-${props.pageStop} of ${props.itemsLength} rows / ${options.page} page / total ${Math.ceil((props.itemsLength > 0 ? props.itemsLength : 1 ) / options.itemsPerPage)} pages`"
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
      <v-btn color="primary" to="/policy/form" style="margin-right:1rem">
        <v-icon left>mdi mdi-playlist-plus</v-icon>
        정책 정의 추가
      </v-btn>
    </div>
  </div>
</template>

<script>
import PolicyApi from '../../api/PolicyApi';

export default {
  name: 'policies',
  data() {
    return {
      breadcrumbs: [{
        text: '정책 정의 관리',
        disabled: false,
        href: '#'
      }, {
        text: '정책 정의 목록'
      }],

      search: '',
      headers: [
        {text: 'No.', value: 'idx'},
        {text: '정책 그룹 코드', value: 'policyGroupCode'},
        {text: '정책 코드', value: 'policyCode'},
        {text: '정책 정의 명', value: 'policyName'},
        {text: '생성자', value: 'createdBy'},
        {text: '생성일', value: 'createdAt'},
        {text: '수정자', value: 'updatedBy'},
        {text: '수정일', value: 'updatedAt'},
        {text: '관리', value: 'action', sortable: false }
      ],
      selected: [],
      policies: [],
      options: {},
      param: {},
      totalItems: 0,
      dialog: false,
      rules: {
      }
    }
  },
  watch: {
    options: {
      handler() {
        // this.$store.commit('setParams', this.options);
      },
      deep: true,
    },
    'param.searchKeyword': {
      handler(nv, ov) {
        if(nv === ov)
          return;

        this.options.page = 1;
        this.param.searchKeyword = nv;
        if (!this.waitingSearch) {
          setTimeout(() => {
            this.getPolicies();
            this.waitingSearch = false;
          }, 500); // 0.5 sec delay
        }
        this.waitingSearch = true;
      },
      deep: true
    }
  },
  methods: {
    getPolicies() {
      const {  page, itemsPerPage, size } = this.options;
      let params = {...this.param, ...{
          page: page,
          size: itemsPerPage ? itemsPerPage : size,
          itemsPerPage
        }};

      PolicyApi.findPolicies(params).then(data => {
        this.totalItems = data.totalElements;
        this.policies = data.content.map((a, i) => {
          a.idx = this.totalItems - i - (((this.options.page ?? 1) - 1) * params.size)
          return a
        });
        this.$store.commit('setParams', params);

      })
    },
    updatePolicy(policy) {
      this.$router.push({path : `/policies/${policy.id}`})
    },
    deletePolicy(policy) {
      if (confirm('삭제하시겠습니까?'))

        PolicyApi.delete(policy.id).then(() => {
          this.policies = this.policies.filter(r => r !== policy)
          alert("삭제되었습니다.")
        })
    }

  },
  created() {
    let storedParams = this.$store.getters?.params??{};

    // first load
    if(!storedParams.name || storedParams.name !== this.$options.name) {
      this.options = {
        page:1,
        itemsPerPage:12,
        searchKeyword:null,
        name:this.$options.name
      }

      storedParams = this.options
      this.$store.commit('setParams', storedParams)

    } else {
      storedParams.name = this.$options.name
      this.options = storedParams
    }
    // await this.getInspections(storedParams)
    this.searchKeyword = this.options.searchKeyword ? this.options.searchKeyword : null

    this.getPolicies();
  }

};
</script>
