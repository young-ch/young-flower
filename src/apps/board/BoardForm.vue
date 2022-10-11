<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">{{ breadcrumbs[0].text }}</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
      <v-spacer></v-spacer>
      <v-btn dark color="indigo" @click="save()">
        <v-icon left>mdi mdi-content-save</v-icon>
        저장
      </v-btn>
      <v-btn @click="goList()" style="margin-left:1rem">
        <v-icon left>mdi mdi-format-list-bulleted</v-icon>
        목록
      </v-btn>
    </div>

    <v-card>

      <v-form ref="boardForm">
        <v-container fluid>
          <v-row align="center">
            <v-col cols="2">
              <v-subheader><h3>게시판 형태</h3><b class="essential"> &nbsp;&nbsp;*</b></v-subheader>
            </v-col>
            <v-col>
              <v-radio-group
                v-model="board.boardType"
                row
                :rules="[rules.common.required]"
              >
                <v-radio v-for="(t) in boardTypeItems" :key="t.value" :value="t.value" :label="t.text" hide-details></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col cols="2">
              <v-subheader><h3>게시판 명</h3><b class="essential"> &nbsp;&nbsp;*</b></v-subheader>
            </v-col>
            <v-col cols="10">
              <v-text-field label="게시판 이름을 입력해주세요." v-model="board.boardName" :rules="[rules.common.required]" maxlength="120"/>
            </v-col>
          </v-row>
        </v-container>
        <v-container fluid style="margin-top:-8rem">
          <v-row align="center">
            <v-col cols="2">
              <v-subheader><h3>게시판 상세</h3></v-subheader>
            </v-col>
            <v-col cols="10">
              <editor-component
                ref="boardContents"
                :val="board.boardContents"
                :uploaded="fileMeta"
                @callback-upload="uploadImage"
                label="게시판 내용" />
            </v-col>
          </v-row>
        </v-container>
        <v-container fluid>
          <v-row align="center">
            <v-col cols="2">
              <v-subheader><h3>공지 기능</h3></v-subheader>
            </v-col>
            <v-col cols="10" class="d-flex">
              <v-switch
                v-model="board.hasNotice"
                flat
                color="primary"
                :label="board.hasNotice ? '공지 사용' : '공지 사용안함'"
              ></v-switch>
              <v-switch
                v-if="board.hasNotice"
                style="padding-left: 10px"
                v-model="board.hasPeriod"
                flat
                color="primary"
                :label="board.hasPeriod ? '공지 게시기간 설정 사용' : '공지 게시기간 설정 사용안함'"
              ></v-switch>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col cols="2">
              <v-subheader><h3>댓글 기능</h3></v-subheader>
            </v-col>
            <v-col cols="4" class="d-flex">
              <v-switch
                v-model="board.hasComment"
                flat
                color="primary"
                :label="board.hasComment ? '댓글 사용' : '댓글 사용안함'"
              ></v-switch>
            </v-col>
            <v-col cols="2">
              <v-subheader><h3>첨부 파일 기능</h3></v-subheader>
            </v-col>
            <v-col cols="4" class="d-flex">
              <v-switch
                v-model="board.hasAttachment"
                flat
                color="primary"
                :label="board.hasAttachment ? '파일 첨부 사용' : '파일 첨부 사용안함'"
              ></v-switch>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col cols="6">
              <v-text-field v-model="board.pageSize" label="페이지 게시물 수" maxlength="2" outlined color="white" clearable type="number"  style="margin-left: 1rem"/>
            </v-col>
            <v-col cols="6" class="d-flex">
              <v-text-field v-model="board.newPeriod" label="새글 표시 기간" maxlength="2" outlined color="white" clearable type="number"  style="margin-left: 1rem"/>

            </v-col>
          </v-row>
          <v-row align="center">
            <v-col cols="6" align-self="start">
              <v-subheader><h3>권한 설정</h3><b class="essential"> &nbsp;&nbsp;*</b></v-subheader>

              <v-select :items="roles" item-value="id" item-text="roleName" v-model="permissions.READ"
                        dense clearable flat label="조회 권한" multiple  style="margin-left: 1rem"/>

              <v-select :items="roles" item-value="id" item-text="roleName" v-model="permissions.WRITE"
                        dense clearable flat label="작성 권한" multiple  style="margin-left: 1rem"/>

              <v-select :items="roles" item-value="id" item-text="roleName" v-model="permissions.COMMENT"
                        dense clearable flat label="댓글 권한" multiple  style="margin-left: 1rem"/>

              <v-select :items="roles" item-value="id" item-text="roleName" v-model="permissions.NOTICE"
                        dense clearable flat label="공지 권한 *" :rules="[rules.common.required, rules.common.qtZero]" multiple  style="margin-left: 1rem"/>

              <v-select :items="roles" item-value="id" item-text="roleName" v-model="permissions.ADMIN"
                        dense clearable flat label="관리자 권한 *" :rules="[rules.common.required, rules.common.qtZero]" multiple  style="margin-left: 1rem"/>

            </v-col>
            <v-col cols="6" align-self="start">
              <v-subheader><h3>카테고리 설정</h3></v-subheader>
              <v-row dense class="pa-2 align-center" style="margin-left: 1rem">
                <v-col cols="6">
                </v-col>
                <v-col cols="6" class="text-right">
                  <v-btn color="primary" @click="createCategoryForm"><v-icon left>mdi mdi-playlist-plus</v-icon> 카테고리 추가</v-btn>
                  <v-btn class="vBtn" @click="resetCategory" style="margin-left: 1rem">
                    <v-icon left>mdi mdi-reload</v-icon> 취소
                  </v-btn>
                </v-col>
              </v-row>

              <v-data-table
                id="categoryTable"
                item-key="categoryId"
                :hide-default-footer="true"
                disable-pagination
                :headers="categoryHeader"
                :items="categories"
                class="elevation-1"
                style="margin-left: 1rem"
              >
                <template v-slot:body="props">
                  <draggable
                    :list="categories"
                    @change="log"
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
                        >
                          mdi-arrow-all
                        </v-icon>
                      </td>
                      <!--                    <td> {{ index + 1 }} </td>-->
                      <td> {{ item.categoryName }} </td>
