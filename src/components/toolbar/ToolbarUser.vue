<template>
  <v-menu offset-y left transition="slide-y-transition" z-index="100">
    <template v-slot:activator="{ on }">
<!--      <v-btn icon class="elevation-2" v-on="on">-->
      <v-btn
        rounded
        class="elevation-2"
        v-on="on">

        <v-badge
          color="success"
          dot
          bordered
          offset-x="10"
          offset-y="10"
        >
          <v-avatar size="40" left>
            <v-img :src="userImage"></v-img>
          </v-avatar>
        </v-badge>

        <span style="padding-left: 10px">
        {{$store.state.user.name}}
        </span>
      </v-btn>
    </template>

    <!-- user menu list -->
    <v-list dense nav>

      <v-list-item @click.stop="edit()">
        <v-list-item-icon>
          <v-icon small>mdi-account-box-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ $t('menu.profile') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-dialog v-model="showProfile" max-width="500">
          <v-card class="text-center pa-1" style="width: 500px">
            <v-card-title class="justify-center display-1 mb-2">
              <span>Edit Profile</span>
              <v-spacer></v-spacer>
              <v-menu
                bottom
                left
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="showProfile = false"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </template>
              </v-menu>

            </v-card-title>
            <v-card-text>
              <v-form ref="userForm" v-model="isFormValid" lazy-validation>

                <vue-dropzone
                  ref="userPhotoDropzone"
                  id="dropzone"
                  :style="'background-color: #ffffff !important;'"
                  :options="dropzoneOptions"
                  :useCustomSlot="true"
                  @vdropzone-success="dropzoneUploadSuccess"
                  @vdropzone-removed-file="dropzoneRemove"
                  @vdropzone-processing="dropzoneProcessing"
                >
<!--                  style="margin-top: -40px;"-->
                  <div v-if="user.photoFile">
                    <v-badge
                      bordered
                      dark
                      color="black"
                      icon="mdi-delete"
                      @click.native="dropzoneRemove"
                    >
<!--                      overlap-->

                      <!--                    <v-img :src="`${user.photoFile}`" position="center center"/>-->
                      <v-img :src="`${attachmentPath}/user/photo/${user.photoFile}`" max-width="392"/>
                    </v-badge>
                  </div>
                  <div v-if="!user.photoFile && attachmentImages.length === 0" class="dropzone-custom-content">
                    <h3 class="dropzone-custom-title">회원 사진</h3>
                    <div class="subtitle">Drag and drop or click to select a file from your computer</div>
                  </div>
                </vue-dropzone>

                <v-text-field label="로그인 아이디"
                              v-model="user.loginId"
                              ref="loginId"
                              maxlength="50"
                              :rules="[rules.common.required, rules.common.loginId]"
                              @input="value => user.loginId = value.toLowerCase()"
                              @keydown.enter="isUniqueLoginId"
                              @blur="isUniqueLoginId"
                              :success-messages="message.success"
                              :error-messages="message.error"
                />
                <v-text-field label="로그인 패스워드" v-model="user.loginPw" maxlength="120"
                              :type="showPassword ? 'text' : 'password'"
                              :append-icon="showPassword? 'mdi-eye' : 'mdi-eye-off'"
                              @click:append="showPassword = !showPassword"
                />
                <v-text-field label="패스워드 확인" v-model="confirmPassword" :rules="[passwordCompare]" maxlength="120"
                              :type="decryptLoginConfirmPw ? 'text' : 'password'"
                              :append-icon="decryptLoginConfirmPw? 'mdi-eye' : 'mdi-eye-off'"
                              @click:append="decryptLoginConfirmPw = !decryptLoginConfirmPw"
                />
                <v-text-field label="이름" v-model="user.name" :rules="[rules.common.required]" maxlength="120"/>
                <!--          <v-text-field label="닉네임" v-model="user.nickname" maxlength="120"/>-->

                <v-text-field label="이메일" v-model="user.email" ref="email" :rules="[rules.common.required, rules.common.email]" maxlength="120"
                              @keydown.enter="isUniqueEmail"
                              @blur="isUniqueEmail"
                              :error-messages="message.errorEmail" :success-messages="message.successEmail"
                />
                <v-text-field label="연락처" v-model="user.mobileNo" :rules="[rules.common.required, rules.common.mobile]" maxlength="50"
                              @keydown.enter="isUniqueMobile"
                              @blur="isUniqueMobile"
                              :error-messages="message.errorMobile" :success-messages="message.successMobile"
                />

                <v-btn
                  :loading="isLoading"
                  :disabled="isSignUpDisabled"
                  block
                  x-large
                  color="primary"
                  @click="submit"
                >Edit Profile</v-btn>

              </v-form>
            </v-card-text>
          </v-card>
      </v-dialog>


      <v-divider class="my-1"></v-divider>

      <v-list-item @click="logout()">
        <v-list-item-icon>
          <v-icon small>mdi-logout-variant</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ $t('menu.logout') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

    </v-list>


  </v-menu>
