<template>

  <div class="flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1" v-if="articleId">{{ board.boardName }} {{ article.title && `- ${article.title}` }} 수정</div>

        <div class="display-1" v-else>{{ board.boardName }} 게시물 생성</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
      <v-spacer></v-spacer>
      <!--        <v-btn icon>-->
      <!--          <v-icon>mdi-refresh</v-icon>-->
      <!--        </v-btn>-->
      <v-btn color="indigo" @click="save" dark  v-if="(this.article.id && permission.updatable) || !this.article.id && permission.writable">
        <v-icon left>mdi mdi-content-save</v-icon>
        저장
      </v-btn>
      <v-btn @click="goList()" style="margin-left: 1rem">
        <v-icon left>mdi mdi-format-list-bulleted</v-icon>
        목록
      </v-btn>
    </div>

    <v-card class="my-2">
      <v-card-title>게시물 정보</v-card-title>
      <v-card-text>
        <v-form ref="formArticle">
          <v-row dense class="pa-2 align-center d-flex">

            <v-col v-if="board.boardCategories && board.boardCategories.length > 0">
              <v-select :items="board.boardCategories" item-value="id" item-text="categoryName"
                        v-model="article.categoryId"
                        clearable outlined flat label="카테고리" :rules="[rules.required]"
                        />
            </v-col>

            <v-col >
              <v-text-field v-model="article.title" :rules="[rules.required]" label="제목" maxlength="120" dense/>
            </v-col>

            <v-col class="d-flex" v-if="board && board.hasNotice">
              <v-switch
                v-model="article.notice"
                flat
                dense
                color="amber"
                class="custom-red"
                :label="article.notice ? '공지사항' : '일반게시물'"
                v-if="board.hasNotice"
              ></v-switch>
              <v-spacer style="max-width: 10px"/>
              <v-switch
                v-if="article.notice && board.hasPeriod"
                v-model="article.always"
                flat
                color="primary"
                :label="article.always ? '상시노출' : '기간제한'"
              ></v-switch>
              <v-spacer style="max-width: 10px"/>

              <date-range-component v-if="!article.always && article.notice"
                                    v-on:event="searchDate => period = searchDate" label="공지 시작일 ~ 종료일"
                                    :value="period" :rules="[rules.required, rules.length12]"></date-range-component>
            </v-col>
          </v-row>
          <v-row dense class="pa-2 align-center">
            <v-col cols="4">
              <v-text-field v-model="article.writer" label="작성자명" :rules="[rules.required]" dense flat :readonly="!permission.boardAdmin"/>
            </v-col>
            <v-col cols="8" v-if="permission.boardAdmin">
              <v-text-field v-model="createdAt" label="작성일 YYYY-MM-DD (수정시 입력)" :rules="[rules.iso8601]" placeholder="YYYY-MM-DD" dense
                            flat/>
            </v-col>

            <v-col cols="12" md="12"
                   v-if="article.articleAttachments && article.id && board.boardType === 'TYPE_PHOTO'">
              대표 이미지 설정
              <div class="d-flex">
                <div
                  v-for="img in article.articleAttachments.filter(a => a.contentType.indexOf('image') === 0)"
                  :key="img.id"
                  style="padding: 30px 5px 30px 5px;"
                >
                  <v-card
                    class="mx-auto"
                    style="cursor: pointer; overflow: hidden"
                    max-width="100"
                    max-height="100"
                    @click="setMainImage(img.id)"
                  >
                    <v-overlay
                      v-if="img.mainImage"
                      absolute
                      color="#036358"
                    >
                      <v-icon color="red">
                        mdi-image-album
                      </v-icon>
                    </v-overlay>
                    <v-img :src="`/attachment/${img.fileContextPath}${img.fileServerName}`"/>
                  </v-card>
                  <!--              <v-img-->
                  <!--                  :src="`/attachment/${img.fileContextPath}${img.thumbnail}`"-->
                  <!--                  :lazy-src="`${img.fileContextPath}${img.thumbnail}`"-->
                  <!--                  aspect-ratio="1"-->
                  <!--                  max-height="100"-->
                  <!--                  max-width="100"-->
                  <!--                  class="grey lighten-2"-->
                  <!--                  style="cursor: pointer"-->
                  <!--                  v-if="img.contentType.indexOf('image') === 0"-->
                  <!--                  @click="setMainImage(img.id)"-->
                  <!--              >-->
                  <!--                <v-icon color="yellow" v-if="img.mainImage" style="position: absolute">mdi-image-album</v-icon>-->
                  <!--                <img :src="`/attachment/${img.fileContextPath}${img.fileServerName}`"/>-->
                  <!--              </v-img>-->
                </div>
              </div>
            </v-col>

            <v-col cols="12" md="12">
              <editor-quill :val="article.contents" ref="contents"/>
            </v-col>
            <v-col cols="12" md="12" v-if="board.hasAttachment">
              <v-file-input
                v-model="files"
                label="다중 파일 선택"
                multiple
                prepend-icon="mdi-paperclip"
                @change="appendFile"
                @click:clear="clearAllFile"
              >
                <template v-slot:selection="{ text, file }">
                  <v-chip
                    small
                    label
                    color="primary"
                    close @click:close="removeFile(file)"
                  >
                    {{ text }}
                  </v-chip>
                </template>
              </v-file-input>
              <div v-if="article.articleAttachments && article.id">
                <h4>첨부 완료 파일</h4>

                <v-chip v-for="f in attachedFiles" v-bind:key="f.id" class="ma-2" close
                        @click:close="removeAttachedFile(f)">
                  <v-tooltip bottom v-if="f.contentType.indexOf('image') === 0">
                    <template v-slot:activator="{ on, attrs }">
                      <span
                        v-bind="attrs"
                        v-on="on"
                      >
                        <v-icon>mdi-image</v-icon>
                        {{ f.fileRealName }}
                      </span>
                    </template>

                    <span>
                      <v-img :src="`/attachment/${f.fileContextPath}${f.thumbnail}`" max-height="200" max-width="200"/>
                    </span>
                  </v-tooltip>
                  <span v-else>{{ f.fileRealName }}</span>
                </v-chip>

                <div class="btnStyleBx">
                  <div class="btnCommon justify-center">
                    <v-btn color="red" dark @click="deleteAttachedFiles">
                      <v-icon left>mdi mdi-delete</v-icon>
                      첨부 완료 파일 전체 삭제
                    </v-btn>
                    <v-btn @click="resetAttachedFiles" style="margin-left: 1rem">
                      <v-icon left>mdi mdi-reload</v-icon>
                      삭제 취소
                    </v-btn>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
    <div class="flex-grow-1">
      <div class="d-flex align-center py-3">
        <v-spacer></v-spacer>
        <v-btn color="indigo" @click="save" dark v-if="(this.article.id && permission.updatable) || !this.article.id && permission.writable">
          <v-icon left>mdi mdi-content-save</v-icon>
          저장
        </v-btn>
        <v-btn @click="goList()" style="margin-left: 1rem">
          <v-icon left>mdi mdi-format-list-bulleted</v-icon>
          목록
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import articleApi from '@/api/ArticleApi'
import boardApi from '@/api/BoardApi'

