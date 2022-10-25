<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">팝업 관리</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
      <v-spacer></v-spacer>
      <v-btn @click="savePopup" color="indigo" dark><v-icon left>mdi mdi-content-save</v-icon>{{ this.popup.id != null ? '수정' : '등록' }}</v-btn>
      <v-btn @click="goList" style="margin-left:1rem"><v-icon left>mdi mdi-format-list-bulleted</v-icon>목록</v-btn>
    </div>
    <v-card>
      <v-form ref="popupForm">
        <v-container fluid>
          <v-row align="center">
            <v-col cols="2">
              <v-subheader><h3>팝업 카테고리</h3></v-subheader>
            </v-col>
            <v-col cols="4">
              <v-select
                v-model="popup.categoryId"
                :items="popupCategories"
                label="카테고리 선택"
                item-text="categoryName"
                item-value="id"
                single-line
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
        <v-container fluid style="margin-top:-4rem">
          <v-row align="center">
            <v-col cols="2">
              <v-subheader><h3>제목</h3><b class="essential"> &nbsp;&nbsp;*</b></v-subheader>
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="popup.title"
                label="제목을 입력해 주세요"
                :rules="[rules.common.required]"
                inverted
                clearable
              >
              </v-text-field>
            </v-col>
          </v-row>

          <v-row align="center">
            <v-col cols="2">
              <v-subheader><h3>노출 여부</h3><b class="essential"> &nbsp;&nbsp;*</b></v-subheader>
            </v-col>
            <v-radio-group
              v-model="popup.activated"
              row
              style="padding-left: 20px;"
            >
              <v-radio
                label="노출"
                :value="true"
              ></v-radio>
              <v-radio
                label="미노출"
                :value="false"
              ></v-radio>
            </v-radio-group>
          </v-row>

          <v-row align="center">
            <v-col cols="2">
              <v-subheader><h3>상시</h3></v-subheader>
            </v-col>
            <v-sheet
              class="pa-5"
              style="margin-left:-1rem"
            >
              <v-switch
                v-model="popup.always"
                inset
                :label="popup.always ? '상시 노출' : '기간 제한'"
              />
            </v-sheet>
          </v-row>

          <v-row
            v-if="!popup.always"
            align="center"
          >
            <v-col cols="2">
              <v-subheader><h3>노출기간</h3><b class="essential"> &nbsp;&nbsp;*</b></v-subheader>
            </v-col>
            <v-col cols="2">
              <v-menu
                v-model="startPicker"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="popup.startDt"
                    label="노출 시작일"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    :rules="[rules.common.required]"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="popup.startDt"
                  @input="startPicker = false"
                />
              </v-menu>
            </v-col>
            <v-col cols="2">
              <vue-timepicker manual-input v-model="popup.startTm" :input-class="errStartTm ? 'invalid' : ''" style="margin-top: 25px"></vue-timepicker>
              <v-input hidden v-model="popup.startTm"></v-input>
            </v-col>

            <v-col cols="2">
              <v-menu
                v-model="endPicker"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="popup.endDt"
                    label="노출 종료일"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    :rules="[rules.common.required]"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="popup.endDt"
                  @input="endPicker = false"
                />
              </v-menu>
            </v-col>
            <v-col cols="2">
              <vue-timepicker manual-input v-model="popup.endTm" :input-class="errEndTm ? 'invalid' : ''"  style="margin-top: 25px"></vue-timepicker>
              <v-input hidden v-model="popup.endTm"></v-input>
            </v-col>
            <v-spacer />
          </v-row>
          <v-row
            align="center"
          >
            <v-col cols="2">
              <v-subheader><h3>내용</h3></v-subheader>
            </v-col>
            <v-col>
              <editor-component
                ref="popupContents"
                :val="popup.contents"
                :uploaded="fileMeta"
                @callback-upload="uploadImage"
                label="팝업 내용"/>
            </v-col>
          </v-row>

          <v-row align="center">
            <v-col cols="2" sm="2">
              <v-subheader><h3>링크 연결</h3></v-subheader>
            </v-col>
            <v-col
              cols="12"
              sm="6"
              class="d-flex"
            >
              <v-switch
                v-model="popup.urlTarget"
                flat
                color="primary"
                class="custom-switch-color"
                true-value="_blank"
                false-value="_self"
                :label="popup.urlTarget === '_blank' ? '새창' : '현재창'"
                style="margin-right: 1rem"
              ></v-switch>

              <v-text-field
                v-model="popup.url"
                :label="!this.popup.url?'링크 주소 입력':this.popup.url"
                prepend-icon="mdi-link-variant-plus"
                style="width:500px"
              ></v-text-field>

            </v-col>
          </v-row>
