<template>
  <div>
    <quill-editor v-model="content" :options="editorOption" :disabled="true" />
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import {quillEditor} from "vue-quill-editor";
import '@/assets/style/quill.font.css';

export default {
  name: "ViewerQuillComponent",
  components: {
    quillEditor
  },
  props: {
    val:String
  },
  watch:{
    val: function(v) {
      this.content = v;
    },
  },
  data() {
    return {
      editorOption: {
        placeholder: '',
        readOnly: true,
        theme: '',
        modules:{
          toolbar:false
        }
      },
      content: ``,
    };
  }
};
</script>
<style scoped>
.ql-editor{
  min-height:300px;
}
</style>