<template>
  <v-card>

    <v-row dense class="pa-2 align-center">
      <v-col class="d-flex text-right align-center">
        <date-range-component v-on:event="getSearchDate" label="작성일"
                              :value="param.searchDate"></date-range-component>

        <v-select v-model="param.searchCategory"
                  :items="categoryItems"
                  item-text="categoryName"
                  item-value="id" label="카테고리"
                  dense
                  clearable
                  flat
                  outlined
                  v-on:change="search"
                  v-if="categoryItems"
        />
      </v-col>
      <v-col class="d-flex text-right align-center">
        <v-text-field label="제목 / 내용 / 작성자 검색"
                      v-model="param.searchKeyword" v-on:keyup.enter="search"
                      dense clearable flat outlined/>
      </v-col>
    </v-row>
    <v-data-table
      v-model="selected"
      :headers="headers
                  .filter(h => h.value !== 'boardCategory.categoryName' || (this.board.boardCategories && this.board.boardCategories.length > 0))
                  .filter(h => h.value !== 'actions' || (permission.boardAdmin && h.value === 'actions'))"
      :items="articles"
      :server-items-length="totalItems"
      :options.sync="options"
      item-key="articleId"
      class="elevation-1"
      :footer-props="{showFirstLastPage: true, 'items-per-page-options' : [5,10,20,50,100], showCurrentPage:true}"
      disable-sort
    >
      <template v-slot:item.no="{item}">
        <template v-if="item.notice">
          공지
        </template>
        <template v-else>
          {{item.idx}}
        </template>
      </template>

      <template v-slot:item.title="{value, item}">
        <a @click.stop="onRowClick(item)">
          {{ value }}
        </a>
      </template>

      <template v-slot:item.createdAt="{ value }">
        {{ value | formatDate('YYYY-MM-DD HH:mm:ss') }}
      </template>

      <template v-slot:item.deleted="{ value }">
        {{ value ? '삭제됨' : '' }}
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon
          small
          class="mr-2"
          @click.stop="updateForm(item)"
          v-if="permission.boardAdmin || $route.params.id === item.createdBy"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click.stop="deleteArticle(item)"
          v-if="permission.boardAdmin || $route.params.id === item.createdBy"
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
</template>

<script>
import DateRageComponent from "@/components/date/DateRageComponent";

import boardApi from '@/api/BoardApi'
import articleApi from '@/api/ArticleApi'
import roleApi from '@/api/RoleApi'
import _ from "lodash";

export default {
  name: "Article",
  props: ['board', 'permission'],
  components: {
    'date-range-component': DateRageComponent
  },
  data: () => ({
    monthLists: [
      {value: 1, text: '1개월'}, {value: 3, text: '3개월'}, {value: 6, text: '6개월'},
      {value: 12, text: '1년'}, {value: 0, text: '전체'}],
    activeItem: null,
    selected: [],
    headers: [
      {text: '번호', value: 'no'},
      {text: '제목', value: 'title'},
      {text: '카테고리', value: 'boardCategory.categoryName'},
      {text: '작성자', value: 'writer', align: 'center'},
      {text: '작성일', value: 'createdAt'},
      {text: '조회수', value: 'hits'},
      // {text: '삭제여부', value: 'deleted'},
      {
        text: '관리',
        value: 'actions',
        align: 'center',
        sortable: false
      }
    ],
    param: {
      searchDate:[],
      searchState: null,
      searchRole: null,
      searchKeyword: null,
      page: 1
    },
    articles: [],
    totalItems: 0,
    dialogVisible: false,
    selectArticle: {},
    waitingSearch: false,
    options:{},
    categoryItems: [],
  }),
  watch: {
    options: {
      handler () {
        this.search();
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
            this.search();
            this.waitingSearch = false;
          }, 500); // 0.5 sec delay
        }
        this.waitingSearch = true;
      },
      deep: true
    },
    'param.searchDate': {
      handler(nv, ov) {
        if(nv === ov)
          return;
        this.search();
      },
      deep: true
    }
  },
  methods: {
    onRowClick(item) {
      this.$router.push({path:`/boards/${item.boardId}/articles/${item.id}`});
    },
    getSearchDate(searchDate = []) {
      this.param.searchDate = searchDate;
      // watch param.searchDate
    },
    selectItem(months) {
      this.activeItem = months;
      // 0 is total
      if (this.activeItem !== 0) {
        this.param.searchDate = [this.$moment().subtract(months, "months").format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')]
      } else
        this.param.searchDate = [];
      // this.search(); // watch param.searchDate
    },
    search() {
      const {  page, itemsPerPage, size } = this.options;

      let params = {...this.param, ...{
            page: page,
            size: itemsPerPage ? itemsPerPage : size,
            itemsPerPage
      }};

      if (this.param.searchDate?.length??0 > 0) {
        params.searchStartDate = this.param.searchDate[0];
        params.searchEndDate = this.param.searchDate?.[1]??this.param.searchDate[0];
      } else {
        params.searchStartDate = null;
        params.searchEndDate = null;
      }

      // articleApi.findAll(this.$route.params.id, params).then(data => {
      articleApi.findAll(this.board.id, params).then(data => {
        this.totalItems = data.totalElements;
        this.articles = data.content.map((a, i) => {
          a.idx = this.totalItems - i - (( (params.page??1) - 1) * params.size);
          return a;
        });
        this.$store.commit('setParams', params);
      });
    },
    showCalendar() {
      this.$emit('callback-change-list', 'TYPE_SCHEDULE');
    },
    updateForm(item) {
      this.selectArticle = _.cloneDeep(item);
      this.$router.push({path:`/boards/${item.boardId}/articles/${item.id}/form`});
    },
    deleteArticle(item) {
      if(confirm('삭제하시겠습니까?')) {
        articleApi.delete(item.boardId, item.id).then(() => {
          this.search();
        });
      }
    }
  },
  created: function () {
    // roleApi.getRoles(true).then(data => {
    //   this.boardRoleItems = data;
    // });
    // boardApi.findById(this.$route.params.id).then(data => {

    // boardApi.findById(this.boardId).then(data => {
    //   this.board = data;
    //   this.categoryItems = (data.boardCategories??[]).length > 0 ? data.boardCategories : null;
    // });

    this.categoryItems = (this.board.boardCategories??[]).length > 0 ? this.board.boardCategories : null;

    const storedParams = this.$store.getters?.params??{};
    if(storedParams.name !== this.$options.name)
      this.$store.commit('setParams', Object.assign(this.param, {name:this.$options.name}))
    else {
      this.options = storedParams
      this.param = storedParams
    }

    // console.log(this.$store.state.currentMenu)
    // console.log(this.$store.getters.menu)
    // console.log(this.$store.getters.params)

  }
}
</script>
