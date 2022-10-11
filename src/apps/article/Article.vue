<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">{{this.board.boardName}}</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
      <v-spacer></v-spacer>

      <v-btn color="primary" @click="$router.push({path: 'articles/form'})" v-if="permission.writable">
        <v-icon left>mdi mdi-playlist-plus</v-icon>
        게시물 추가
      </v-btn>
    </div>

    <article-list v-if="isList && permission.readable" @callback-change-list="changeBoardType" :board="board" :permission="permission"/>
    <article-photos v-if="isPhotos && permission.readable" @callback-change-list="changeBoardType" :boardId="boardId" :permission="permission"/>
<!--    <article-schedule v-if="isSchedule" @callback-change-list="changeBoardType"/>-->

    <div class="d-flex align-center py-3">
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="$router.push({path: 'articles/form'})"  v-if="permission.writable">
        <v-icon left>mdi mdi-playlist-plus</v-icon>
        게시물 추가
      </v-btn>
    </div>
  </div>
</template>

<script>
import ArticleList from "./List";
import ArticlePhotos from "./Photo";
// import ArticleSchedule from "./Schedule";

import boardApi from '@/api/BoardApi'


export default {
  props: ['boardId'],
  name: "Article",
  components: {
    'article-list' : ArticleList,
    'article-photos' : ArticlePhotos,
    // 'article-schedule' : ArticleSchedule
  },
  data: () => ({
    breadcrumbs: [{
      text: '게시물 관리',
      disabled: false,
      href: '#'
    }, {
      text: '게시물 목록'
    }],
    isList: false,
    isPhotos: false,
    isSchedule: false,
    board:{},
    permission: {
      writable: false,
      readable: false
    }

  }),
  methods: {
    changeBoardType(value) {
      this.isList = 'TYPE_GENERAL' === value
      this.isPhotos = 'TYPE_PHOTO' === value
      this.isSchedule = 'TYPE_SCHEDULE' === value
    }
  },
  created: function () {

    boardApi.findById(this.boardId).then(async data => {
      this.board = data;

      // const storedParams = this.$store.getters?.params??{};
      // const boardType = storedParams?.boardType??this.board.boardType;
      this.isList = this.board.boardType === 'TYPE_GENERAL'; // ['TYPE_GENERAL', 'TYPE_SCHEDULE'].includes(this.board.boardType);
      this.isPhotos = this.board.boardType === 'TYPE_PHOTO';
      this.isSchedule = this.board.boardType === 'TYPE_SCHEDULE';

      this.permission = await boardApi.findAssignedPermissionId(this.boardId)
      // console.log(this.permission)
      // const boardWritePermissionRoleIds = [...new Set(this.board.boardPermissions.map(bp => bp.id).filter(p => p.functionType === "WRITE" || p.functionType === "ADMIN").map(p => p.roleId))]
      // const boardReadPermissionRoleIds = [...new Set(this.board.boardPermissions.map(bp => bp.id).filter(p => p.functionType === "READ" || p.functionType === "ADMIN").map(p => p.roleId))]
      // this.permission.writable = [...boardWritePermissionRoleIds].findIndex(r => this.$store.state.user.roles.map(ur => parseInt(ur)).includes(r)) >= 0
      // this.permission.readable = [...boardReadPermissionRoleIds].findIndex(r => this.$store.state.user.roles.map(ur => parseInt(ur)).includes(r)) >= 0

    });

  }
}
</script>
