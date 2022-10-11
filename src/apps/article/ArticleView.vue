<template>
  <div class="flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1" v-if="id">게시물 정보 상세 {{ article.title && `- ${article.title}` }} </div>

        <div class="display-1" v-else>게시물 생성</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </div>

    <v-card class="my-2">
      <v-card-title>게시물 정보</v-card-title>
      <v-card-text>
        <div class="d-flex flex-column flex-sm-row">
          <div class="flex-grow-1 pt-2 pa-sm-2">

            <div class="d-flex">
              <span class="font-weight-bold">제목</span>

              <span class="mx-6">
                <v-chip
                  color="primary"
                  small
                  v-if="board.hasNotice && article.notice"
                >
                  공지
                </v-chip>

                <template v-for="(c) in board.boardCategories">
                  <v-chip
                    v-bind:key="c.categoryId"
                    small
                    v-if="c.id === article.categoryId"
                  >
                    {{c.categoryName}}
                  </v-chip>
                </template>

                {{article.title}}
              </span>
            </div>

            <div class="d-flex" v-if="article.notice && board.hasPeriod && !article.always">
              <span class="font-weight-bold">공지기간</span>

              <span class="mx-6">{{period}}
<!--                <template>-->
<!--                  <v-chip-->
<!--                    color="primary"-->
<!--                    small-->
<!--                  >-->
<!--                    상시-->
<!--                  </v-chip>-->
<!--                </template>-->
<!--                <template v-else>-->
<!--                  {{period}}-->
<!--                </template>-->
              </span>
            </div>

            <div class="d-flex">
              <span class="font-weight-bold">작성자</span>
              <span class="mx-6">
                {{article.writer}}
              </span>

              <span class="font-weight-bold">작성일</span>
              <span class="mx-6">
                {{  article.createdAt | formatDate('YYYY-MM-DD HH:mm:ss') }}
              </span>

              <span class="font-weight-bold">조회수</span>
              <span class="mx-6">
                {{article.hits ? article.hits : 1}}
              </span>
            </div>

            <div class="d-flex">
              <viewer-quill :val="article.contents" />
