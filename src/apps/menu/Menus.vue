<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">메뉴 관리</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
      <v-spacer></v-spacer>
      <v-btn color="red" dark @click="deleteMenu" v-if="isModify" style="margin-right: 1rem">
        <v-icon left>mdi mdi-delete</v-icon>
        삭제
      </v-btn>
      <v-btn @click="resetMenu(menu.id)">
        <v-icon left>mdi-refresh</v-icon>
        리셋
      </v-btn>
      <v-btn color="indigo" @click="savedMenu" style="margin-left: 1rem" dark>
        <v-icon left>mdi mdi-content-save</v-icon>
        저장
      </v-btn>
    </div>

    <v-row>
      <v-col md="3">

        <v-card>
          <v-card-title>메뉴 목록</v-card-title>
          <v-card-text>

            <v-card-actions class="justify-end">
              <v-btn color="primary" @click="createMenuForm">
                <v-icon small>mdi-plus</v-icon>
                메뉴 추가
              </v-btn>
            </v-card-actions>

            <div class="flex-column flex-sm-row">

              <v-tabs>
                <v-tab @click="changeTreeData('HOME')">HOME</v-tab>
                <v-tab @click="changeTreeData('ADMIN')">ADMIN</v-tab>
<!--                <v-tab @click="changeTreeData('MOBILE')">MOBILE</v-tab>-->
              </v-tabs>

              <v-text-field v-model="treeFilter" label="검색할 메뉴명을 입력해주세요." dense clearable outlined style="padding-top: 10px "/>
              <tree
                ref="menuTree"
                :filter="treeFilter"
                :options="treeOptions"
                @node:clicked="getMenu"
                @node:dragging:finish="moveMenu"
              >

                <span slot-scope="{ node }">
    <!--              <template v-if="!node.hasChildren()">-->
                  <!--                <i :class="[node.data.activated ? 'fa fa-check-circle' : 'fa fa-ban']"></i>-->
                  <!--                {{ node.text }}-->
                  <!--              </template>-->

                  <!--              <template v-else>-->
                  <v-btn text>
    <!--                <i :class="[node.data.menuIcon ? node.data.menuIcon : node.data.activated ? 'fa fa-check-circle' : 'fa fa-ban']"></i>-->
                    <v-icon small left>{{ node.data.menuIcon ? node.data.menuIcon : node.data.activated ? 'fa fa-check-circle' : 'fa fa-ban' }}</v-icon>
                    {{ node.text }}
                    <v-icon small right>{{ node.data.protected ? 'mdi mdi-lock' : 'mdi mdi-lock-open-outline' }}</v-icon>
                  </v-btn>

                </span>

              </tree>

              <v-card-actions class="justify-end">
                <v-btn color="primary" @click="createMenuForm">
                  <v-icon small>mdi-plus</v-icon>
                  메뉴 추가
                </v-btn>
              </v-card-actions>

            </div>
          </v-card-text>
        </v-card>

      </v-col>

      <v-col md="9">
        <v-card>
          <v-card-title>{{ isModify ? '메뉴 수정' : '메뉴 추가'}}</v-card-title>
          <!-- names -->
          <v-form ref="menuForm">