<!--                      <td> {{ item.createdAt ? $moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss') : "" }} </td>-->
                      <td> {{ item.activated ? '사용' : '사용안함' }} </td>
                      <td>
                        <v-icon
                          small
                          @click="updateCategoryForm(item)"
                        >
                          mdi-pencil
                        </v-icon>
                        <v-icon
                          small
                          @click.stop="deleteCategory(index)"
                        >
                          mdi-delete
                        </v-icon>
                      </td>
                    </tr>

                  </draggable>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>
    <div class="d-flex flex-column flex-grow-1">
      <div class="d-flex align-center py-3">
        <v-spacer></v-spacer>
        <v-btn dark color="indigo" @click="save()">
          <v-icon left>mdi mdi-content-save</v-icon>
          저장
        </v-btn>
        <v-btn @click="goList()" style="margin-left:1rem">
          <v-icon left>mdi mdi-format-list-bulleted</v-icon>
          목록
        </v-btn>
      </div>
    </div>
    <category-form
      :visible="formVisible"
      :item="category"
      @callback-canceled="formVisible = false"
      @callback-saved="savedCategory"
    />
  </div>
</template>

<script>

import roleApi from '@/api/RoleApi'
import boardApi from "@/api/BoardApi";

import rules from "@/utils/rules";
import config from "@/configs";

import _ from "lodash";
import EditorComponent from "../../components/editor/EditorComponent";
import draggable from "vuedraggable";

import CategoryForm from "./CategoryForm";

export default {
  components:{
    'editor-component': EditorComponent,
    draggable,
    'category-form': CategoryForm
  },
  props: ['id'],
  data() {
    return {
      breadcrumbs: [
        {
          text: '게시판 관리',
          disabled: false,
          href: '#'
        },
        {
          text: this.$props.id ? '게시판 수정' : '게시판 등록'
        }
      ],
      boardTypeItems: [
        {
          'value': 'TYPE_GENERAL',
          'text': '일반게시판'
        },
        {
          'value': 'TYPE_PHOTO',
          'text': '사진게시판'
        }
        // ,
        // {
        //   'value': 'TYPE_SCHEDULE',
        //   'text': '일정게시판'
        // }
      ],
      board: {
        boardType: 'TYPE_GENERAL',
        mediaName: null,

        boardName: null,
        content: null,
        activated: true,
        hasAttachment: true,
        pageSize: 10,
        newPeriod: 3
      },
      permissions: {
        READ: [],
        WRITE: [],
        COMMENT: [],
        NOTICE: [],
        ADMIN: [],
      },
      permission: {},
      roles: [],
      birth: false,
      gender: 'male',
      daumDialogVisible: false,
      rules,
      confirmPassword: null,
      states: config.meta.user.state,
      // roles:config.meta.user.role,
      categoryHeader: [
        {text: '순서', align: 'left', sortable: false},
        {text: '카테고리 명', value: 'categoryName', align: 'left', sortable: false},
        // {text: '생성일', value: 'createdAt', sortable: false},
        {text: '사용여부', value: 'activated', sortable: false},
        {text: '관리', value: 'actions', sortable: false}
      ],
      categories: [],
      category: null,
      formVisible: false,
      fileMeta: {}
    }
  },
  methods: {
    uploadImage(f) {
      boardApi.uploadImage(f).then(res => {
        // console.log(res);
        this.fileMeta = res;
      });
    },
    goList() {
      this.$router.push({path: '/boards'})
    },
    async save() {

      if(!await this.$refs.boardForm.validate())
        return;

      // this.board.boardPermissions.push(this.permission_r.map(p => {return {functionType:'r', roleId:p}}))

      this.board.boardPermissions = Object.entries(this.permissions).flatMap(([k, v]) => {
        // console.log(k)
        // console.log(v)
        return v?.map(p => {return {functionType:k, roleId:p}})??[]
      });

      this.board.boardContents = this.$refs.boardContents.getValue();

      this.board.boardCategories = _.cloneDeep(this.categories).reverse().map((c, i) => {
        c.orderNo = i;
        return c;
      });

      boardApi.save(this.board).then(data => {
        if (data) {
          if(this.board.id) {
            alert("수정되었습니다.");
          } else {
            alert("등록되었습니다.");
          }
          this.goList();
        } else {
          alert("Error");
        }
      });
    },
    log: function(e) {
      // window.console.log("Future index: " + e.draggedContext.futureIndex);
      window.console.log(e);
    },
    createCategoryForm() {
      this.formVisible = true;
      this.category = {};
    },
    resetCategory() {
      this.categories = _.cloneDeep(this.board?.boardCategories??[]);
      this.categories.sort((a, b) => {
        return a.orderNo > b.orderNo ? -1 : a.orderNo < b.orderNo ? 1 : 0;
      })
    },
    updateCategoryForm(item) {
      this.formVisible = true;
      this.category = item;
    },
    savedCategory(item) {
      this.formVisible = false;
      if(item.categoryId) {

        this.categories = this.categories.map(c => {
          if(c.categoryId === item.categoryId) {
            // item.orderNo = i;
            return item;
          } else {
            // c.orderNo = i;
            return c;
          }
        });
      } else {

        if(!this.categories.find(c => c.categoryName === item.originName))
          this.categories.push(item);
        else
          this.categories = this.categories.map(c => {
            if(c.categoryName === item.originName) {
              // item.orderNo = i;
              return item;
            } else {
              // c.orderNo = i;
              return c;
            }
          });

      }

    },
    deleteCategory(index) {
      this.categories = this.categories.filter((c,i) => i !== index);
    }
  },
  created() {
    roleApi.getRoles(true).then(data => {
      this.roles = data;
    });
    if(this.id) {
      boardApi.findById(this.id).then(data => {
        // console.log(data);
        this.board = data;
        this.board.boardPermissions.forEach(p => {
          this.permissions[p.id.functionType].push(p.id.roleId);
        });

        this.categories = _.cloneDeep(this.board.boardCategories);
        this.categories.sort((a, b) => {
          return a.orderNo > b.orderNo ? -1 : a.orderNo < b.orderNo ? 1 : 0;
        })
      });
    }
  }
}
</script>