<!--              <div v-html="article.contents.replace(/(?:\r\n|\r|\n)/g, '<br />')" v-else>-->
<!--              </div>             -->
            </div>

            <div class="d-flex" v-if="board.hasAttachment">
              <span class="font-weight-bold">첨부 파일</span>
              <span class="mx-6">
                <div v-if="article.articleAttachments">
                  <v-row v-for="f in article.articleAttachments" v-bind:key="f.id" class="ma-2">
                    <v-btn text  @click.prevent="downloadFile(f)"><v-icon>{{ f.contentType.indexOf('image') === 0 ? 'mdi-image' : 'mdi-file' }}</v-icon>
                      <v-tooltip bottom v-if="f.contentType.indexOf('image') === 0">
                        <template v-slot:activator="{ on, attrs }">
                          <span
                            v-bind="attrs"
                            v-on="on"
                          >
                            {{ f.fileRealName }}
                          </span>
                        </template>

                        <span>
                          <v-img :src="`/attachment/${f.fileContextPath}${f.thumbnail}`" max-height="200" max-width="200"/>
                        </span>
                      </v-tooltip>
                      <span v-else>{{ f.fileRealName }}</span>
                    </v-btn>
                <!--                <a :href="`${apiEndPoint}/board/${article.boardId}/article/${article.articleId}/file/${f.id}`" @click.prevent="downloadFile(f)">{{ f.fileRealName }}</a>-->
              </v-row>
                </div>
              </span>
            </div>
          </div>
        </div>

      </v-card-text>
    </v-card>

    <div class="d-flex">
      <v-spacer></v-spacer>
      <v-btn dark color="red" @click="deleteArticle(article)" v-if="permission.updatable">
        <v-icon left>mdi mdi-delete</v-icon>
        삭제
      </v-btn>
      <v-btn color="primary" dark @click="updateForm(article)" style="margin-left: 1rem" v-if="permission.updatable">
        <v-icon left>mdi mdi-pencil</v-icon>
        수정
      </v-btn>
      <v-btn @click="goList()" style="margin-left: 1rem">
        <v-icon left>mdi mdi-format-list-bulleted</v-icon>
        목록
      </v-btn>
    </div>

    <div class="flex-grow-1" v-if="board.hasComment">

      <v-card class="my-2">
        <v-card-title>댓글</v-card-title>
        <v-card-text v-if="permission.commentable">
          <v-form ref="formComment">
            <v-row>

              <v-col cols="4">
                <v-text-field v-model="comment.writer" :rules="[rules.required]" label="작성자" dense />
              </v-col>
              <v-col cols="8" v-if="permission.boardAdmin">
                <v-text-field v-model="createdAt" :rules="[rules.iso8601]" label="작성일 YYYY-MM-DD (수정시 입력)" placeholder="YYYY-MM-DD" dense maxlength="10"/>
              </v-col>

              <v-col cols="12" class="d-flex">
                <v-textarea v-model="comment.contents" rows="3" outlined auto-grow :rules="[rules.required]"></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions v-if="permission.commentable">
          <v-spacer></v-spacer>
          <v-btn class="vBtn" color="indigo" dark @click="saveComment">
            <v-icon left>mdi mdi-content-save</v-icon>
            댓글 등록
          </v-btn>
        </v-card-actions>

        <v-card-text>
          <v-form ref="formListComment">
            <v-data-table
              :headers="commentHeaders"
              :items="comments"
              :server-items-length="totalItems"
              :options.sync="options"
              item-key="commentId"
              class="elevation-1 commentList"
              disable-sort
              hide-default-header
            >
              <template v-slot:top>
                댓글 ({{totalItems}})
              </template>
              <template v-slot:item.writer="{value, item}">
                <div>{{ value }}</div>
                {{ item.createdAt | formatDate('YYYY-MM-DD HH:mm') }}
              </template>

              <template v-slot:item.contents="{value,item}">
                <div v-if="item.id === editComment.id" class="d-flex">
                  <v-textarea v-model="editComment.contents" rows="3" outlined auto-grow :rules="[rules.required]" v-if="item.id === editComment.id"></v-textarea>
                  <div>
                    <v-btn color="#1991eb" dark @click="updateComment" style="margin-left: 1rem">
                      <v-icon left>mdi mdi-content-save</v-icon>
                      수정
                    </v-btn> <br />
                    <v-btn @click="cancelComment" style="margin-left: 1rem; margin-top: 3px">
                      <v-icon left>mdi mdi-reload</v-icon>
                      취소
                    </v-btn>
                  </div>
                </div >
                <div v-html="value.split('\n').join('<br />')" v-else></div>
              </template>

              <template v-slot:item.actions="{ item }">
                <v-icon
                  small
                  class="mr-2"
                  @click.stop="updateCommentForm(item)"
                  v-if="permission.boardAdmin || $route.params.id === item.createdBy"
                >
                  mdi-pencil
                </v-icon>
                <v-icon
                  small
                  @click.stop="deleteComment(item)"
                  v-if="permission.boardAdmin || $route.params.id === item.createdBy"
                >
                  mdi-delete
                </v-icon>

              </template>

            </v-data-table>
          </v-form>
        </v-card-text>

      </v-card>

    </div>

  </div>
</template>

<script>
import articleApi from '@/api/ArticleApi'
import boardApi from '@/api/BoardApi'
import commentApi from '@/api/CommentApi'



// import ViewerTiptap from "@/views/component/ViewerTiptapComponent";
import ViewerQuill from "@/components/editor/ViewerQuillComponent";
import _ from 'lodash'

import moment from "moment";




