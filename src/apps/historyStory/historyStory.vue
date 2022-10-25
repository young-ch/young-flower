<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">연혁 관리</div>
      </div>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="$router.push({path: `historystory/form`})" style="margin-right:1rem">
        <v-icon left>mdi mdi-playlist-plus</v-icon>
        팝업 추가
      </v-btn>
    </div>

    <v-row>
      <v-col cols="11">
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
                    <v-btn style="margin-right:5px" color="primary" type="button" v-bind:disabled="item.isDeleted != '' "  @click.stop="updateEnquete(item)">
                      수정
                    </v-btn>
                    <v-btn color="error" type="button" @click="handleDeleteIcon(item)" v-if="item.isDeleted != true" @click.stop="deleteDialog = true; saveEnquete.id = item.id; saveEnquete.name = item.title; ">
                      삭제
                    </v-btn>           
                  </td>
                  <!-- <td>{{ item.exposureNo }}</td> -->
                </tr>
              </draggable>
            </template>
          </v-data-table>      
          </v-col>
    </v-row>

  </div>
</template>

<script>
import PopupApi from '../../api/PopupApi';
import HistoryStoryApi from '../../api/HistoryStoryApi';
import Draggable from 'vuedraggable';
import rules from "@/utils/rules";
import _ from "lodash";

export default {
  name:'popup',
  components:{
    Draggable,
  },
  data(){
    return{
      rules,
      attachmentPath:process.env.VUE_APP_ATTACH_FILE_SERVER_URL,
      searchKeyword:'',
      historylist:[],
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
        this.search();
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
    search() {

        HistoryStoryApi.list().then(data => {

          console.log(data);

          

        //this.totalItems = data.totalElements;
        this.historylist = data;
          // this.datasets = data.map(b => {
          //   // b.categoryName = this.popupCategories.find(e => e.id === b.categoryId)?.categoryName??'-'
          //   // return b;
          // });

          
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
      HistoryStoryApi.save(this.popupCategory).then((result) => {
        HistoryStoryApi.findAll().then(result => {
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

      HistoryStoryApi.save(category).then(() => {
        this.search();
      });

      dialog.value = false
    },

    deleteCategory(data) {
      if (confirm('삭제 하시겠습니까?')) {
        HistoryStoryApi.delete(data.id).then(() => {
          this.search();
        });
      }
    }

  },
  created() {

    console.log("tsdfsdf");
    this.search();

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
