<style scoped>
.comment-wrap .hd-box {
    border-top: 1px solid #dfdfdf;
    border-bottom: 1px solid #eeeeee;
    background: #f8f8f8;
    height: 54px;
    line-height: 54px;
    background: #f8f8f8;
    box-sizing: border-box;
    padding-left: 25px;
    font-size: 18px;
    font-weight: 500;
}
.comment {
  padding: 0;
  border-bottom: 1px solid #eeeeee;
  margin-bottom: 20px;
}
.comment__body {
  padding-left: 40px;
  padding-bottom: 20px;
  position: relative;
}
.comment__body .buttons__right {
  position: absolute;
  right: 20px;
  top: 10px;
}
.comment__body .buttons__right a + a {
  position: relative;
  padding-left: 10px;
}
.comment__body .buttons__right a + a:before {
  background: #bbbbbb;
  width: 1px;
  height: 9px;
  position: absolute;
  left: 0;
  top: 50%;
  margin-top: -3.5px;
  content: '';
  display: block;
}
.comment__content {
  padding-right: 120px;
}
.comment__child {
  background-color: #f8f8f8;
  border: none;
  margin-bottom: 0;
  padding-left: 30px;
}
.comment__child .comment__body {
  padding-top: 10px;
}
.comment__child .re_name {
  color: #526de1;
}
.comment__namebox {
  color: #999999;
  font-size: 14px;
  line-height: 1;
  margin-top: 8px;
  display: flex;
  padding-bottom: 5px;
}
.comment__date {
  position: relative;
  margin-left: 10px;
  padding-left: 10px;
}
.comment .reply {
  width: 100%;
}
.comment .reply .reply__textarea {
  width: 100%;
  background-color: white;
  resize: none;
  border: 1px solid #EEE;
  height: 80px;
  padding: 10px;
  box-sizing: border-box;
}
.comment .comment__buttons {
  display: flex;
  align-items: center;
  color: #666666;
  font-size: 14px;
  font-weight: 500;
  position: relative;
  margin-top: 5px;
}
.comment .comment__buttons span {
  margin-right: 10px;
  position: relative;
  padding-right: 10px;
}
.comment .comment__buttons span:before {
  background: #bbbbbb;
  width: 1px;
  height: 9px;
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -3.5px;
  content: '';
  display: block;
}
.comment .comment__buttons .buttons__button {
  margin-right: 10px;
  color: #666666;
  font-size: 14px;
  font-weight: 500;
  position: relative;
  cursor: pointer;
}
.comment .comment__buttons .buttons__buttonsmall {
  font-size: 12px;
}
.comment .comment__buttons.small .buttons__button {
  font-size: 12px;
}
.comment .buttons__body {
  display: flex;
  align-items: center;
  color: #666666;
  font-size: 14px;
  font-weight: 500;
  position: relative;
  margin-top: 5px;
}
.comment .buttons__body span {
  margin-right: 10px;
  position: relative;
  padding-right: 10px;
}
.comment .buttons__body span:before {
  background: #bbbbbb;
  width: 1px;
  height: 9px;
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -3.5px;
  content: '';
  display: block;
}
.comment .buttons__body .buttons__button {
  margin-right: 10px;
  color: #666666;
  font-size: 14px;
  font-weight: 500;
  position: relative;
  cursor: pointer;
}
.comment .buttons__body.small {
  font-size: 12px;
}
.comment .buttons__body.small .buttons__button {
  font-size: 12px;
}
.comment .reply__form {
  position: relative;
  padding-left: 75px;
  padding-right: 120px;
}
.comment .reply__form .buttons__body {
  padding-right: 20px;
  text-align: right;
  padding-bottom: 20px;
  justify-content: flex-end;
}
.comment .reply__form.icon-replay {
  background-position-y: 5px;
}
.dis_none {
  display: none;
}
.comment .comment__body + .comment.comment__child.icon-replay{
  padding-top: 10px;
  background-position-y: 22px;
}
.comment .comment__body + .comment.comment__child.icon-replay > .comment__body + .comment.comment__child.icon-replay {
  padding-top: 0;
  background-position-y: 12px;
}
.icon-replay{width:100%;background: url('') 50px 12px no-repeat;padding-left:30px;box-sizing: border-box;} 
.comment-wrap .reg-box.replay .btn-edit-box.st-right{position: relative;padding-right:0;margin-bottom:10px} 

.replay-list-box .re-row-box.bg-none{background: none;padding-left:0;padding-top: 0;}

