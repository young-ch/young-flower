<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">연혁관리</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="$router.push({path: `/banners/form`})" style="margin-right:1rem">
        <v-icon left>mdi mdi-playlist-plus</v-icon>
        연혁 추가
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
            <v-text-field v-model="treeFilter" label="검색할 메뉴명을 입력해주세요." dense clearable outlined style="padding-top: 10px "/>
           <template>
            <v-list>
              <draggable
              class="draggable"
              :list="list"
              :value="value"
              :options="options"
              group="category"
              >
              <div
              v-for="(category, key) in historycategorylist"
              :key="category ? category.id : key"
              >
                <v-list-item
                class="list__item"
                @click="handleClickCategory(category)"
                >
                  <v-list-item-title class="ist__item__content__title">
                    <span> {{ category ? category.categoryName : null }} </span>
                  </v-list-item-title>

                  <categories-tree-list
                      class="ml-2.py-0"
                      :visible-items="visibleItems"
                      :list="category ? category.childrenList : []"
                      :sortable="sortable"
                      :selected-categories="selectedCategories"
                      :editable="editable"
                      >
                        <draggable
                        class="draggable.pl-2"
                        :list="category.childrenList"
                        :value="category.childrenList"
                        :options="options"
                        group="category"
                        >

                        </draggable>
                      </categories-tree-list>
                </v-list-item>

              </div> 
              </draggable>
            </v-list>
        
           
          </template> 
          </v-card-text>
        </v-card>
      </v-col>

      <v-col md="9">
        <!--banner List-->
        <v-card>
          <v-card-title>
            <v-card-title>연혁 목록</v-card-title>

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
              :headers="headers"
              :items="historylist"
              
              :options.sync="options"
              item-key="id"
              :footer-props="{ showFirstLastPage: false }"
              disable-sort
              :loading="isLoadingTable"
              loading-text="Loading... Please wait"
              calculate-widths
            >
            <template v-slot:body="props"  >
              <draggable
               :value="props.items"
               
                tag="tbody"            
                class="draggable" 
                handle=".handle"
                @change="handleChangeOrders"
              >
                <tr
                  v-for="(item, index) in props.items"
                  :key="index"  

                >
                  <td style="text-align: center"> <v-icon class="fa fa-align-justify handle" small>fas fa-list</v-icon></td>
                  <td>{{ item.historyCategory }}</td>
                  <td style="text-align: center">{{ item.createdAt | formatDate("YYYY-MM-DD") }}</td>
                  <!-- <td>
                    <v-img
                      :src="getImageUrl(item)"
                      width="40"
                    />
                  </td> -->
                  <td>{{ item.content }}</td>
                  <td style="text-align: center">
                    <v-btn style="margin-right:5px" color="primary" type="button" >
                      수정
                    </v-btn>
                    <v-btn color="error" type="button" >
                      삭제
                    </v-btn>           
                  </td>
                  <!-- <td>{{ item.exposureNo }}</td> -->
                </tr>
              </draggable>
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
import HistorycategoryApi from '../../api/HistorycategoryApi';
import HistoriesApi from '../../api/HistoriesApi';
import LiquorTree from 'liquor-tree';
import draggable from "vuedraggable"
import rules from "@/utils/rules";
import _ from "lodash";

