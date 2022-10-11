<template>
  <div>
    <el-tiptap
        v-model="content"
        :extensions="extensions"
        height="100%"
        placeholder="내용을 입력해주세요.."
        lang="ko"
    />
  </div>
</template>

<script>
import {
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  // text extensions
  Bold,
  Underline,
  Italic,
  Strike,
  Code,
  FontType,
  FontSize,
  TextColor,
  TextHighlight,
  FormatClear,
  // paragraph extensions
  Heading,
  ListItem,
  BulletList,
  OrderedList,
  TodoItem,
  TodoList,
  TextAlign,
  LineHeight,
  Indent,
  Blockquote,
  CodeBlock,
  // rich and tools extensions
  Link,
  Image,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  // Iframe,
  TrailingNode,
  HorizontalRule,
  Fullscreen,
  // Print,
  Preview,
  SelectAll,
  History,
  CodeView,
} from 'element-tiptap';

import codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css'; // import base style
import 'codemirror/mode/xml/xml.js'; // language
import 'codemirror/addon/selection/active-line.js'; // require active-line.js
import 'codemirror/addon/edit/closetag.js';
// import _ from "lodash";

import 'element-ui/lib/theme-chalk/index.css';
import 'element-tiptap/lib/index.css';

export default {
  name: "EditorTiptapComponent",
  components: {
    'el-tiptap': ElementTiptap
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
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }),
        new Underline({ bubble: true }),
        new Italic({ bubble: true }),
        new Strike({ bubble: true }),
        new Code(),
        new FontType({
          bubble: true,
          fontTypes: {
            'Arial': 'Arial',
            'Arial Black': 'Arial Black',
            'Georgia': 'Georgia',
            'Impact': 'Impact',
            'Tahoma': 'Tahoma',
            'Times New Roman': 'Times New Roman',
            'Verdana': 'Verdana',
            'Courier New': 'Courier New',
            'Lucida Console': 'Lucida Console',
            'Monaco': 'Monaco',
            'monospace': 'monospace',
            'Malgun Gothic': '맑은고딕',
            'Gungsuh': '궁서',
            'Dotum': '돋움',
            'Gulim': '굴림',
            'Batang' : '바탕'            
          }
        }),
        new FontSize({bubble: true}),
        new TextColor({ bubble: true }),
        new TextHighlight({ bubble: true }),
        new FormatClear(),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new TodoItem(),
        new TodoList(),
        new TextAlign(),
        new LineHeight(),
        new Indent(),
        new Blockquote(),
        new CodeBlock(),
        new Link(),
        new Image(),
        // new Iframe(),
        new Table({ resizable: true }),
        new TableHeader(),
        new TableCell(),
        new TableRow(),
        new HorizontalRule(),
        // new Print(),
        new Preview(),
        new SelectAll(),
        new Fullscreen(),
        new CodeView({
          codemirror,
          codemirrorOptions: {
            styleActiveLine: true,
            autoCloseTags: true,
          },
        }),
        new TrailingNode(),
        new History(),
      ],
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
      // return this.editorMode ? this.$refs.teditor.invoke("getHtml") : this.html;
    },
  },
};
</script>
