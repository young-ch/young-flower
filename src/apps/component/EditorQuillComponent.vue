<template>
  <div class="eclub-quill-editor">
    <quill-editor v-model="content" :options="editorOption"/>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css';
import '@/assets/style/quill.font.css';

import {quillEditor} from "vue-quill-editor";
import * as Quill from 'quill'

import ImageResize from 'quill-image-resize-module';
// import {ImageDrop} from 'quill-image-drop-module';

Quill.register('modules/imageResize', ImageResize);
// Quill.register('modules/imageDrop', ImageDrop);

let fonts = [false, 'arial', 'arial-black', 'georgia', 'impact', 'tahoma', 'times-new-roman', 'verdana', 'courier-new', 'lucida-console', 'monaco', 'monospace', 'malgun-gothic', 'gungsuh', 'dotum', 'gulim', 'batang']
let Font = Quill.import('formats/font')
Font.whitelist = fonts
Quill.register(Font, true)

let Size = Quill.import('attributors/style/size')
Size.whitelist = [false, '10px', '12px', '14px', '16px', '18px', '24px', '32px', '36px', '40px', '48px', '64px']
Quill.register(Size, true)

export default {
  name: "EditorQuillComponent",
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
        placeholder: '내용을 입력해주세요.',
        theme: 'snow',
        modules:{
          toolbar: [
            ['bold', 'italic', 'underline', 'strike', 'image', 'video', 'link'],
            ['formula', 'clean'],
            ['blockquote', 'code-block'],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            [{'script': 'sub'}, {'script': 'super'}],
            // [{'size': ['small', false, 'large', 'huge']}],
            [{'size': Size.whitelist}],
            [{ 'font': fonts }],
            [{'header': [1, 2, 3, 4, 5, 6, false]}],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            [{'direction': 'rtl'}],
            [{'indent': '-1'}, {'indent': '+1'}]
          ],
          imageResize:{
            displayStyles:{
              backgroundColor:'black',
              border:'none',
              color:'white'
            },
            modules:['Resize','DisplaySize']
            // modules:['Resize','DisplaySize','Toolbar']
          },
          // imageDrop: true
        }
      },
      content: ``,
    };
  },
  mounted() {
  },
  beforeDestroy() {
  },
  methods: {
    getValue() {
      return this.content;
    },
  },
};
</script>
<style>
.eclub-quill-editor .ql-editor{
  min-height:300px;
}
.eclub-quill-editor .quill-container {
  height: auto;
  min-height: 100%;
  max-width: 90%;
  padding: 50px;
}
.eclub-quill-editor .quill-container .ql-editor {
  font-size: 18px;
  overflow-y: visible;
}

</style>