export default {
  name: 'banner',
  components:{
    [LiquorTree.name]: LiquorTree,
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
      historylist:[],
      historycategorylist:[],
      headers: [
        { text: '순서변경', align: 'center', value: 'id' },
        {text: '카테고리', value: 'categoryName', align: 'center'},
        {text: '날짜', value: 'createdAt', align: 'center'},
        {text: '내용', value: 'content', align: 'center'},
        {text: '관리', value: '',align: 'center'},
      ],
      categoryHeader: [
        {text: '카테고리 명', value: 'categoryName', align: 'left', sortable: true},
        // {text: '생성일', value: 'createdAt', sortable: false},
        {text: '사용여부', value: 'isActivated', sortable: true},
        {text: '관리', value: 'actions', sortable: false}
      ],
      treeOptions: {
        parentSelect: true,
        // propertyNames: {
        //   states: 'options',
        //   text: "text",
        //   children: "children"
        // },
        dnd:true,
        checkbox: false,
        filter: {
          matcher(query, node) {
            return new RegExp(query, 'i').test(node.data.menuName)
          },
          emptyText: '일치하는 메뉴가 없습니다.',
          plainList: true,
          showChildren: true

        },
      },
      value: {
      type: Array,
      required: false,
      default: null,
      },
      list: {
        type: Array,
        required: false,
        default: null,
      },
      selectedCategories: {
      type: Array,
      required: false,
      default: () => [],
       },
      visibleItems: {
      type: Array,
      required: false,
      default: () => [],
       },
      visibleItemlist:[],
      options: [],
      open: [],
      treeFilter: null,
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
    open:{
      handler() {
        this.search();
      },
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
  computed: {
    items() {
      return this.value || this.list;
    },
  },
  methods: {
    changeOrder(e) {
      const {  page, itemsPerPage } = this.options;
      const newOrder = this.datasets.length - (page-1)*itemsPerPage - e.moved.newIndex;

      BannerApi.order(e.moved.element.id, newOrder).then(() => {
        this.search(this.selectedCategory[0].id);
      });
    },
    async getMenu(node) {

      if(node.states.selected) {

        await node.select(false);
        node.unselect();

        this.treeItem = node;
        this.menu = {'menuCategory' : this.menu?.menuCategory??''}
        this.parent = null;
        this.isModify = false;
  
      } else {
        this.treeItem = node;
        this.parent = _.cloneDeep(this.menu);
        this.isModify = true;
      }
      },
      async moveMenu(sourceNode, destinationNode, pos) {
      let position = new Map();
      position.set('drag-above', 'UP');
      position.set('drag-below', 'DOWN');
      position.set('drag-on', 'IN');

      //wait menuApi.moveMenu(sourceNode.data.id, destinationNode.data.id, position.get(pos));
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
    search() {

      HistoriesApi.list().then(data => {
      this.historylist = data;

      });

      HistorycategoryApi.treelist().then(async data => {

        console.log("-----------tree------------------");
        console.log(data.content);


        this.historycategorylist =  data.content;
        // this.historycategorylist = this.$refs.menuTree.tree.parse(treeArr);
        // this.$refs.menuTree.setModel(this.historycategorylist);
        // this.$refs.menuTree.expandAll();

        // this.historycategorylist = data.content;
        console.log(this.historycategorylist);
        //console.log(this.historycategorylist.content);
     
      });
      

    },
    hasChildren(childrens) {

      console.log("--- hasChildren ---");
      console.log(childrens);
      this.visibleItemlist = [...Object.entries(this.visibleItems)];
      if (!childrens) return false;
      if (!childrens.length) return false;
      return childrens.length > 0;
    },
    handleAddCategory(parent) {

      this.selectedCategory = parent || null;
    },
    handleChangeOrders(){
     
    },

    handleClickCategory(category) {
      
      
      const { id : categoryId } = category;
      let arr = [...Object.entries(this.selectedCategories)];
       //let arr = [...this.selectedCategories]

   
      if (arr.indexOf(categoryId) > -1) arr = arr.filter((i) => i === categoryId);
      else arr.push(categoryId);

    
    },
    handleShowCategory(categoryId) {
      console.log("--- handleShowCategory ---")
      console.log(categoryId);
      console.log(this.visibleItems.indexOf(categoryId));
      
      if (this.visibleItems.indexOf(categoryId) > -1) {
       [...Object.entries(this.visibleItems)].filter((item) => item !== categoryId);
      } else {
        [...Object.entries(this.visibleItems), categoryId];
      }
    },
    updateForm(item) {
      this.$router.push({path:`/banners/${item.id}/form`});
    },

    deleteBanner(item) {
    
    },

    /* 카테고리 */
    saveCategory(value, dialog) {
    
    },

    updateCategory(category, dialog) {
   
    },

    deleteCategory(data) {

    },
    isSelected(categoryId) {
      return this.selectedCategories.indexOf(categoryId) > -1;
    },

  },
  created() {
    
    //this.search();
  },
  async beforeMount(){
    try {
      this.loading = true;
      await Promise.all([
        this.search(),
      ]);
    } catch (e) {
      this.$emit('failed-mount', e);
    } finally {
      this.loading = false;
    }
  },

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