// import EditorComponent from "../component/EditorComponent";
// import EditorTiptap from "@/views/component/EditorTiptapComponent";
import EditorQuill from "@/components/editor/EditorQuillComponent";

import DateRageComponent from "@/components/date/DateRageComponent";

import _ from 'lodash';
// import vue2Dropzone from 'vue2-dropzone'
// import 'vue2-dropzone/dist/vue2Dropzone.min.css'

export default {
  name: "ArticleForm",
  components: {
    // 'editor-component': EditorComponent,
    // EditorTiptap,
    EditorQuill,
    'date-range-component': DateRageComponent,
    // vueDropzone: vue2Dropzone
  },
  props: {
    userId: String,
    articleId: String,
    boardId: String
  },
  data: () => ({
    rules: {
      required: value => !!value || '필수 입력 항목입니다..',
      length12: value => value && value.length > 12 || '필수 입력 항목입니다.',
      iso8601: value => (!value || !!/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/.test(value)) || '날짜 형식이 아닙니다.'
    },
    board: {},
    article: {
      title: null,
      contents: null,
      writer: null,
      always: true,
      customDate: null
    },
    period: [],
    schedulePeriod: [],
    imageFileUrl: null,
    endPoint: process.env.VUE_APP_ATTACH_FILE_SERVER_URL,
    fileMeta: {},
    files: [],
    selectedFiles: [],
    attachedFiles: [],
    permission: {}
  }),
  computed: {
    dropzoneOptions() {
      return {
        url: '',
        thumbnailWidth: 150,
        maxFilesize: 0.5,
        maxFiles: 2,
        acceptedFileTypes: "image/*",
        headers: {
          'Authorization': `bearer ${this?.$store?.getters?.token ?? ''}`
        },
        uploadMultiple: false,
        clickable: true,
        addRemoveLinks: true
      }
    },
    createdAt: {
      get() {
        // return this.article.createdAt ? this.article.createdAt.substr(0, 10) : this.$moment().format("YYYY-MM-DD");
        return this.article.createdAt ? this.$moment(this.article.createdAt, "YYYY-MM-DD[T]HH:mm:ss").format("YYYY-MM-DD") : this.$moment().format("YYYY-MM-DD");
      },
      set(value) {
        if(value.length === 10 && this.$moment(value, "YYYY-MM-DD").isValid()) {
          this.article.createdAt = value ? value + "T" + (this.article.createdAt ? this.$moment(this.article.createdAt, "YYYY-MM-DD[T]HH:mm:ss").format("HH:mm:ss") : "00:00:00") : this.article.createdAt;
        }
      }
    },
    breadcrumbs() {
      return [
        {
          text: '게시물 관리',
          to: `/boards/${this.boardId}/articles`,
          exact: true
        },
        {
          text: this.articleId ? '게시물 수정' : '게시물 생성'
        }
      ]
    },
  },
  methods: {
    setMainImage(fileId) {
      this.article.mainImageId = fileId;
      this.article.articleAttachments.forEach(a => a.mainImage = false);
      this.article.articleAttachments.filter(a => a.id === fileId)[0].mainImage = true;
      // img.mainImage = !img.mainImage
    },
    thumbnailSuccess(file, response) {
      this.article.thumbnail = response.saveName;
      const acceptedFiles = this.$refs.articleThumbnailDropzone.getAcceptedFiles();
      if (acceptedFiles && acceptedFiles.length > 1)
        this.$refs.articleThumbnailDropzone.removeFile(acceptedFiles[0]);
    },
    thumbnailRemove() {
      this.article.thumbnail = null;
    },
    appendFile() {
      this.files = [...new Set([
        ...this.selectedFiles,
        ...this.files
      ])]
      this.selectedFiles = _.cloneDeep(this.files);
    },
    clearAllFile() {
      this.files = [];
      this.selectedFiles = [];
    },
    removeFile(removeFile) {
      this.files = this.files.filter(f => f !== removeFile);
      this.selectedFiles = _.cloneDeep(this.files);
    },
    removeAttachedFile(attachedFile) {
      this.attachedFiles = this.attachedFiles.filter(f => f.id !== attachedFile.id);
    },
    resetAttachedFiles() {
      this.attachedFiles = this.article.articleAttachments;
    },
    deleteAttachedFiles() {
      this.attachedFiles = []
    },
    uploadImage(f) {
      articleApi.uploadImage(this.$route.params.id, f).then(res => {
        // console.log(res);
        this.fileMeta = res;
      });
    },
    goList() {
      this.$router.push({path: `/boards/${this.boardId}/articles`})
    },
    async save() {

      if (!await this.$refs.formArticle.validate())
        return;

      this.article.boardId = this.board.id;
      this.article.contents = this.$refs.contents.getValue();

      // console.log(this.period);
      this.article.startDt = this.period?.[0] ?? null;
      this.article.endDt = this.period?.[1] ?? null;

      this.article.scheduleStartDt = this.schedulePeriod?.[0] ?? null;
      this.article.scheduleEndDt = this.schedulePeriod?.[1] ?? null;

      // this.article.createdAt = this.article.customDate ? this.article.customDate + "T00:00:00" : this.article.createdAt;
      this.article.articleAttachments = this.attachedFiles;
      articleApi.save(this.article, this.files).then(data => {
        if (data) {
          if (this.article.id) {
            alert("수정되었습니다.");
          } else {
            alert("등록되었습니다.");
          }
          this.goList();
        } else {
          alert("Error");
        }
      });
    }

  },
  async created() {
    this.article.writer = this.$store.getters?.['user/name'] ?? '';

    boardApi.findById(this.boardId).then(async data => {

      if (!this.articleId) {
        this.permission = await boardApi.findAssignedPermissionId(this.boardId)

        if(!this.permission.writable) {
          alert("작성 권한이 없습니다.")
          this.$router.go(-1)
          return
        }
      }

      this.board = data;
      this.dropzoneOptions.url = `${process.env.VUE_APP_BASE_API}/board/${this.$route.params.id}/article/upload/image`;
      // this.permission.writable = getPermission(this.board.boardPermissions, this.$store.state.user)

    });

    if (this.articleId) {

      this.permission = await boardApi.findAssignedPermissionId(this.boardId, {articleId: this.articleId})
      if(!this.permission.updatable) {
        alert("수정 권한이 없습니다.")
        return
      }

      articleApi.findById(this.boardId, this.articleId).then(async data => {

        // this.permission.updatable = this.permission.updatale || this.permission.writable && this.article.createdBy === this.$store.state.user.id

        this.article = data;

        // this.article.customDate = this.article.createdAt.substr(0,10);

        this.attachedFiles = _.cloneDeep(this.article.articleAttachments);

        // console.log(data)
        this.period = [this.article.startDt, this.article.endDt].filter(d => d !== null);
        this.schedulePeriod = [this.article.scheduleStartDt, this.article.scheduleEndDt].filter(d => d !== null);

      });
    }

  }
}
</script>