export default {
  name: "ArticleForm",
  components: {
    ViewerQuill
  },
  props: ['id',  'boardId'],
  computed: {
    breadcrumbs() {
      return [
        {
          text: '게시물 관리',
          to: `/boards/${this.board.id}/articles`,
          exact: true
        },
        {
          text: '게시물 조회'
        }
      ]
    },
    createdAt: {
      get() {
        // return this.coment.createdAt ? this.coment.createdAt.substr(0, 10) : this.$moment().format("YYYY-MM-DD");
        return this.comment.createdAt ? this.$moment(this.comment.createdAt, "YYYY-MM-DD[T]HH:mm:ss").format("YYYY-MM-DD") : this.$moment().format("YYYY-MM-DD");
      },
      set(value) {
        if(value.length === 10 && this.$moment(value, "YYYY-MM-DD").isValid()) {
          this.comment.createdAt = value ? value + "T" + (this.comment.createdAt ? this.$moment(this.comment.createdAt, "YYYY-MM-DD[T]HH:mm:ss").format("HH:mm:ss") : "00:00:00") : this.comment.createdAt;
        }
      }
    }
  },
  data: () => ({
    board:{},
    article: {
      title: null,
      contents: null,
      writer: null,
      always: true,
      customDate: null
    },
    comment: {
      content: null,
      writer: null,
      createdAt: null
    },
    commentHeaders: [{value: 'writer'}, {value : 'contents'}, {value: 'actions'}],
    comments:[],
    totalItems:0,
    options:{},
    period:null,
    apiEndPoint:process.env.VUE_APP_BASE_API,
    endPoint:process.env.VUE_APP_ATTACH_FILE_SERVER_URL,
    rules: {
      required: value => !!value || '필수 입력 항목입니다..',
      iso8601: value => (!value || !!/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/.test(value)) || '날짜 형식이 아닙니다.'
    },
    editComment: {},
    permission: {}
  }),
  watch: {
    options: {
      handler () {
        this.search();
      },
      deep: true,
    }
  },
  methods: {
    reaction() {
      articleApi.reaction(this.article.articleId, this.article.boardId).then(res => {
        if(res.data) {
          this.article.reactionCount = this.article.reactionCount +1;
          this.article.readUserHasReaction = true;
        } else {
          this.article.reactionCount = this.article.reactionCount -1;
          this.article.readUserHasReaction = false;
          // alert("이미 처리되었습니다.")
        }
      });
    },
    downloadFile(f) {

      articleApi.downloadFile(this.article.boardId, this.article.id, f.id)
      .then(response => {
        const blob = new Blob([response.data], { type: response.headers['content-type'] })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = f.fileRealName.slice(f.fileRealName.lastIndexOf('/') + 1);
        link.click()
        URL.revokeObjectURL(link.href)
      })
      .catch(error => {
        console.log(error.response);
        console.log(error.response.status);
        if(error.response.status === 404)
          alert("파일을 찾을 수 없습니다.");
        else
          alert(error.status);
      });
    },
    goList() {
      this.$router.push({path: `/boards/${this.boardId}/articles`})
    },
    deleteArticle(item) {
      if(confirm('삭제하시겠습니까?')) {
        articleApi.delete(item.boardId, item.id).then(() => {
          alert("삭제되었습니다.")
          this.goList();
        });
      }
    },
    updateForm(item) {
      this.$router.push({path:`/boards/${item.boardId}/articles/${item.id}/form`});
    },
    async saveComment() {
      if (!await this.$refs.formComment.validate())
        return;

      // this.comment.createdAt = this.comment.createdAt ? this.comment.createdAt + "T00:00:00" : null;
      commentApi.save(this.boardId, this.id, this.comment).then(() => {
        this.comment.contents = null;
        // this.comment.createdAt = null;
        this.$refs.formComment.resetValidation()
        // this.$refs.formComment.reset();
        // this.comment.writer = this.$store.state.user.username;
        this.search();
      }).catch(error => {
        this.comment.createdAt = this.comment.createdAt.substr(0, 10);
        alert(error);
      });
    },
    async updateComment() {
      if (!await this.$refs.formListComment.validate())
        return;

      if(confirm('댓글을 수정하시겠습니까?')) {
        commentApi.save(this.boardId, this.id, this.editComment).then(() => {
          this.$refs.formComment.resetValidation();
          (this.comments.filter(c => c.commentId === this.editComment.commentId)?.[0] ?? {}).contents = this.editComment.contents;
          this.editComment = {};
        });
      }
    },
    updateCommentForm(item) {
      this.editComment = _.cloneDeep(item);
      console.log(item)
    },
    cancelComment() {
      this.editComment = {};
    },
    deleteComment(item) {
      if(confirm('댓글을 삭제하시겠습니까?')) {
        commentApi.delete(this.boardId, this.id, item.id).then(() => {
          this.search();
        });
      }
    },
    search() {
      if(this.article.id) {
        const {page, itemsPerPage, size} = this.options;
        let params = {
          ...this.param, ...{
            page: page,
            size: size ? size : itemsPerPage
          }
        };
        commentApi.findAllByArticleId(this.article.boardId, this.id, params).then(data => {
          // console.log(data);
          this.totalItems = data.totalElements;
          this.comments = data.content;
        });
      }
    }

  },
  async created() {

    if(this.id) {
      this.permission = await boardApi.findAssignedPermissionId(this.boardId, {articleId: this.id})

      articleApi.findById(this.boardId, this.id).then(async data => {

        // console.log(data);
        this.article = data;

        this.comment.articleId = this.article.articleId;
        this.comment.boardId = this.article.boardId;

        this.search();

        // this.article.customDate = this.article.createdAt.substr(0,10);

        this.period = [this.article.startDt, this.article.endDt].filter(d => d !== null).map(d => moment(d).format("YYYY년 MM월 DD일")).join(" ~ ");

      });
    }
    // this.comment.writer = this.$store.getters?.['user/name'] ?? '';
    // this.comment.writer = this.$store.state.user.username;
    this.comment.writer = this.$store.getters?.['user/name'] ?? '';
    // this.comment.createdAt = moment().format("YYYY-MM-DD HH:mm:ss")

    boardApi.findById(this.boardId).then(async data => {
      this.board = data;
      if (!this.articleId)
        this.permission = await boardApi.findAssignedPermissionId(this.boardId)
    });


  }
}
</script>