<!--            <div class="d-flex">-->

            <div class="d-flex">
              <v-col sm="4">

                <v-row v-if="!isModify && parent && Object.keys(parent).length > 0">
                  <v-col>
                    상위 메뉴
                    <div style="padding-left: 22px">
                      {{ parent.menuName }}
                    </div>
                  </v-col>
                </v-row>

                <vue-dropzone
                  v-if="!menu.menuCategory || menu.menuCategory === 'HOME' "
                  ref="menuImageDropzone"
                  id="dropzone"
                  :style="'background-color: #ffffff !important;'"
                  :options="dropzoneOptions"
                  :useCustomSlot="true"
                  @vdropzone-success="dropzoneUploadSuccess"
                  @vdropzone-complete="dropzoneUploadCompleteSuccess"
                  @vdropzone-removed-file="dropzoneRemove"
                  @vdropzone-processing="dropzoneProcessing"
                >
                  <div v-if="menu.menuImage" style="margin-top: -40px; max-height: 197px">
                    <v-badge
                      bordered
                      dark
                      color="black"
                      icon="mdi-delete"
                      overlap
                      @click.native="dropzoneRemove"
                    >
                      <v-img :src="`${attachmentPath}/menu/${menu.menuImage}`" max-width="200" max-height="150"/>
                    </v-badge>
                  </div>
                  <div v-else class="dropzone-custom-content">
                    <h3 class="dropzone-custom-title">메뉴 이미지</h3>
                    <div class="subtitle">Drag and drop or click to select a file from your computer</div>
                  </div>
                </vue-dropzone>

                <v-row v-if="menu.menuCategory === 'ADMIN' ">
                  <v-col>
<!--                    메뉴 icon css-->
                    <v-text-field v-model="menu.menuIcon" label="메뉴 icon"
                                  dense clearable required
                                  maxlength="100">
                      <v-icon
                        slot="prepend"

                      >{{menu.menuIcon}}</v-icon>
                    </v-text-field>
                  </v-col>
                </v-row>

              </v-col>

              <v-col sm="8">
                <v-row>
                  <v-col>
                    메뉴 명
                    <div style="padding-left: 22px">
                        <v-text-field v-model="menu.menuName" label="메뉴 명을 입력해주세요."
                                      dense clearable required outlined
                                      maxlength="100"
                                      :rules="[() => !!menu.menuName || '메뉴 명을 입력해주세요.']"/>
                    </div>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="6">
                    메뉴 사용 여부
                    <div style="padding-left: 22px">
                      <v-switch
                        v-model="menu.activated"
                        flat
                        color="primary"
                        :label="menu.activated ? '메뉴 사용' : '메뉴 사용 안함'"
                      ></v-switch>
                    </div>
                  </v-col>
                  <v-col cols="6">
                    접근 제어
                    <div style="padding-left: 22px">
                      <v-switch
                        v-model="menu.protected"
                        flat
                        color="primary"
                        :label="menu.protected ? '권한 필요' : '공개'"
                      ></v-switch>
                    </div>
                  </v-col>
                </v-row>

              </v-col>
            </div>
<!--            </div>-->

            <div class="d-flex">
              <v-col sm="4">
                메뉴 타입
                <div style="padding-left: 22px;" class="d-flex">
                  <v-checkbox v-model="menu.menuType" value="TYPE_BOARD" label="게시판" style="padding-right: 10px" :rules="[() => !!menu.menuType || '메뉴타입을 선택해주세요.']"></v-checkbox>
                  <v-checkbox v-model="menu.menuType" value="TYPE_PAGE" label="정적페이지" style="padding-right: 10px" :rules="[() => !!menu.menuType || '메뉴타입을 선택해주세요.']"></v-checkbox>
                  <v-checkbox v-model="menu.menuType" value="TYPE_LINK" label="URL" :rules="[() => !!menu.menuType || '메뉴타입을 선택해주세요.']"></v-checkbox>
                  <v-checkbox v-model="menu.menuType" value="TYPE_BLANK" label="빈메뉴" :rules="[() => !!menu.menuType || '메뉴타입을 선택해주세요.']"></v-checkbox>
                </div>

              </v-col>
              <v-col sm="8">
                메뉴 연결
                <div style="padding-left: 22px;" class="d-flex">

                  <v-autocomplete :items="boards"
                                  item-value="id"
                                  item-text="boardName"
                                  label="게시판을 선택해주세요."
                                  dense clearable flat
                                  outlined required
                                  v-model="menu.boardId"
                                  :rules="[rules.common.required]"
                                  v-if="menu.menuType && menu.menuType === 'TYPE_BOARD'"
                  />
                  <v-autocomplete :items="contents" item-value="id" item-text="title"
                                  label="페이지를 선택해주세요."
                                  dense clearable flat
                                  outlined required
                                  v-model="menu.contentId"
                                  :rules="[rules.common.required]"
                                  v-if="menu.menuType && menu.menuType === 'TYPE_PAGE'"
                  />
                  <v-text-field v-model="menu.url" label="URL 을 입력해주세요."
                                dense clearable required outlined
                                maxlength="255"
                                :rules="[() => !!menu.url || 'URL 을 입력해주세요.']"
                                v-if="menu.menuType && menu.menuType === 'TYPE_LINK'"/>

                </div>
              </v-col>
            </div>

