<template>
  <div>
    <v-card class="my-2">
      <v-card-title>활동 이력</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="historyList"
          :server-items-length="totalItems"
          :options.sync="options"
          item-key="id"
          :footer-props="{showFirstLastPage: true, 'items-per-page-options' : [12,20,50,100,-1], showCurrentPage:true}"
          class="flex-grow-1"
          disable-sort
          show-expand
          single-expand
        >
          <!--        :search="searchKeyword"-->
          <template v-slot:item.no="{ index }">
            <div>{{totalItems - ((options.page-1) * (options.itemsPerPage === -1 ? 0 : options.itemsPerPage)) - index}}</div>
          </template>
          <template v-slot:item.createdAt="{ value }">
            <div>{{ value | formatDate('YYYY-MM-DD HH:mm:ss') }}</div>
          </template>

<!--          <template v-slot:item.actions="{ item }">-->
<!--            <div class="actions">-->
<!--              -->
<!--            </div>-->
<!--          </template>-->

          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
              {{ item.actionDescribed }}
            </td>
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
      </v-card-text>

    </v-card>

    <div class="d-flex align-center">
      <v-spacer></v-spacer>
      <v-btn @click="$router.push(listLink)" style="margin-left:1rem">
        <v-icon left>mdi mdi-format-list-bulleted</v-icon>
        목록</v-btn>
    </div>
  </div>
</template>

<script>
import rules from "@/utils/rules";
import UserApi from "@/api/UserApi";
import config from "@/configs";

export default {
  name:'userHistory',
  props:['id'],
  components: {
  },
  data: () => ({
    isLoading: false,
    headers: [
      {text: '일련 번호', align: 'left', value: 'no'},
      {text: '이력 번호', align: 'left', value: 'id'},
      {text: '수정자 번호', align: 'left', value: 'fromId'},
      {text: '활동 내역', align: 'left', value: 'userAction'},
      {text: '아이피', value: 'ip'},
      {text: '활동 일시', value: 'createdAt'},
      { text: '', value: 'data-table-expand' }
      // {text: '관리', sortable: false, value: 'actions'}
    ],
    options: {},
    param: {
      searchKeyword: null,
      page: 1
    },
    totalItems: 0,
    listLink:'/users',
    rules,
    states:config.meta.user.state,
    systems:config.meta.systems,
    message:{
      error:'',
      errorEmail:'',
      errorSystem:null,
      success:'',
      successEmail:'',
    },
    historyList: [],
  }),
  watch: {
    options: {
      handler () {
        this.getHistory();
      },
      deep: true,
    }
  },
  computed: {
  },
  methods: {
    getHistory(storedParams) {
      const {  page, itemsPerPage, size } = this.options;
      let params = {...this.param, ...{
          page: page,
          size: itemsPerPage ? itemsPerPage : size,
          itemsPerPage
        }};

      UserApi.getUserHistory(this.id, params).then(data => {
        this.historyList = data.content
        this.totalItems = data.totalElements

        this.$store.commit('setParams', params)
      })
    }
  },
  async created() {
    let storedParams = this.$store.getters?.params??{};

    // first load
    if(!storedParams.name || storedParams.name !== this.$options.name) {
      this.options = {
        page:1,
        itemsPerPage:12,
        searchKeyword:null,
        name:this.$options.name
      }

      this.$store.commit('setParams', Object.assign(this.param, {name:this.$options.name}))

    } else {

      this.options = storedParams
      this.param = storedParams

    }

    await this.getHistory();

  }
}
</script>
<style lang="scss">

</style>
