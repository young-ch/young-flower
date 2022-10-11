<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">배너관리</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
      <v-spacer></v-spacer>

      <v-btn @click="saveBanner" color="indigo" dark><v-icon left>mdi mdi-content-save</v-icon>{{ this.banner.id != null ? '수정' : '등록' }}</v-btn>
      <v-btn @click="goList" style="margin-left:1rem"><v-icon left>mdi mdi-format-list-bulleted</v-icon>목록</v-btn>
    </div>
    <v-card>
      <v-card-title>배너 정보</v-card-title>
      <v-card-text>
        <v-form ref="bannerForm">
        <v-container fluid>
          <v-row align="center">
            <v-col cols="2">
              <v-subheader><h3>배너카테고리</h3></v-subheader>
            </v-col>
            <v-col cols="4">
              <v-select
                v-model="banner.categoryId"
                :items="bannerCategories"
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
                v-model="banner.title"
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
              v-model="banner.activated"
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
              <v-subheader><h3>이미지</h3><b class="essential">&nbsp;&nbsp;*</b></v-subheader>
            </v-col>
            <v-col>
              <input type="file"
                     label="File input"
                     prepend-icon="mdi-camera"
                     @change="onChangeImages"
                     ref="imageInput"
                     accept="image/*"
                     hidden

              >
              <v-text-field
                v-model="imagePreviewName"
                :label="this.banner.bannerImage == null?'':this.banner.bannerImage"
                prepend-icon="mdi-camera"
                readonly
                style="width:490px"
                @click="inputImage"
                :rules="[rules.common.required]"
              ></v-text-field>
              <div>
<!--                <p>※ 배너 : 가로 000px x 세로 000px 로 등록해주세요</p>-->
                <div v-if="this.imagePreview">
                  <div style="height:3rem">
                    <v-chip
                      outlined
                      label
                      class="chipCss"
                    >업로드 이미지 : {{ this.imagePreviewName.substr(1, 32) }}
                    </v-chip>
                  </div>
                  <v-img :src="this.imagePreview"
                         style="width:350px;height:120px;object-fit:cover; margin-top:-0.5rem"/>
                  <br> <br>
                </div>

              </div>
            </v-col>
          </v-row>
        </v-container>
        <v-container fluid style="margin-top:-4rem">
          <v-row align="center">
            <v-col cols="2" sm="2">
              <v-subheader><h3>링크 연결</h3></v-subheader>
            </v-col>
            <v-col
              cols="12"
              sm="6"
            >
              <!-- <v-text-field
                  solo
                  label="Prepend"
                  prepend-icon="mdi-map-marker"
              ></v-text-field> -->
              <v-text-field
                v-model="banner.url"
                :label="this.banner.url == null?'링크 주소 입력':this.banner.url"
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
<!--              <v-btn @click="saveBanner">{{ this.banner.id != null ? '수정' : '등록' }}</v-btn>-->
<!--              <v-btn @click="goList" style="margin-left:1rem">목록</v-btn>-->
<!--            </v-col>-->
<!--          </v-row>-->
        </v-container>
      </v-form>
      </v-card-text>
    </v-card>
    <div class="d-flex flex-column flex-grow-1">
      <div class="d-flex align-center py-3">
        <v-spacer></v-spacer>

        <v-btn @click="saveBanner" color="indigo" dark><v-icon left>mdi mdi-content-save</v-icon>{{ this.banner.id != null ? '수정' : '등록' }}</v-btn>
        <v-btn @click="goList" style="margin-left:1rem"><v-icon left>mdi mdi-format-list-bulleted</v-icon>목록</v-btn>
      </div>
    </div>
  </div>
</template>

<script>

import BannerApi from '../../api/BannerApi'
import rules from "@/utils/rules";
import BannerCategoryApi from "@/api/BannerCategoryApi";
// import FileApi from '../../api/FileApi'

export default {
  props: ['id'],
  data() {
    return {
      rules,
      serviceType: 'BANNER',
      breadcrumbs: [
        {
          text: '배너관리',
          disabled: false,
          href: '#'
        },
        {
          text: this.$props.id ? '배너수정' : '배너등록'
        }
      ],
      banner: {
        title: null,
        activated: true,
        url: null,
        id: null,
        bannerImage: null
      },
      bannerFile: null,
      bannerCategories: [],
      imagePreview: null,
      imagePreviewName: null
    }
  },
  methods: {
    onChangeImages(files) {
      this.bannerFile = files.target.files[0];
      const file = files.target.files[0]
      this.imagePreview = URL.createObjectURL(file);
      this.imagePreviewName = files.target.value.split('\\')[2];

    },
    inputImage() {
      this.$refs.imageInput.click();
    },
    async saveBanner() {
      if (await this.$refs.bannerForm.validate()) {
        // this.banner.startDate=this.startDatePicker;
        // this.banner.endDate=this.endDatePicker;

        this.banner.categoryId = this.banner.categoryId ? this.bannerCategories.find(c => c.id === this.banner.categoryId)?.id??null : null
        BannerApi.save(this.banner, this.bannerFile).then(result => {
          if (this.banner.id == null) {
            alert(this.banner.title + '의 내용이 정상적으로 등록되었습니다.')
          } else {
            alert(this.banner.title + '의 내용이 정상적으로 수정되었습니다.')
          }
          this.goList()
        })
      } else {
        alert('필수 입력 사항을 확인해 주세요')
      }
    },
    goList() {
      this.$router.push({path: '/banners'})
    },


  },
  created() {
    if (this.$route.params.id) {
      BannerApi.get(this.$route.params.id).then(result => {
        // console.log(result)
        this.banner = result;
        this.imagePreviewName = result.bannerImage;
      })
    }

    BannerCategoryApi.findAll().then(result => {
      this.bannerCategories = result;
    });
  }


};
</script>

<style scoped>

.essential {
  color: red;
  font-size: 30px;
}

.chipCss {
  width: 350px;
  margin-bottom: 0.5rem;
  text-align: left;
  height: 2rem;
  display: block;

}
</style>