<!--            <v-card-actions>-->
<!--              <v-spacer></v-spacer>-->

<!--              <v-btn color="red" @click="deleteMenu" v-if="isModify">-->
<!--                <v-icon left>mdi mdi-delete</v-icon>-->
<!--                삭제-->
<!--              </v-btn>-->
<!--              <v-btn color="indigo" @click="savedMenu">-->
<!--                <v-icon left>mdi mdi-content-save</v-icon>-->
<!--                저장-->
<!--              </v-btn>-->
<!--              <v-btn @click="resetMenu(menu.id)">-->
<!--                <v-icon small>mdi-refresh</v-icon>-->
<!--                취소-->
<!--              </v-btn>-->

<!--            </v-card-actions>-->
          </v-form>

        </v-card>
        <div class="d-flex flex-column flex-grow-1">
          <div class="d-flex align-center py-3">
            <v-spacer></v-spacer>
            <v-btn color="red" dark @click="deleteMenu" v-if="isModify" style="margin-right: 1rem">
              <v-icon left>mdi mdi-delete</v-icon>
              삭제
            </v-btn>
            <v-btn @click="resetMenu(menu.id)">
              <v-icon left>mdi-refresh</v-icon>
              리셋
            </v-btn>
            <v-btn color="indigo" @click="savedMenu" style="margin-left: 1rem" dark>
              <v-icon left>mdi mdi-content-save</v-icon>
              저장
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>

  </div>
</template>

<script>
import rules from "@/utils/rules";
import menuApi from '@/api/MenuApi';

import ContentApi from '@/api/ContentApi';
import BoardApi from '@/api/BoardApi';

import _ from "lodash";
import LiquorTree from 'liquor-tree';
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'