<!--          <v-row align="center">-->
<!--            <v-col cols="2" sm="2">-->
<!--              <v-subheader></v-subheader>-->
<!--            </v-col>-->
<!--            <v-col style="margin-left:10rem">-->
<!--              <v-btn @click="savePopup">{{ this.popup.id != null ? '수정' : '등록' }}</v-btn>-->
<!--              <v-btn @click="goList" style="margin-left:1rem">목록</v-btn>-->
<!--            </v-col>-->
<!--          </v-row>-->
        </v-container>
      </v-form>
    </v-card>
    <div class="d-flex align-center py-3">
      <v-spacer></v-spacer>
      <v-btn @click="savePopup" color="indigo" dark><v-icon left>mdi mdi-content-save</v-icon>{{ this.popup.id != null ? '수정' : '등록' }}</v-btn>
      <v-btn @click="goList" style="margin-left:1rem"><v-icon left>mdi mdi-format-list-bulleted</v-icon>목록</v-btn>
    </div>
  </div>
</template>

<script>
import VueTimepicker from 'vue2-timepicker'
import 'vue2-timepicker/dist/VueTimepicker.css'

import EditorComponent from "../../components/editor/EditorComponent";

import PopupApi from '../../api/PopupApi'
import rules from "@/utils/rules";
import PopupCategoryApi from "@/api/PopupCategoryApi";

export default {
  props: ['id'],
  components: {
    'editor-component': EditorComponent,
    VueTimepicker
  },
  data() {
    return {
      rules,
      serviceType: 'POPUP',
      breadcrumbs: [{
        text: '팝업 관리',
        disabled: false,
        href: '#'
      }, {
        text: this.$props.id ? '팝업 수정' : '팝업 등록'
      }],
      popup: {
        title: null,
        activated: true,
        url: null,
        id: null,
        popupImage: null
      },
      popupFile: null,
      popupCategories: [],
      imagePreview: null,
      imagePreviewName: null,
      startPicker: false,
      endPicker: false,
      errStartTm:false,
      errEndTm:false,
      fileMeta:{},
    }
  },
  methods: {
    onChangeImages(files) {
      this.popupFile = files.target.files[0];
      const file = files.target.files[0]
      this.imagePreview = URL.createObjectURL(file);
      this.imagePreviewName = files.target.value.split('\\')[2];

    },
    inputImage() {
      this.$refs.imageInput.click();
    },
    uploadImage(f) {
      PopupApi.uploadImage(f).then(res => {
        this.fileMeta = res;
      });
    },
    async savePopup() {
      if (await this.$refs.popupForm.validate()) {

        if(this.popup.startTm && typeof this.popup.startTm === "object") {
          this.popup.startTm = this.popup.startTm.HH + ":" + this.popup.startTm.mm + ":00"
        }
        if(this.popup.endTm && typeof this.popup.endTm === "object") {
          this.popup.endTm = this.popup.endTm.HH + ":" + this.popup.endTm.mm + ":00"
        }
        this.popup.contents = this.$refs.popupContents.getValue();

        PopupApi.save(this.popup).then(result => {
          if (this.popup.id == null) {
            alert(this.popup.title + '의 내용이 정상적으로 등록되었습니다.')
          } else {
            alert(this.popup.title + '의 내용이 정상적으로 수정되었습니다.')
          }
          this.goList()
        })
      } else {
        alert('필수 입력 사항을 확인해 주세요')
      }
    },
    goList() {
      this.$router.push({path: '/popups'})
    },


  },
  created() {
    if (this.$route.params.id) {
      PopupApi.get(this.$route.params.id).then(result => {
        // console.log(result)
        this.popup = result;
        this.imagePreviewName = result.popupImage;
      })
    }

    PopupCategoryApi.findAll().then(result => {
      this.popupCategories = result;
    });
  }


};
</script>

<style scoped>

.essential {
  color: red;
  font-size: 30px;
}
.vue__time-picker {
  background-color:ghostwhite;
  margin-left : -1rem;
  margin-top : -0.3rem;
}
</style>
