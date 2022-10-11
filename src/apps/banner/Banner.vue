<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">배너관리</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="$router.push({path: `/banners/form`})" style="margin-right:1rem">
        <v-icon left>mdi mdi-playlist-plus</v-icon>
        배너 추가
      </v-btn>
    </div>

    <v-row>
      <v-col md="3">

        <!-- category list -->
        <v-card>
          <v-card-title>카테고리</v-card-title>
          <v-card-text>
            <v-card-actions class="justify-end">

              <v-dialog
                transition="dialog-top-transition"
                max-width="35rem"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    v-bind="attrs"
                    v-on="on"
                    class="bannerCategoryBtn"
                  ><v-icon left>mdi mdi-plus</v-icon>카테고리 추가</v-btn>
                </template>

                <template v-slot:default="dialog">
                  <v-card>
                    <v-form ref="bannerCategoryCreateForm">
                    <v-toolbar
                      color="black"
                      dark
                    >배너 카테고리 등록</v-toolbar>
                    <v-card-text>
                      <v-text-field label="배너카테고리" v-model="bannerCategory.categoryName" :rules="[rules.common.required]" maxlength="120"/>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                      <v-btn
                        @click="saveCategory(bannerCategory.categoryName, dialog);"
                        color="indigo"
                      ><v-icon left>mdi mdi-content-save</v-icon>추가</v-btn>
                    </v-card-actions>
                    </v-form>
                  </v-card>

                </template>
              </v-dialog>

            </v-card-actions>

            <v-data-table
              id="categoryTable"
              item-key="id"
              single-select
              :hide-default-footer="true"
              disable-pagination
              :headers="categoryHeader"
              :items="bannerCategories"
              class="elevation-1"
              @click:row="(item, row) => {
                row.select(!row.isSelected); search(row.isSelected ? null : item.id)
              }"
              v-model="selectedCategory"
            >

<!--              <template v-slot:item.createdAt="{ value }">-->
<!--                {{ value ? $moment(value).format('YYYY-MM-DD HH:mm:ss') : "" }}-->
<!--              </template>-->
              <template v-slot:item.isActivated="{ value }">
                {{ value ?'사용':'사용안함' }}
              </template>
              <template v-slot:item.actions="{ item }">

                <v-dialog
                  transition="dialog-top-transition"
                  max-width="35rem"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon small>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                  <template v-slot:default="dialog">
                    <v-card>
                      <v-form ref="bannerCategoryUpdateForm">
                      <v-toolbar>
                        배너 카테고리 수정
                      </v-toolbar>
                      <v-card-text>

                        {{ item.categoryName }}

                        <v-text-field
                          v-model="item.categoryName"
                          :rules="[rules.common.required]"
                          maxlength="120"
                        />

                      </v-card-text>
                      <v-card-actions class="justify-end">

                        <v-btn
                          @click="updateCategory(item, dialog);"
                          color="indigo"
                        ><v-icon left>mdi mdi-content-save</v-icon>
                          수정
                        </v-btn>
                      </v-card-actions>
                      </v-form>
                    </v-card>
                  </template>
                </v-dialog>
                <v-btn
                  icon
                  @click.stop="deleteCategory(item)"
                >
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-data-table>

          </v-card-text>
        </v-card>
      </v-col>

      <v-col md="9">
        <!--banner List-->
        <v-card>
          <v-card-title>
            <v-card-title>배너 목록</v-card-title>

            <v-spacer></v-spacer>

            <v-text-field label="검색"
                          append-icon="mdi-magnify"
                          v-model="searchKeyword"
                          class="flex-grow-1 mr-md-2"
                          hide-details
                          dense
                          clearable
                          single-line/>

    <!--      <v-text-field-->
    <!--        v-model="search"-->
    <!--        append-icon="mdi-magnify"-->
    <!--        label="Search"-->
    <!--        single-line-->
    <!--        hide-details-->
    <!--      ></v-text-field>-->

          </v-card-title>
          <v-card-text>
                <v-data-table
                v-model="selected"
                :headers="headers"
                :items="datasets"
                item-key="id"
                :single-select="singleSelect"
                :search="searchKeyword"
                :footer-props="{showFirstLastPage: true, 'items-per-page-options' : [5,10,20,50,100,-1], showCurrentPage:true}"
                :options.sync="options"
                class="elevation-1"
              >
                <template v-slot:body="props">
                  <draggable
                    :list="datasets"
                    :disabled="!selectedCategory || selectedCategory.length === 0"
                    @change="changeOrder"
                    tag="tbody"
                  >
                    <tr
                      v-for="(item, index) in props.items"
                      :key="index"
                    >
                      <td>
                        <v-icon
                          small
                          class="page__grab-icon"
                          @click="changeCheck"
                          v-if="!selectedCategory || selectedCategory.length === 0"
                        >
                          mdi-arrow-all mdi-light mdi-inactive
                        </v-icon>
                        <v-icon
                          small
                          class="page__grab-icon"
                          @click="changeCheck"


                          v-else
                        >
                          mdi-arrow-all
                        </v-icon>
                      </td>

                      <td style="text-align: left !important;">
                        <v-img :src="`${attachmentPath}/${item.bannerImage}`" max-width="120" max-height="80"/>
