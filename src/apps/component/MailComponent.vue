<template>
  <section>
    <div :class="!isPart ? 'formInfo mgb' : 'mgb'">
      <dl class="infoCont">
        <dt class="formInfoTxt" v-if="!isPart">제목</dt>
        <dd class="formInfoArea justify-space-between align-center">
          <v-col sm="6">
            <v-text-field label="제목입력" dense solo flat outlined clearable v-model="send.title"/>
          </v-col>
        </dd>
      </dl>
      <dl class="infoCont">
        <dt class="formInfoTxt" v-if="!isPart">내용</dt>
<!--        <dd class="formInfoArea mgtb10">-->
        <dd style="width:84%;">
<!--          <v-col class="mgr">-->
            <editor-tiptap :val="send.contents" ref="sendContents"/>
<!--            <editor-component-->
<!--                ref="sendContents"-->
<!--                :val="send.contents"-->
<!--                :uploaded="fileMeta"-->
<!--                @callback-upload="uploadImage"-->
<!--                label="메일 내용"/>-->
<!--          </v-col>-->
        </dd>
      </dl>
    </div>
    <div class="btnStyleBx">
      <div class="btnCommon justify-center">
        <v-btn class="vBtn" color="#1991eb" dark @click="sendMail()">
          <v-icon left>mdi mdi-content-save</v-icon>
          전송
        </v-btn> 
        <!-- <v-btn class="vBtn" color="#1991eb" dark @click="sendMail2()">
          <v-icon left>mdi mdi-content-save</v-icon>
          전송2
        </v-btn>  -->
        <v-btn class="vBtn" color="#fafafa" @click="isPart ? $emit('callback-event', true) : reset(); ">
          <v-icon left>mdi mdi-close</v-icon>
          취소
        </v-btn>
      </div>
    </div>
  </section>
</template>

<script>
// import EditorComponent from "@/views/component/EditorComponent";
// import EditorQuill from "@/views/component/EditorQuillComponent";
import EditorTiptap from "@/views/component/EditorTiptapComponent";

import mailApi from "@/api/MailApi";

export default {
  name: "MailComponent",
  components: {
    // EditorComponent,
    // EditorQuill,
    EditorTiptap
  },
  props: {
    allSelected: {
      type: Boolean,
      default: false
    },
    param: {
      type: Object,
      default: function(){
        return {}
      }
    },
    selected: {
      type: Array,
      default: function(){
        return []
      }
    },
    includeMailList: {
      type: Array,
      default: function(){
        return []
      }
    },
    templateData: {
      type: Object,
    },
    isPart: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    templateData: {
      handler(nv) {
        this.send.templateId = nv.templateId;
        this.send.subject = nv.subject;
        this.send.content = nv.content;
        this.$refs.sendInput.focus();
      },
      deep:true
    }
  },
  data: () => ({
    send: {
      title: null,
      contents: '',
      sendUserIdList: [],
      searchParam: {}
    },
    fileMeta: {},
    pushLinkDisabled: true,
    reservation: true,
    reservationDate: null,
    errReserveTm:false,
    date: new Date().toISOString().substr(0, 10),
    menu: false
  }),
  methods: {
    uploadImage(f) {
      mailApi.uploadImage(f).then(res => {
        this.fileMeta = res;
      });
    },
    reset() {
      this.send.title = null;
      this.send.contents = null;
    },
    sendMail2() {

      // this.send.contents = this.$refs.sendContents.getValue();
      // 2022-0427 테두리 요청으로 추가 코드 추가
      /*
      this.send.contents = this.$refs.sendContents.getValue().replace(/<table/gi, "<table style='border-collapse: collapse;width:100%;border:1px solid #666;'");
      this.send.contents = this.send.contents.replace(/<td/gi, "<td style='border:1px solid #666;'");
      this.send.contents = this.send.contents.replace(/<th/gi, "<td style='border:1px solid #666;'");
      */
      //console.log(this.send.contents)
    },
    sendMail() {

      if (this.send.title == null || this.send.title === "") {
        alert("제목을 입력하세요.");
        return;
      } 

      this.send.contents = this.$refs.sendContents.getValue();
      // 2022-0427 테두리 요청으로 추가 코드 추가
      /*
      this.send.contents = this.$refs.sendContents.getValue().replace(/<table/gi, "<table style='border-collapse: collapse;width:100%;border:1px solid #666;'");
      this.send.contents = this.send.contents.replace(/<td/gi, "<td style='border:1px solid #666;'");
      this.send.contents = this.send.contents.replace(/<th/gi, "<td style='border:1px solid #666;'");
      */

      if (this.send.contents == null || this.send.contents === "") {
        alert("내용을 입력하세요.");
        return;
      }


      this.send.includeMailList = this.includeMailList;

      if (this.allSelected) {
        let searchParam = {...this.param};
        searchParam.searchIncludeUsers = this.searchIncludeUsers?.map(o => o.userId)??null;
        searchParam.searchExcludeUsers = this.searchExcludeUsers?.map(o => o.userId)??null;
        searchParam.searchMailReceive = (this.param.searchMailReceive === true || this.param.searchMailReceive === false) ? this.param.searchMailReceive : null;

        this.send.searchParam = searchParam;
        this.send.allSelected = this.allSelected;

      } else {

        if (this.selected.length === 0 && (this.send?.includeMailList??[]).length === 0) {
          alert("발송하실 회원을 선택해주세요.");
          return;
        }

        // this.send.sendUserIdList = this.selected.map(u => u.userId);
        this.send.sendUserList = this.selected.map(u => {
          u.userHasRoles = null;
          u.userHasGroups = null;
          return u
        });
      }

      mailApi.send(this.send).then(data => {
        if (data) alert("발송되었습니다.");
        this.reset();
        this.$emit('callback-event', true);
      }).catch(err => {
        alert(err.response.data.message + "발송 실패")
      });
    }
  },
  created() {
    this.reservationDate = this.$moment().format('YYYY-MM-DD');
    this.send.reserveTime = this.$moment().add('minute', 15).format('HH:mm');
  }
}
</script>

<style lang="scss" scoped>
</style>