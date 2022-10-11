<template>
  <div class="flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">정적페이지 관리 {{ content.title && `- ${content.title}` }}</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
      <v-spacer></v-spacer>
<!--      <v-btn @click="saveContent">{{ this.content.contentId != null ? '수정' : '추가' }}</v-btn>-->
      <v-btn color="red" @click="deleteContent" v-if="id" style="margin-right:1rem" dark><v-icon left>mdi mdi-delete</v-icon>삭제</v-btn>
      <v-btn @click="resetContent"><v-icon left>mdi-refresh</v-icon>리셋</v-btn>
      <v-btn @click="saveContent" color="indigo" style="margin-left:1rem" dark><v-icon left>mdi mdi-content-save</v-icon>저장</v-btn>
      <v-btn @click="goToList" style="margin-left:1rem"><v-icon left>mdi mdi-format-list-bulleted</v-icon>목록</v-btn>

<!--      <v-btn icon @click="resetContent" style="margin-left:1rem">-->

    </div>

    <v-card class="mb-4">
<!--      <v-card-title>기본 정보</v-card-title>-->

      <v-card-text>

        <v-form ref="contentForm">
          <v-col>
<!--            <span class="font-weight-bold">페이지 제목</span>-->
            <span>
                  <v-text-field
                    v-model="content.title"
                    label="페이지 제목"
                    :rules="[rules.common.required]"
                    inverted
                    clearable
                    dense
                  ></v-text-field>
              </span>
          </v-col>

          <v-col>
            <span class="font-weight-bold">사용 여부</span>
            <span>
                <v-switch
                  v-model="content.activated"
                  flat
                  dense
                  :label="content.activated ?'사용':'사용안함'"
                ></v-switch>
            </span>
          </v-col>

          <v-col>
            <span class="font-weight-bold">페이지 내용</span>
            <span>
                <editor-component
                  ref="contents"
                  :val="content.contents"
                  :uploaded="fileMeta"
                  @callback-upload="uploadImage"
                  label="페이지 내용"/>
            </span>
          </v-col>

        </v-form>
      </v-card-text>
    </v-card>

    <div class="d-flex" style="margin-top:1rem">
      <v-spacer></v-spacer>
      <v-btn color="red" @click="deleteContent" v-if="id" style="margin-right:1rem" dark><v-icon left>mdi mdi-delete</v-icon>삭제</v-btn>
      <v-btn @click="resetContent"><v-icon left>mdi-refresh</v-icon>리셋</v-btn>
      <v-btn color="indigo" @click="saveContent" style="margin-left:1rem" dark><v-icon left>mdi mdi-content-save</v-icon>저장</v-btn>
      <v-btn @click="goToList" style="margin-left:1rem"><v-icon left>mdi mdi-format-list-bulleted</v-icon>목록</v-btn>
    </div>

  </div>
</template>

<script>

import ContentApi from '../../api/ContentApi'

import rules from "@/utils/rules";
import _ from "lodash";
import EditorComponent from "../../components/editor/EditorComponent";

export default {
  components: {
    'editor-component': EditorComponent
  },
  props: ['id'],
  data() {
    return {
      tab: null,
      rules,
      breadcrumbs: [{
        text: '정적 페이지 관리',
        disabled: false,
        href: '#'
      }, {
        text: this.$props.id ? '페이지 수정' : '페이지 등록'
      }],
      content: {
        title:''
      },
      copiedContent: {},
      fileMeta: {},
    }
  },
  methods: {
    uploadImage(f) {
      ContentApi.uploadImage(f).then(res => {
        this.fileMeta = res;
      });
    },
    async saveContent() {
      if (confirm("저장하시겠습니까?") && await this.$refs.contentForm.validate()) {

        this.content.contents = this.$refs.contents.getValue();

        ContentApi.save(this.content).then(result => {
          this.content.id = result.id
          alert("저장되었습니다.")
          // this.$router.push({path: '/contents'})
        })
      }
    },
    goToList() {
      this.$router.push({path: '/contents'})
    },
    resetContent() {
      this.content = _.cloneDeep(this.copiedContent)
    },
    deleteContent(content) {
      if (confirm('삭제하시겠습니까?'))
        ContentApi.delete(content.id).then(() => {
          this.content = this.content.filter(r => r !== content)
          alert("삭제되었습니다.")
          this.$router.push({path: '/contents'})
        })
    }

  },
  created() {
    if (this.id) {
      ContentApi.findContentById(this.id).then(result => {
        // console.log(result)
        this.content = result;
        // console.log(this.content)
        this.copiedContent = _.cloneDeep(this.content)

      })
    }
  }


};
</script>