<!--                        <img :src="`${staticPath}/banner/${item.bannerImage}`" style="max-width: 243px; max-height: 100px;"/>-->
                      </td>
                      <td>
                        {{ item.categoryName }}
                      </td>
                      <td>
                        <router-link :to="`/banners/${item.id}/form`">{{ item.title }}</router-link>
                      </td>
                      <td>
                        {{ item.activated ? '노출' : '미노출' }}
                      </td>
                      <td>
                        {{ item.createdAt | formatDate('YYYY-MM-DD HH:mm:ss') }}
                      </td>
                      <td>
                        <v-icon
                          small
                          class="mr-2"
                          @click.stop="updateForm(item)"
                        >
                          mdi-pencil
                        </v-icon>
                        <v-icon
                          small
                          @click.stop="deleteBanner(item)"
                        >
                          mdi-delete
                        </v-icon>
                      </td>
                    </tr>

                  </draggable>
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

        <div class="d-flex align-center py-3">
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="$router.push({path: `/banners/form`})" style="margin-right:1rem">
            <v-icon left>mdi mdi-playlist-plus</v-icon>
            배너 추가
          </v-btn>
        </div>

      </v-col>
    </v-row>

  </div>
</template>

<script>
import BannerApi from '../../api/BannerApi';
import BannerCategoryApi from '../../api/BannerCategoryApi';
import draggable from "vuedraggable"
import rules from "@/utils/rules";
import _ from "lodash";

