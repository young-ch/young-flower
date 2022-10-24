<template>
  <v-card>

    <v-row dense class="pa-2 align-center">
      <v-col cols="5" class="d-flex text-right align-center">
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
        />
      </v-col>
      <v-col cols="7" class="d-flex text-right align-center">
        <v-text-field label="제목 / 내용 / 작성자 검색"
                      v-model="param.searchKeyword" v-on:keyup.enter="search"
                      dense clearable flat outlined/>
      </v-col>
    </v-row>

    <v-row>
          <v-col cols="2"
                 v-for="item in articles" v-bind:key="item.articleId"
                 class="d-flex child-flex">
            <v-card max-width="200" class="mx-auto">
              <v-img
                  :src="item.mainImage.thumbnail ? `${staticattachmentPath}/board/${item.boardId}/${item.mainImage.thumbnail}` : `${testattachmentPath}/board/${item.boardId}/${item.mainImage.fileServerName}`"
                  v-on:error.once="item.mainImage.thumbnail='/photo_default.jpg'"
                  aspect-ratio="1"
                  class="grey lighten-2 white--text align-end"
                  gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                  max-width="200"
              >
                <v-card-text class="pb-0">
                  {{ item.createdAt | formatDate('YYYY-MM-DD HH:mm') }} / {{item.writer}}
                </v-card-text>
              </v-img>

              <v-card-text class="text--primary">
                <div><a @click.stop="onRowClick(item)">{{item.title}}</a></div>
              </v-card-text>

              <v-card-actions>
                  <v-row
                      align="center"
                      justify="end"
                  >
                    <v-icon
                        small
                        class="mr-1"
                        @click.stop="updateForm(item)"
                        style="padding: 0 0 10px 0"
                    >
                      mdi-pencil
                    </v-icon>
                    <v-icon
                        small
                        class="mr-1"
                        @click.stop="deleteArticle(item)"
                        style="padding: 0 10px 10px 0"
                    >
                      mdi-delete
                    </v-icon>
                  </v-row>
              </v-card-actions>

            </v-card>
          </v-col>
        </v-row>

        <v-pagination
            v-model="param.page"
            :length="paginationLength"
            :total-visible="10"
            prev-icon="mdi-menu-left"
            next-icon="mdi-menu-right"
            color="primary"
            light
        ></v-pagination>


  </v-card>
</template>
<script>
import DateRageComponent from "@/components/date/DateRageComponent";

import boardApi from '@/api/BoardApi'
import articleApi from '@/api/ArticleApi'
import roleApi from '@/api/RoleApi'
import _ from "lodash";

export default {
  name: "photo-articles",
  props: ['boardId'],
  components: {
    'date-range-component': DateRageComponent
  },
  data: () => ({
    // endPoint:process.env.VUE_APP_ATTACH_FILE_SERVER_URL,
    endPoint:process.env.VUE_APP_HOME,
    attachmentPath:process.env.VUE_APP_ATTACH_FILE_SERVER_URL,
    staticattachmentPath:process.env.VUE_APP_ATTACH_STATIC_PATH,
    
    monthLists: [
      {value: 1, text: '1개월'}, {value: 3, text: '3개월'}, {value: 6, text: '6개월'},
      {value: 12, text: '1년'}, {value: 0, text: '전체'}],
    activeItem: null,
    selected: [],
    headers: [
      {text: '번호', value: 'no', align: 'left'},
      {text: '제목', value: 'title', align: 'left'},
      {text: '카테고리', value: 'boardCategory.categoryName'},
      {text: '작성자', value: 'writer', align: 'center'},
      {text: '작성일', value: 'createdAt'},
      {text: '조회수', value: 'hits'},
      {text: '삭제여부', value: 'deleted', align: 'left'},
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
      page: 1,
      size: 12
    },
    articles: [],
    totalItems: 0,
    dialogVisible: false,
    selectArticle: {},
    waitingSearch: false,
    board: {},
    options:{},
    paginationLength:1,
    categoryItems: [],
  }),
  watch: {
    'param.page': {
      handler() {
        // console.log(nv);
        this.search();
      }
    },
    'param.searchKeyword': {
      handler(nv) {
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
      handler() {
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
      // const {  page, itemsPerPage, size } = this.options;

      let params = {...this.param };

      if (this.param.searchDate?.length??0 > 0) {
        params.searchStartDate = this.param.searchDate[0];
        params.searchEndDate = this.param.searchDate?.[1]??this.param.searchDate[0];
      } else {
        params.searchStartDate = null;
        params.searchEndDate = null;
      }

      // this.param.page = page;
      // this.param.size = size;

      articleApi.findAll(this.boardId, params).then(data => {
        this.totalItems = data.totalElements;
        this.articles = data.content.map((a, i) => {
          a.idx = this.totalItems - i - (( (params.page??1) - 1) * params.size);
          return a;
        });

        console.log(this.articles );

        this.paginationLength = Math.ceil(this.totalItems/this.param.size);
        this.$store.commit('setParams', params);
      });
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

    this.search();
    roleApi.getRoles(true).then(data => {
      this.boardRoleItems = data;
    });

    boardApi.findById(this.boardId).then(data => {
      this.board = data;
      this.categoryItems = (data.boardCategories??[]).length > 0 ? data.boardCategories : null;

      console.log( this.board);
      
    });

    

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
