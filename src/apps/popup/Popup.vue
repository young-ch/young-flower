<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">팝업관리</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="$router.push({path: `/popups/form`})" style="margin-right:1rem">
        <v-icon left>mdi mdi-playlist-plus</v-icon>
        팝업 추가
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
                    class="popupCategoryBtn"
                  ><v-icon left>mdi mdi-plus</v-icon>카테고리 추가</v-btn>
                </template>

                <template v-slot:default="dialog">
                  <v-card>
                    <v-form ref="popupCategoryCreateForm">
                    <v-toolbar
                      color="black"
                      dark
                    >팝업 카테고리 등록</v-toolbar>
                    <v-card-text>
                      <v-text-field label="팝업카테고리" v-model="popupCategory.categoryName" :rules="[rules.common.required]" maxlength="120"/>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                      <v-btn
                        @click="saveCategory(popupCategory.categoryName, dialog);"
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
              :items="popupCategories"
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
                      <v-form ref="popupCategoryUpdateForm">
                      <v-toolbar>
                        팝업 카테고리 수정
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
                          @click="updateCategory(item, dialog)"
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
        <!--popup List-->
        <v-card>
          <v-card-title>
            <v-card-title>팝업 목록</v-card-title>

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
                :footer-props="{showFirstLastPage: true, 'items-per-page-options' : [10,20,50,100,-1], showCurrentPage:true}"
                :options.sync="options"
                class="elevation-1"
              >
                  <template v-slot:item.title="{ value, item }">
                    <div><router-link :to="{path:`/popups/${item.id}/form`}">{{ value }}</router-link></div>
                  </template>
                  <template v-slot:item.activated="{ item }">
                    {{ item.activated ?'사용':'사용안함' }}
                  </template>
                  <template v-slot:item.createdAt="{ value }">
                    <div>{{ value | formatDate('YYYY-MM-DD HH:mm:ss') }}</div>
                  </template>
                  <template v-slot:item.actions="{ item }">
                    <v-icon
                      small
                      class="mr-2"
                      @click.stop="updateForm(item)"
                    >
                      mdi-pencil
                    </v-icon>
                    <v-icon
                      small
                      @click.stop="deletePopup(item)"
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
          </v-card-text>
        </v-card>

        <div class="d-flex align-center py-3">
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="$router.push({path: `/popup/form`})" style="margin-right:1rem">
            <v-icon left>mdi mdi-playlist-plus</v-icon>
            팝업 추가
          </v-btn>
        </div>
      </v-col>
    </v-row>

  </div>
</template>

<script>
import PopupApi from '../../api/PopupApi';
import PopupCategoryApi from '../../api/PopupCategoryApi';
import rules from "@/utils/rules";
import _ from "lodash";

export default {
  name:'popup',
  components:{
  },
  data(){
    return{
      breadcrumbs: [
        {
          text: '팝업관리',
          disabled: false,
          href: '#'
        },
        {
          text: '팝업목록'
        }
      ],
      rules,
      attachmentPath:process.env.VUE_APP_ATTACH_FILE_SERVER_URL,
      searchKeyword:'',
      headers: [
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
        // {text: '사용여부', value: 'isActivated', sortable: true},
        {text: '관리', value: 'actions', sortable: false}
      ],
      options:{},
      singleSelect: true,
      selected: [],
      datasets:[],
      totalItems:null,
      dialog : false,
      popupCategory:{
        categoryName:null,
      },
      popupCategories:[],
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

      PopupApi.order(e.moved.element.id, newOrder).then(() => {
        this.search();
      });
    },
    search(categoryId, storedParams) {

      PopupCategoryApi.findAll().then(result => {
        this.popupCategories = result;

        PopupApi.list(categoryId).then(data => {
          this.datasets = data.map(b => {
            b.categoryName = this.popupCategories.find(e => e.id === b.categoryId)?.categoryName??'-'
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
      this.$router.push({path:`/popups/${item.id}/form`});
    },

    deletePopup(item) {
      if(confirm('삭제하시겠습니까?')) {
        PopupApi.delete(item.id).then(() => {
          this.search();
        });
      }
    },

    /* 카테고리 */
    saveCategory(value, dialog) {
      if (!this.$refs.popupCategoryCreateForm.validate()) {
        return
      }
      this.popupCategory.categoryName = value;
      PopupCategoryApi.save(this.popupCategory).then((result) => {
        PopupCategoryApi.findAll().then(result => {
          this.popupCategories = result;
        });
        this.popupCategory.categoryName = '';
        this.$refs.popupCategoryCreateForm.resetValidation()
      });

      dialog.value = false
    },

    updateCategory(category, dialog) {
      if (!this.$refs.popupCategoryUpdateForm.validate()) {
        return
      }

      PopupCategoryApi.save(category).then(() => {
        this.search();
      });

      dialog.value = false
    },

    deleteCategory(data) {
      if (confirm('삭제 하시겠습니까?')) {
        PopupCategoryApi.delete(data.id).then(() => {
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

  }

};
</script>

<style scoped>
.dbTable td{
  text-align: center;
  font-size: 30px;
}
.popupButton{
  margin :auto;
  margin-left: 0.3rem !important;
  margin-right: 0.3rem !important;
}
.popupCategoryBtn{
  margin-left:-1.5rem;
}
</style>