export default {
  name: 'banner',
  components:{
    draggable
    },
  data(){
    return{
      breadcrumbs: [
        {
          text: '배너관리',
          disabled: false,
          href: '#'
        },
        {
          text: '배너목록'
        }
      ],
      rules,
      attachmentPath:process.env.VUE_APP_ATTACH_FILE_SERVER_URL,
      searchKeyword:'',
      headers: [
        {text: '순서', sortable: false},
        {text: '이미지', value: 'bannerImage', align: 'left'},
        {text: '분류', value: 'categoryName', align: 'left'},
        {text: '제목', value: 'title', align: 'left'},
        {text: '사용여부', value: 'activated'},
        {text: '등록일', value: 'createdAt'},
        {
          text: '관리',
          value: 'actions',
          sortable: false
        }
      ],
      categoryHeader: [
        {text: '카테고리 명', value: 'categoryName', align: 'left', sortable: true},
        // {text: '생성일', value: 'createdAt', sortable: false},
        {text: '사용여부', value: 'isActivated', sortable: true},
        {text: '관리', value: 'actions', sortable: false}
      ],
      options: {},
      singleSelect: true,
      selected: [],
      datasets:[],
      totalItems:null,
      dialog : false,
      bannerCategory:{
        categoryName:null,
      },
      bannerCategories:[],
      checkCategoryId:-1,
      selectedCategory:[]
    }
  },
  watch: {
    options: {
      handler() {
        this.$store.commit('setParams', this.options);
      },
      deep: true,
    },
    selectedCategory: {
      handler(nv) {
        // console.log(nv)
        this.options.categoryId = nv?.[0]?.id??null;
        this.$store.commit('setParams', this.options);
      }
    },
    searchKeyword: {
      handler(nv) {
        this.options.searchKeyword = nv;
        this.$store.commit('setParams', this.options);
      }
    }
  },
  methods: {
    changeOrder(e) {
      const {  page, itemsPerPage } = this.options;
      const newOrder = this.datasets.length - (page-1)*itemsPerPage - e.moved.newIndex;

      BannerApi.order(e.moved.element.id, newOrder).then(() => {
        this.search(this.selectedCategory[0].id);
      });
    },
    changeCheck() {

      if(!this.selectedCategory || this.selectedCategory.length === 0) {
        alert("배너 순서는 카테고리 선택 후 변경 가능합니다.")
      }
    },
    // onRowClick(value) {
    //   this.$router.push({path:`/banner/${value}`});
    // },
    // getSearchDate(searchDate = []) {
    //   this.param.searchDate = searchDate;
    // },
    // selectItem(months) {
    //   this.activeItem = months;
    //   // 0 is total
    //   if (this.activeItem !== 0) {
    //     this.param.searchDate = [this.$moment().subtract(months, "months").format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')]
    //   } else
    //     this.param.searchDate = [];
    // },
    search(categoryId, storedParams) {

      BannerCategoryApi.findAll().then(result => {
          this.bannerCategories = result;

          BannerApi.list(categoryId).then(data => {
            this.datasets = data.map(b => {
              b.categoryName = this.bannerCategories.find(e => e.id === b.categoryId)?.categoryName??'-'
              return b;
            });

            if(storedParams) {
              this.options = storedParams
              this.searchKeyword = this.options.searchKeyword ? this.options.searchKeyword : null
            }
          });
      });
    },

    updateForm(item) {
      this.$router.push({path:`/banners/${item.id}/form`});
    },

    deleteBanner(item) {
      if(confirm('삭제하시겠습니까?')) {
        BannerApi.delete(item.id).then(() => {
          this.search();
        });
      }
    },

    /* 카테고리 */
    saveCategory(value, dialog) {
      if (!this.$refs.bannerCategoryCreateForm.validate()) {
        return
      }
      this.bannerCategory.categoryName = value;
      BannerCategoryApi.save(this.bannerCategory).then((result) => {
        BannerCategoryApi.findAll().then(result => {
          this.bannerCategories = result;
        });
        this.bannerCategory.categoryName = '';
        this.$refs.bannerCategoryCreateForm.resetValidation()
      });
      dialog.value = false
    },

    updateCategory(category, dialog) {
      if (!this.$refs.bannerCategoryUpdateForm.validate()) {
        return
      }
      BannerCategoryApi.save(category).then(() => {
        this.search();
      });
      dialog.value = false
    },

    deleteCategory(data) {
      if (confirm('삭제 하시겠습니까?')) {
        BannerCategoryApi.delete(data.id).then(() => {
          this.search();
        });
      }
    }

  },
  created() {

    let storedParams = this.$store.getters?.params??{};

    // first load
    if(!storedParams.name || storedParams.name !== this.$options.name) {
      this.options = {
        page:1,
        itemsPerPage:10,
        categoryId:null,
        name:this.$options.name
      }

      storedParams = this.options
      this.$store.commit('setParams', storedParams)

    } else {
      storedParams.name = this.$options.name
      this.options = storedParams
    }

    this.selectedCategory = this.options.categoryId ? [{id:this.options.categoryId}] : []
    this.search(this.options.categoryId, _.cloneDeep(storedParams))

    // console.log(this.$store.state.currentMenu)
    // console.log(this.$store.getters.menu)
  }

};
</script>

<style scoped>
.dbTable td{
  text-align: center;
  font-size: 30px;
}
.bannerButton{
  margin :auto;
  margin-left: 0.3rem !important;
  margin-right: 0.3rem !important;
}
.bannerCategoryBtn{
  margin-left:-1.5rem;
}
</style>
