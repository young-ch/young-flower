<template>
  <div>
    <v-card class="text-center pa-1">
      <v-card-title class="justify-center display-1 mb-2">{{ $t('register.title') }}</v-card-title>
<!--      <v-card-subtitle>Let's build amazing products</v-card-subtitle>-->

      <!-- sign up form -->
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
            <div v-if="user.photoFile" style="margin-top: -40px;">
              <v-badge
                bordered
                dark
                color="black"
                icon="mdi-delete"
                overlap
                @click.native="dropzoneRemove"
              >
                <!--                    <v-img :src="`${user.photoFile}`" position="center center"/>-->
              </v-badge>
<!--              <v-img :src="`${attachmentPath}/user/photo/${user.photoFile}`"/>-->
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
          <v-text-field label="로그인 패스워드" v-model="user.loginPw" :rules="[rules.required]" maxlength="120"
                        :type="showPassword ? 'text' : 'password'"
                        :append-icon="showPassword? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append="showPassword = !showPassword"
          />
          <v-text-field label="패스워드 확인" v-model="confirmPassword" :rules="[rules.required, passwordCompare]" maxlength="120"
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
          >{{ $t('register.button') }}</v-btn>

<!--          <div class="caption font-weight-bold text-uppercase my-3">{{ $t('register.orsign') }}</div>-->

          <!-- external providers list -->
<!--          <v-btn-->
<!--            v-for="provider in providers"-->
<!--            :key="provider.id"-->
<!--            :loading="provider.isLoading"-->
<!--            :disabled="isSignUpDisabled"-->
<!--            class="mb-2 primary lighten-2 primary&#45;&#45;text text&#45;&#45;darken-3"-->
<!--            block-->
<!--            x-large-->
<!--            @click="signInProvider(provider)"-->
<!--          >-->
<!--            <v-icon small left>mdi-{{ provider.id }}</v-icon>-->
<!--            {{ provider.label }}-->
<!--          </v-btn>-->

          <div v-if="errorProvider" class="error--text">{{ errorProviderMessages }}</div>

<!--          <div class="mt-5 overline">-->
<!--            {{ $t('register.agree') }}-->
<!--            <br />-->
<!--            <router-link to="">{{ $t('common.tos') }}</router-link>-->
<!--            &-->
<!--            <router-link to="">{{ $t('common.policy') }}</router-link>-->
<!--          </div>-->
        </v-form>
      </v-card-text>
    </v-card>

    <div class="text-center mt-6">
      {{ $t('register.account') }}
      <router-link to="/auth/signin" class="font-weight-bold">
        {{ $t('register.signin') }}
      </router-link>
    </div>
  </div>
</template>

<script>
/*
|---------------------------------------------------------------------
| Sign Up Page Component
|---------------------------------------------------------------------
|
| Template for user sign up with external providers buttons
|
*/
import UserApi from "@/api/UserApi";
import rules from "@/utils/rules";

import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'

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

      // external providers
      providers: [{
        id: 'google',
        label: 'Google',
        isLoading: false
      }, {
        id: 'facebook',
        label: 'Facebook',
        isLoading: false
      }],

      // input rules
      // rules: {
      //   required: (value) => (value && Boolean(value)) || 'Required'
      // }
    }
  },
  methods: {
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
      this.attachmentImages = this.attachmentImages.filter(a => a.uuid !== f.upload.uuid);
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
        if (isUsed) {
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

        if (isUsed) {
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

        if (isUsed) {
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
        this.user.authorities = null
        this.user.photoFile = this.attachmentImages?.map(a => a.savedName)?.[0]??null
        this.user.userHasRoles = null

        UserApi.join(this.user).then(() => {
          this.user.loginPw = null;
          this.confirmPassword = null;
          alert('가입 되었습니다.')

          this.isLoading = true
          this.isSignUpDisabled = true

          this.$refs.userForm.resetValidation()
          this.$router.push({path: `/auth/signin`})
        })

      }
    },
    resetErrors() {
      this.errorName = false
      this.errorEmail = false
      this.errorPassword = false
      this.errorNameMessage = ''
      this.errorEmailMessage = ''
      this.errorPasswordMessage = ''

      this.errorProvider = false
      this.errorProviderMessages = ''
    }
  }
}
</script>