</template>

<script>
import config from '../../configs'

import UserApi from "@/api/UserApi";

import rules from "@/utils/rules";

import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import _ from "lodash";


/*
|---------------------------------------------------------------------
| Toolbar User Component
|---------------------------------------------------------------------
|
| Quickmenu for user menu shortcuts on the toolbar
|
*/
export default {
  components: {
    vueDropzone: vue2Dropzone
  },
  computed: {
    dropzoneOptions() {
      return {
        url: `${process.env.VUE_APP_GW_URL}/users/user/upload/image`,
        thumbnailHeight: 110,
        thumbnailWidth: 140,
        maxFilesize: 10, // mb
        maxFiles: 2,
        // acceptedFileTypes: "image/*",
        acceptedFiles: "image/*",
        headers: {
          'Authorization': `bearer ${this?.$store?.getters?.["user/token"] ?? ''}`
        },
        uploadMultiple: false,
        clickable: true,
        addRemoveLinks: true
      }
    },
    passwordCompare() {
      return () => (!this.user.loginPw && !this.confirmPassword) || (this.user.loginPw === this.confirmPassword) || '패스워드가 일치하지 않습니다.'
    }
  },
  data() {
    return {
      // sign up buttons
      isLoading: false,
      isSignUpDisabled: false,

      attachmentPath:process.env.VUE_APP_ATTACH_FILE_SERVER_URL,
      // form
      isFormValid: true,
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      user: {},
      decryptLoginPw: false,
      decryptLoginConfirmPw: false,

      attachmentImages: [],
      userHasRoles: [],

      originUser: {},
      // valid
      rules,
      // form error
      errorName: false,
      errorEmail: false,
      errorPassword: false,
      errorNameMessage: '',
      errorEmailMessage: '',
      errorPasswordMessage: '',

      errorProvider: false,
      errorProviderMessages: '',

      message: {},

      // show password field
      showPassword: false,

      showProfile: false,
      menu: config.toolbar.user,
      userImage: '/images/avatars/avatar1.svg'
    }
  },
  watch: {
    showProfile: {
      handler(nv) {
        if(nv)
          this.getProfile()
      }
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('user/logout');
      this.$router.push('/auth/signin');
    },
    edit() {
      this.showProfile = !this.showProfile
    },
    dropzoneUploadSuccess(uploadedFileInfo, res) {

      // this.user.photoFile = res[0].publishedUri
      const acceptedFiles = this.$refs.userPhotoDropzone.getAcceptedFiles();
      if(acceptedFiles && acceptedFiles.length > 1) {
        this.$refs.userPhotoDropzone.removeFile(acceptedFiles[0]);

      }
      // this.$refs.userPhotoDropzone.removeAllFiles();

      // console.log(res)
      // console.log(uploadedFileInfo)
      // this.attachmentImages = [...this.attachmentImages, ...res.map(r => {return {'fileId' : r.id, 'uuid' : uploadedFileInfo.upload.uuid}})]
      // this.attachmentImages = [...res.map(r => {return {'fileId' : r.id, 'uuid' : uploadedFileInfo.upload.uuid}})]
      this.attachmentImages = [{'savedName' : res.saveName, 'uuid' : uploadedFileInfo.upload.uuid}]

    },
    dropzoneProcessing() {
      this.$refs.userPhotoDropzone.setOption('headers', {Authorization: `bearer ${sessionStorage.getItem("X-Token") ?? ''}`})
    },
    dropzoneRemove(f) {
      this.user.photoFile = null;
      this.attachmentImages = this.attachmentImages.filter(a => a.uuid && a.uuid !== f.upload.uuid);
    },
    uploadedRemove(fileId) {
      this.user.photoFile = null;
      this.attachmentImages = this.attachmentImages.filter(f => f.fileId !== fileId);
    },
    async isUniqueLoginId() {
      this.message.success = null;
      this.message.error = null;

      if(this.user.loginId) {
        const isUsed = await UserApi.existLoginId(this.user.loginId); //.then((existed) => existed.data)
        if (isUsed && this.originUser.loginId !== this.user.loginId) {
          this.message.error = '이미 사용중인 아이디입니다.';
          return false;
        }
        this.message.success = '사용 가능한 아이디입니다.';
        return true;
      }

      return true;
    },
    async isUniqueEmail() {

      this.message.errorEmail = null;
      this.message.successEmail = null;

      if(this.user.email) {

        const isUsed = await UserApi.existEmail(this.user.email); //.then((existed) => existed.data)

        if (isUsed && this.user.email !== this.originUser.email) {
          this.message.errorEmail = '이미 사용중인 이메일 주소입니다.';
          return false;
        }
        this.message.errorEmail = null;
        this.message.successEmail = '사용 가능한 주소입니다.';
        return true;
      }

      return true;
    },
    async isUniqueMobile() {

      this.message.errorMobile = null;
      this.message.successMobile = null;

      if(this.user.mobileNo) {

        const isUsed = await UserApi.existMobile(this.user.mobileNo); //.then((existed) => existed.data)

        if (isUsed && this.user.mobileNo !== this.originUser.mobileNo) {
          this.message.errorMobile = '이미 사용중인 연락처 번호입니다.';
          return false;
        }
        this.message.errorMobile = null;
        this.message.successMobile = '사용 가능한 번호입니다.';
        return true;
      }

      return true;
    },
    async submit() {
      if (this.$refs.userForm.validate()) {

        const valid = [await this.isUniqueLoginId(this.user.loginId), await this.isUniqueEmail(this.user.email), await this.isUniqueMobile(this.user.mobileNo)];
        if(valid.indexOf(false) !== -1) {
          window.scrollTo(0,50)
          alert("필수 입력 항목을 확인해주세요.")
          return
        }

        this.user.photoFile = this.attachmentImages?.map(a => a.savedName)?.[0]??null

        this.user.userHasRoles = this.userHasRoles?.map(r => r.id)??[]

        this.isLoading = true
        this.isSignUpDisabled = true
        UserApi.edit(this.user).then(() => {
          this.user.loginPw = null;
          this.confirmPassword = null;

          this.isLoading = false
          this.isSignUpDisabled = false

          this.$refs.userForm.resetValidation()

          this.showProfile = false

          alert('수정 되었습니다.')

          this.$store.commit('user/SET_NAME', this.user.name);
          this.$store.commit('user/SET_PHOTO', this.user.photoFile);
          this.userImage = `${process.env.VUE_APP_ATTACH_FILE_SERVER_URL}/user/photo/thumb_${this.user.photoFile}`


        }).catch(error => {
          this.$store.dispatch('app/showError', {message: error.response.data.message || error.response.data.error_description, error:{message: ''}});
          // console.log(e)
          // alert(e)
        })

      }
    },
    getProfile() {

      if(this.$store.state.user.data.id) {
        UserApi.getMyProfile().then(data => {
          this.user = data;
          this.user.loginPw = null;
          this.confirmPassword = null;

          this.userHasRoles = this.user.userHasRoles?.map(r => {
            return {
              'roleName':r.role.roleName,
              'id':r.role.id
            }
          })??[]

          this.originUser = _.cloneDeep(data);

          this.attachmentImages = this.user.photoFile ? [{'savedName' : this.user.photoFile}] : []
        })
      }

    }
  },
  created() {
    if(this.$store.state.user.data.photo) {
      const photo = this.$store.state.user.data.photo
      this.userImage = `${process.env.VUE_APP_ATTACH_FILE_SERVER_URL}/user/photo/thumb_${photo}`
    }
    // this.getProfile();
  }
}
</script>
