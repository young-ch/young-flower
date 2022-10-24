<template>  
  <div class="tiptap-viewer">
    <el-tiptap
        :content="content"
        :extensions="extensions"
        height="100%"
        lang="ko"
        :readonly="true"
        :tooltip="false"
        :editable="false"
        :useBuiltInExtensions="false"
        :showMenuBar="false"
        :charCounterCount="false"
    />
  </div>
</template>

<script>
import {Doc, Text, Paragraph, Image, ElementTiptap, Table, TableHeader, TableCell, TableRow} from 'element-tiptap';
import 'codemirror/lib/codemirror.css'; // import base style
import 'codemirror/mode/xml/xml.js'; // language
import 'codemirror/addon/selection/active-line.js'; // require active-line.js
import 'codemirror/addon/edit/closetag.js';
// import _ from "lodash";

import 'element-ui/lib/theme-chalk/index.css';
import 'element-tiptap/lib/index.css';

export default {
  name: "ViewerTiptapComponent",
  components: {
    'el-tiptap': ElementTiptap,
  },
  props: {
    val:String
  },
  watch:{
    val: function(v) {
      this.content = v; //_.cloneDeep(v);
    },
  },
  data() {
    return {
      extensions: [new Doc(), new Text(), new Image({menubar:false, bubble: false}), new Paragraph(),
        new Table({ resizable: false, menubar: false }),
        new TableHeader(),
        new TableCell(),
        new TableRow()],
      content: ``,
    };
  },
  mounted() {

  },
  beforeDestroy() {
  }
};
</script>
<style>
.tiptap-viewer .el-tiptap-editor__menu-bar { display:none !important;}
.tiptap-viewer .el-tiptap-editor>.el-tiptap-editor__content { border: 0} 
</style>