export default {
  components: {
    [LiquorTree.name]: LiquorTree,
    vueDropzone: vue2Dropzone
  },
  data() {
    return {
      menu: {
        menuName: null,
        menuImage: null,
        menuType: "TYPE_LINK",
        url: null,
        activated: null,
        protected: null,
        contentId: null,
        boardId: null
      },
      rows: [],
      treeFilter: null,
      attachmentPath: process.env.VUE_APP_ATTACH_FILE_SERVER_URL,
      searchKeyword: null,
      standaloneIds:[],
      exceptedIds:[],
      searchOpen:[],
      lastOpen: [],
      allOpened: false,
      tab: null,
      rules,
      isLoading: false,
      breadcrumbs: [{
        text: '메뉴 관리',
        disabled: false,
        href: '#'
      }, {
        text: '메뉴 목록'
      }],
      waitingSearch: false,
      message:{
        error:'',
        success:''
      },
      options:{
        size: 10
      },
      param:{},
      totalItems:0,
      datasets: [],
      companionName:{},
      origin:{},

      hasMenus: [],
      menus: [],
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

      parent: {},
      isModify: false,
      treeItem: null,
      searchRoleId:null,

      boards: [],
      contents: []

    }
  },
  computed: {
    dropzoneOptions() {
      return {
        url: `${process.env.VUE_APP_GW_URL}/menus/menu/image/upload`,
        thumbnailHeight: 110,
        thumbnailWidth: 140,
        maxFilesize: 10, // mb
        maxFiles: 2,
        // acceptedFileTypes: "image/*",
        acceptedFiles: "image/*",
        headers: {
          'Authorization': `bearer ${this?.$store?.getters?.["user/token"] ?? ''}`
        },
        uploadMultiple: false,
        clickable: true,
        addRemoveLinks: true
      }
    }
  },
  watch: {
  },
  methods: {
    dropzoneUploadSuccess(uploadedFileInfo, res) {

      const rejectedFiles = this.$refs.menuImageDropzone.getRejectedFiles()
      for (const f of rejectedFiles) {
        this.$refs.menuImageDropzone.removeFile(f);
      }

      const acceptedFiles = this.$refs.menuImageDropzone.getAcceptedFiles();
      for (const f of acceptedFiles) {
        if(f !== uploadedFileInfo)
          this.$refs.menuImageDropzone.removeFile(f);
      }

      this.menu.menuImage = res.saveName

    },
    dropzoneUploadCompleteSuccess(response) {

      if(!response.accepted) {
        const acceptedFiles = this.$refs.menuImageDropzone.getAcceptedFiles()
        const rejectedFiles = this.$refs.menuImageDropzone.getRejectedFiles()
        const allFile = [...acceptedFiles, ...rejectedFiles]
        for (const f of allFile) {
          if(f !== response) {
            this.$refs.menuImageDropzone.removeFile(f); // callback -> imageRemove
          }
        }
      }

      // console.log(this.menu.menuImage);
    },
    dropzoneRemove() {
      this.menu.menuImage = null;
    },
    dropzoneProcessing() {
      this.$refs.menuImageDropzone.setOption('headers', {Authorization: `bearer ${sessionStorage.getItem("X-Token") ?? ''}`})
    },


    uploadedRemove() {
      this.menu.menuImage = null;
    },

    async changeTreeData(menuCategory) {
      this.$refs?.menuForm?.resetValidation();

      this.menu = {
        menuCategory: menuCategory
      }
      this.parent = {}
      this.treeVisible = false;
      this.menus = await this.loadTreeData(menuCategory);
      this.treeVisible = true;

      this.$refs.menuTree.setModel(this.menus)
      // this.$refs.menuTree.expandAll()
      // console.log(this.menus)
    },
    async getMenu(node) {

      this.$refs.menuImageDropzone?.removeAllFiles()

      if(node.states.selected) {

        await node.select(false);
        node.unselect();

        this.treeItem = node;
        this.menu = {'menuCategory' : this.menu?.menuCategory??''}
        this.parent = null;
        this.isModify = false;
        this.$refs.menuForm.resetValidation()
      } else {
        this.treeItem = node;
        this.menu = await menuApi.findMenuById(node.data.id);
        this.parent = _.cloneDeep(this.menu);
        this.isModify = true;
      }
    },
    async createMenuForm() {
      this.menu = {
        menuCategory: this.menu.menuCategory ?? 'HOME'
      }
      this.isModify = false
    },
    async savedMenu() {

      if (!await this.$refs.menuForm.validate())
        return;

      if(!this.menu.parentId && !this.isModify)
        this.menu.parentId = this.parent?.id;

      this.menu.menuCategory = this.menu.menuCategory??'HOME'
      menuApi.saveMenu(this.menu).then(async savedMenu => {
        if(this.flatList(this.$refs.menuTree.findAll().tree.model).map(t => t.data.id).includes(savedMenu.id)) {

          this.treeItem.data.menuName = savedMenu.menuName;
          this.treeItem.data.activated = savedMenu.activated;
          this.treeItem.text = savedMenu.menuName;

        } else {

          let item = {
            text: savedMenu.menuName,
            data: {
              id: savedMenu.id,
              menuName: savedMenu.menuName,
              activated: savedMenu.activated,
              protected: savedMenu.protected,
              text: savedMenu.menuName
            },
            menuName: savedMenu.menuName,
            state: {selected: false}
          };

          if(savedMenu.parentId) {
            this.treeItem.states.expanded = true;
            const parentNode = this.$refs.menuTree.find({
              data: {
                id: savedMenu.parentId
              }
            })[0];

            parentNode.append(item);
            // this.treeItem = this.$refs.menuTree.append(parentNode, item);
          } else {
            // console.log("--------------")
            // console.log(item);
            this.treeItem = await this.$refs.menuTree.append(item);
            // console.log(this.treeItem);
            // await this.changeTreeData(savedMenu.menuCategory);
          }
        }

        this.menu = savedMenu;
        this.menu.childMenus = [];

        this.menu = await menuApi.findMenuById(savedMenu.id);
        this.isModify = true;

        alert("저장되었습니다.")
      });

    },
    deleteMenu() {
      if (this.menu.childMenus?.length ?? 0 !== 0) {
        alert("하위 메뉴가 존재합니다.");
        return false;
      }
      if (confirm("해당 메뉴를 삭제하시겠습니까?")) {
        menuApi.deleteMenu(this.menu.id).then(() => {
          this.$refs.menuForm.resetValidation();

          this.menu = {};
          this.parent = null;
          this.treeItem.remove();
          this.isModify = false;

          alert("삭제되었습니다.")
        });
      }

    },
    async resetMenu(id) {
      if(id) {
        this.menu = await menuApi.findMenuById(id);
        this.parent = _.cloneDeep(this.menu);
        this.isModify = true;
      } else {
        this.menu = {}
        this.parent = null;
        this.isModify = false;
        this.$refs.menuForm.resetValidation()
      }
    },
    async moveMenu(sourceNode, destinationNode, pos) {
      let position = new Map();
      position.set('drag-above', 'UP');
      position.set('drag-below', 'DOWN');
      position.set('drag-on', 'IN');

      await menuApi.moveMenu(sourceNode.data.id, destinationNode.data.id, position.get(pos));
    },
    flatList(items) {
      if(items && items.length > 0) {
        return items.flatMap(i => {

          if(i.children && i.children.length > 0) {
            return [this.flatList(i.children), i].flatMap(i=>i);
          } else {
            return [i]
          }

        });
      } else
        return [];
    },
    async loadTreeData(category) {
      let temp = await menuApi.findMenusByCategory(category);
      temp.forEach(t => this.recursiveGeneratedTree(t, 1));
      return temp;
    },
    recursiveGeneratedTree(item, depth) {
      item.data = {
        id : item.id,
        menuName : item.menuName,
        menuIcon : item.menuIcon,
        activated : item.activated,
        protected: item.protected
      };
      item.text = item.menuName;


      // item.options = {expanded: true, dropable: true, draggable: true};
      item.state = {expanded: true, dropable: true, draggable: true};
      item.childMenus?.forEach(t => this.recursiveGeneratedTree(t, depth+1));
      item.children = item.childMenus


    }
  },
  mounted() {
    this.loadTreeData('HOME').then(async data => {
      this.menus = this.$refs.menuTree.tree.parse(data);
      // this.$set(this.$refs.menuTree, 'model', this.menus);
      this.$refs.menuTree.setModel(this.menus)
      this.$refs.menuTree.expandAll()
    });

    // const adminTree = this.$refs.adminMenuTree.tree

    // this.loadTreeData('ADMIN').then(data => {
    //   this.adminMenus = this.$refs.adminMenuTree.tree.parse(data);
    //   this.$set(this.$refs.adminMenuTree, 'model', this.adminMenus);
    // });

    // this.menus = await this.menus;
  },
  created() {
    ContentApi.findContents().then(data => {
      this.contents = data.content.filter(p => p.activated);
    });
    BoardApi.findAll().then(data => {
      this.boards = data;
    })
  }
}
</script>
<style>
/*.tree-node.selected>.tree-content {*/
/*  background: #314b5f !important;*/
/*}*/
/*.tree-node:not(.selected)>.tree-content:hover {*/
/*  background: none !important;*/
/*}*/
</style>