.dis_none{display:none}
.comment .comment__body + .comment.comment__child.icon-replay{padding-top:10px;background-position-y: 22px;}
.comment .comment__body + .comment.comment__child.icon-replay > .comment__body + .comment.comment__child.icon-replay{padding-top:0;background-position-y: 12px;}
.cmt-del{color:#999}
</style>

<template> 
  <div
    :class="getDepthClassname"> 
    <div :class="getCommentDisplayYn">
      <div  class="comment__content " >
        <span v-if="isDeleted" class="cmt-del">[삭제글]</span>
        <span class="re_name" v-if="(parentAuthor && isDeleted == false && depth == 2)">@{{parentAuthor}} </span><span v-html="getContent(content)"></span>
      </div>
      <div class="comment__namebox">
        <div class="comment__author">{{ author }}</div>
        <div class="comment__date">{{ formatDate(date) }}</div> 
      </div>
      <div class="buttons__right" v-if="(isDeleted == false ) ">
        <div class="comment__buttons small">
          <a
            class="buttons__button "
            href="#"
            @click.prevent="onClickReplyUpdateToggle(content, id)">수정</a>
          <a
            class="buttons__button"
            href="#"
            @click.prevent="onClickRemoveComment(id)">삭제</a>
        </div>
      </div>      
      <div class="comment__buttons" v-if="(isDeleted == false && depth < 1)">
        <span v-if="children.length > 0 ">답글 {{totalChildren}}</span>
        <a
          class="buttons__button"
          href="#"
          @click.prevent="onClickReplyToggle(id)">답글작성</a> 
      </div>
    </div>
    <form
      v-if="(isVisibleReplyEditor && reCommentIndex == id)"
      class="reply"
      @submit.prevent="onSubmitReply(reply, id)"  > 
      <div class="reply__form icon-replay" >
        <textarea
          v-model="reply"
          class="reply__textarea"></textarea>
        <div class="buttons__body small">
          <span
            class="buttons__button "
            href="#"
            @click.prevent="onClickReplyToggle">취소</span>
          <button class="small">등록</button>
        </div>
      </div>
    </form>
    <form
      v-if="isVisibleCommentUpdateForm && reCommentIndex == id"
      class="reply"
      @submit.prevent="onUpdateReply(editreply, id, upcomment)"  >
      <div class="reply__form icon-replay" >
        <textarea
          v-model="editreply"
          class="reply__textarea"></textarea>
        <div class="buttons__body small">
          <span
            class="buttons__button"
            href="#"
            @click.prevent="onClickReplyUpdateToggle">취소</span>
          <button>수정</button>
        </div>
      </div> 
    </form>
    <Comment
      v-for="(comment, key) in children"
      :key="key"  
      :id="comment.id"
      :createId="comment.createdBy"
      :isDeleted="comment.deleted"
      :author="comment.writer"
      :parentAuthor="author"
      :date="comment.createdAt" 
      :content="comment.contents"
      :children="comment.childrenList"
      :totalChildren="comment.totalChildren"
      :depth="depth + 1" 
      :upcomment="comment" 
      :reCommentIndex="reCommentIndex"
      @submit:reply="onSubmitReply"
      @update:comment="onUpdateReply"
      @remove="onClickRemoveComment"></Comment>
  </div>
</template>

<script>
import moment from "moment";  
export default {
  name: 'Comment',
  props: {  
    upcomment: Object ,
    isDeleted:{
      type : Boolean
    },
    id:{
      type : Number
    },
    createId:{
      type : String
    },   
    author: {
        type: String,
        required: false,
        default: "작성자",
    },
    parentAuthor: {
        type: String,
        required: false
    },    
    content: {
        type: String,
        required: false,
        default: "글 내용"
    },
    date: {
        type: [Date, String],
        required: false,
        default: null,
    },
    children: {
        type: Array,
        required: false,
        default: () => [],
    },
    totalChildren: {
        type: Number
    }, 
    depth: {
      type: Number,
      required: false,
      default: 0,
    }, 
    isVisibleCommentUpdateForm:Boolean,
    isVisibleReplyEditor:Boolean,
  },
  data() {
    return {
      //isVisibleReplyEditor: false,
      //isVisibleCommentUpdateForm: false,
      reply: null, 
      editreply: null,
      reCommentIndex:-1,
    };
  },
  watch: {
    isVisibleReplyEditor() {
      this.reply = null;
    },
  }, 
  computed:{
    getDepthClassname(){
      let className = "comment";
      if(this.comment){
        className = "comment";
      }else{
        if(this.depth > 0){
          className = "comment comment__child icon-replay";
        }
      }
      if(this.totalChildren  == 0 && this.isDeleted){
        className = "comment dis_none";
      }
      return className;
    },
    getCommentDisplayYn(){
      let className = "comment__body";
      /*
      if(this.isDeleted){
        if(this.depth==0){
          if(this.totalChildren == 0){
            className = "comment__body dis_none";
          } 
        }
      }
      console.log("this.isDeleted")
      console.log(this.isDeleted)
      console.log(this.totalChildren)
      */
      return className;
    },
  },
  methods: {
    getContent(value){  
      return value.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }, 
    formatDate(value) {
      return moment(value).format('YYYY.MM.DD');
    },
    onClickReplyToggle(id) { 

      console.log(id);
      if(!this.isVisibleReplyEditor && id){
        this.isVisibleReplyEditor = !this.isVisibleReplyEditor;
        if(this.isVisibleReplyEditor){
          this.reCommentIndex =  id;
        }else{
          this.reCommentIndex =  -1;
        } 
      }else{
        this.isVisibleReplyEditor = false;
        this.reCommentIndex =  -1;
        return;
      }
    }, 
    onSubmitReply(reply, id) {  
      if(reply == null){
        return alert('댓글을 한 글자 이상 입력해주세요.')
      }      
      this.$emit('submit:reply', reply, id);
    },
    onUpdateReply(editreply, id, upcomment) { 
      if(editreply == null){
        return alert('댓글을 한 글자 이상 입력해주세요.')
      }      
      this.$emit('update:comment', editreply, id, upcomment);
    },
    
    onClickRemoveComment(id) {
      this.$emit('remove', id);
    },
    onClickReplyUpdateToggle(content, id){
  
      console.log(id);
      console.log(content);
      console.log(this);
      if(!this.isVisibleCommentUpdateForm && id){
        this.editreply = content;    
        this.isVisibleCommentUpdateForm = !this.isVisibleCommentUpdateForm;
        if(this.isVisibleCommentUpdateForm){
          this.reCommentIndex =  id;
        }else{
          this.reCommentIndex =  -1;
        } 
      }else{
        this.isVisibleCommentUpdateForm = false;
        this.reCommentIndex =  -1;
      }
    }
  },
};
</script>
