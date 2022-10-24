<template>
<section>
  <v-row>
    <v-col class="mgr" >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="enableHtmlMode">HTML</v-btn>
        <v-btn color="blue darken-1" text @click="disableHtmlMode">EDITOR</v-btn>
      </v-card-actions>
    </v-col>
  </v-row>
  <v-row v-if="editorMode">
    <v-col class="mgr">
      <editor ref="teditor" :options="editorComputedOptions()" initialEditType="wysiwyg"/>
    </v-col>
  </v-row>
  <v-row  v-else>
    <v-col class="mgr">
      <v-textarea v-model="html" :rules="[rules.required]" :label="label" :auto-grow="false" rows="10"></v-textarea>
    </v-col>
  </v-row>
</section>
</template>

<script>
import '@toast-ui/editor/dist/toastui-editor.css';
import 'codemirror/lib/codemirror.css';
import 'tui-color-picker/dist/tui-color-picker.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';

import {Editor} from '@toast-ui/vue-editor';
import _ from 'lodash';

const beautify_html = require('js-beautify').html;

export default {
  name: "EditorComponent",
  components: {
    Editor
  },
  props: {
    val:String,
    label:{
      type:String,
      default:"컨텐츠 내용"
    },
    uploaded: Object
  },
  methods: {
    editorComputedOptions() {
      const _this = this;
      const options = Object.assign({}, this.editorOptions, this.options);
      options.hooks = {};
      options.initialEditType = _this.mode;
      options.height = _this.height;
      options.language = _this.language;
      options.placeholder = _this.placeholder;
      options.hooks.addImageBlobHook = _this.uploadImage;
      options.plugins = [colorSyntax]

      return options;
    },
    // uploadImage(fileOrBlob, cb, source) {
    uploadImage(fileOrBlob) {
      // let imageUrl = URL.createObjectURL(fileOrBlob);
      // cb(imageUrl, "description");

      this.$emit('callback-upload', fileOrBlob);

      // this.uploadFunction(fileOrBlob).then(res => {
      //
      //   const { url, desc } = res;
      //   this.html += `<p><img src="${this.ATTACH_PATH + url}" alt="${desc}"/></p>`
      //   this.$refs.teditor?.invoke("setHtml", this.html ?? '');
      //
      //   console.log(cb);
      //   console.log(source);
      //   // cb(this.ATTACH_PATH + url, "description");
      // });
    },
    uploadComplete() {
      if(this.editorMode)
        this.html = this.getEditorHtml();

      this.html += `<p><img src="${this.ATTACH_PATH}${this.uploaded.contextPath}${this.uploaded.saveName}" alt="${this.uploaded.clientName}"/></p>`
      this.$nextTick(() => {
        this.$refs.teditor?.invoke("setHtml", this.html, false);
      });
      // this.$refs.teditor?.invoke("setHtml", this.html ?? '');
    },
    enableHtmlMode() {
      if(!this.editorMode)
        return

      // console.log(document.getElementsByClassName("tui-editor-contents")[0].innerHTML);
      // console.log(document.getElementsByClassName("tui-editor-contents")[0]);


      // for (var i = 0; i < editorContents.length; i++) {
      //   console.log(editorContents[i].innerHTML);
      // }
      this.$nextTick(() => {
        // this.$emit('callback-html', this.$refs.teditor.invoke("getHtml"));
        // this.html = this.$refs.teditor.invoke("getHtml");
        // this.html = document.getElementsByClassName("tui-editor-contents")[0];
        // console.log(document.getElementsByClassName('te-ww-container')[0]?.childNodes[0]?.childNodes??'');
        // console.log([...editorContents].map(c => c.innerHTML));
        // console.log(editorContents);

        this.html = beautify_html(this.getEditorHtml());
        console.log(this.html)
      });
      this.editorMode = false;

    },
    disableHtmlMode() {
      if(this.editorMode)
        return

      // this.$emit('callback-editor');

      this.editorMode = true;

      this.$nextTick(() => {
        this.$refs?.teditor?.invoke("setHtml", this.html, false);
      });
    },
    getValue() {
      if(this.editorMode)
        this.html = this.getEditorHtml();
      return this.html;
      // return this.editorMode ? this.$refs.teditor.invoke("getHtml") : this.html;
    },
    getEditorHtml() {
      return [...document.getElementsByClassName('te-ww-container')[0]?.childNodes[0]?.childNodes ?? []].filter(c => c.className.indexOf("tui-editor-contents") !== -1)?.[0]?.innerHTML ?? '';
    }
  },
  watch: {
    val: function(v) {
      this.html = _.cloneDeep(v);
      this.$nextTick(() => {
        this.$refs.teditor?.invoke("setHtml", this.html ?? '');
      });
      this.editorMode = true;
    },
    uploaded: function(v) {
      if(v && Object.keys(v).length > 0) {
        this.uploadComplete();
      }
    }
  },
  data: () => ({
    ATTACH_PATH:process.env.VUE_APP_ATTACH_STATIC_PATH,
    editorOptions:{
      minHeight: '200px',
      language: 'en_US',
      useCommandShortcut: true,
      useDefaultHTMLSanitizer: true,
      usageStatistics: true,
      hideModeSwitch: false,
      previewStyle: 'vertical',
      toolbarItems: [
        'heading',
        'bold',
        'italic',
        'strike',
        'divider',
        'hr',
        'quote',
        'divider',
        'ul',
        'ol',
        'task',
        'indent',
        'outdent',
        'divider',
        'table',
        'image',
        'link',
        'divider',
        'code',
        'codeblock'
      ]
    },
    html:'',
    rules: {
      required: value => !!value || '필수 입력 항목입니다..'
    },
    editorMode: true
  })
}
</script>
<style>
div.tui-popup-wrapper.te-popup-add-image.tui-editor-popup > div.tui-popup-body > .te-file-type.te-tab-active + label {
  display: none;
}
div.tui-popup-wrapper.te-popup-add-image.tui-editor-popup > div.tui-popup-body > .te-file-type.te-tab-active + label + input {
  display: none;
}
</style>
<style scoped>
</style>