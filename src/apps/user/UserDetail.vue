<template>
  <div>
    <v-card class="my-2">
      <v-card-title>회원 정보</v-card-title>
      <v-card-text>
        <v-form ref="userForm">
          <v-row>

            <v-col cols="12" md="6">

              <div class="d-flex">
                <v-col sm="4">
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
                        <v-img :src="`${attachmentPath}/user/photo/${user.photoFile}`" max-width="150"/>
                      </v-badge>
                    </div>
                    <div v-if="!user.photoFile && attachmentImages.length === 0" class="dropzone-custom-content">
                      <h3 class="dropzone-custom-title">회원 사진</h3>
                      <div class="subtitle">Drag and drop or click to select a file from your computer</div>
                    </div>
                  </vue-dropzone>
                </v-col>

                <v-col class="mgr" sm="8">
                  <v-text-field label="로그인 아이디"
                                v-model="user.loginId"
                                ref="loginId"
                                maxlength="50"
                                :rules="[rules.common.required, rules.common.loginId]"
                                @keydown.enter="isUniqueLoginId(user.loginId)"
                                @input="value => user.loginId = value.toLowerCase()"
                                @blur="isUniqueLoginId(user.loginId)"
                                :success-messages="message.success"
                                :error-messages="message.error"
                  />
                  <v-text-field label="로그인 패스워드" v-model="user.loginPw" :rules="[passwordRequired]" maxlength="120"
                                :type="decryptLoginPw ? 'text' : 'password'"
                                :append-icon="decryptLoginPw? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append="decryptLoginPw = !decryptLoginPw"
                  />
                  <v-text-field label="패스워드 확인" v-model="confirmPassword" :rules="[passwordRequired, passwordCompare]" maxlength="120"
                                :type="decryptLoginConfirmPw ? 'text' : 'password'"
                                :append-icon="decryptLoginConfirmPw? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append="decryptLoginConfirmPw = !decryptLoginConfirmPw"
                  />

                  <v-combobox
                      v-model="userHasRoles"
                      :items="roles"
                      item-text="roleName"
                      item-value="id"
                      label="역할"
                      multiple
                      required
                      :rules="[rules.common.required]"
                    ></v-combobox>

                  <v-select :items="states" item-value="value" item-text="text" v-model="user.state"
                            :rules="[rules.common.required]"
                            label="회원상태"
                            required />
                  <v-textarea
                    v-model="user.withdrawReason"
                    v-if="user.state === 'STATE_WITHDRAW'"
                    class="px-2 py-1"
                    solo-inverted
                    flat
                    placeholder="탈퇴사유"
                    hide-details
                  ></v-textarea>
                </v-col>

              </div>

              <v-row>
                <v-col cols="12" md="12" class="d-flex" style="margin-top: -50px">
<!--                  <v-switch v-model="user.agreedClause" label="약관 동의" :value="true" :false-value="false" style="padding-right: 20px"/>-->
<!--                  <v-switch v-model="user.agreedPersonalInformation" label="개인정보 수집 및 이용에 동의" :value="true" :false-value="false" style="padding-right: 20px"/>-->

    <!--              <v-switch v-model="user.isAgreedMailReceive" label="이메일 수신 동의" :value="true" :false-value="false" style="padding-right: 20px"/>-->
    <!--              <v-switch v-model="user.isAgreedSmsReceive" label="SMS 수신 동의" :value="true" :false-value="false"  style="padding-right: 20px"/>-->
    <!--              <v-switch v-model="user.isAgreedPushReceive" label="Push 수신 동의" :value="true" :false-value="false"   style="padding-right: 20px"/>-->
    <!--              <v-switch v-model="user.isAgreedInfoNotify" label="정보 알림 동의" :value="true" :false-value="false"   style="padding-right: 20px"/>-->
    <!--              <v-switch v-model="user.manager" label="관리자" :value="true" :false-value="false" />-->
                </v-col>

              </v-row>

            </v-col>

            <v-col cols="12" md="6">


              <v-text-field label="이름" v-model="user.name" :rules="[rules.common.required]" maxlength="120"/>
              <v-text-field label="닉네임" v-model="user.nickname" maxlength="120"/>

              <v-text-field label="이메일" v-model="user.email" ref="email" :rules="[rules.common.required, rules.common.email]" maxlength="120"
                            @keydown.enter="isUniqueEmail(user.email)"
                            @blur="isUniqueEmail(user.email)"
                            :error-messages="message.errorEmail" :success-messages="message.successEmail"
              />
              <v-text-field label="연락처" v-model="user.mobileNo" :rules="[rules.common.required, rules.common.mobile]" maxlength="50"
                            @keydown.enter="isUniqueMobile(user.mobileNo)"
                            @blur="isUniqueMobile(user.mobileNo)"
                            :error-messages="message.errorMobile" :success-messages="message.successMobile"
              />

              <v-menu
                ref="birth"
                v-model="birth"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="user.birthDate"
                    label="생년월일"
                    v-bind="attrs"
                    v-on="on"
                    :rules="[rules.common.birth]"
                    maxlength="10"
                  ></v-text-field>
                </template>
                <v-date-picker
                  ref="picker"
                  v-model="user.birthDate"
                  :max="new Date().toISOString().substr(0, 10)"
                  min="1900-01-01"
                  @change="changeBirth"
                  locale="ko"
                ></v-date-picker>
              </v-menu>

  <!--            <v-text-field label="직위" v-model="user.position" maxlength="120"/>-->


  <!--            <v-radio-group v-model="user.gender" label="성별" row>-->
  <!--              <v-radio label="남" value="M"></v-radio>-->
  <!--              <v-radio label="여" value="F"></v-radio>-->
  <!--            </v-radio-group>-->


  <!--            clearable-->

  <!--            <v-select :items="roles" item-value="value" item-text="text" v-model="user.roleId"-->
  <!--                      :rules="[rules.common.required]"-->
  <!--                      label="회원권한"-->
  <!--                      required />-->

            </v-col>

  <!--          <v-col cols="12" md="12" class="d-flex" style="margin-top: -50px">-->
  <!--            <v-text-field v-model="user.zipCode" label="우편번호 검색"-->
  <!--                          @click="openZipCode"-->
  <!--                          @focus.once="openZipCode"-->
  <!--                          v-on:keyup.13="openZipCode"-->
  <!--                          maxlength="6"-->
  <!--                          :rules="[-->
  <!--                            rules.common.required,-->
  <!--                            rules.common.zipcode-->
  <!--                            ]"-->
  <!--                          style="max-width: 120px; padding-right: 10px"-->
  <!--            />-->
  <!--            <v-text-field v-model="user.address" :rules="[rules.common.required]" label="주소" style=" padding-right: 10px"/>-->
  <!--            <v-text-field v-model="user.addressDetail" label="주소상세" ref="addressDetail"/>-->

  <!--            <v-dialog v-model="daumDialogVisible" max-width="500px" @click:outside="daumDialogVisible=false" @keydown.esc="daumDialogVisible=false">-->
  <!--              <daum-post @complete="completeZipCode" />-->
  <!--            </v-dialog>-->
  <!--          </v-col>-->
  <!--          -->

  <!--          <v-col cols="12" md="12" class="d-flex" style="margin-top: -50px">-->
  <!--          </v-col>-->

          </v-row>

        </v-form>
      </v-card-text>

    </v-card>

    <div class="d-flex align-center">
      <v-spacer></v-spacer>
      <v-btn color="red" @click="deleteUser" v-if="user.id && user.id != null" dark>
        <v-icon left>mdi mdi-delete</v-icon>
        삭제</v-btn>
      <v-btn color="indigo" @click="save" style="margin-left:1rem" dark>
        <v-icon left>mdi mdi-content-save</v-icon>
        저장</v-btn>
      <v-btn @click="$router.push(listLink)" style="margin-left:1rem">
        <v-icon left>mdi mdi-format-list-bulleted</v-icon>
        목록</v-btn>
    </div>
  </div>
</template>

<script>
import rules from "@/utils/rules";
import UserApi from "@/api/UserApi";
import RoleApi from "@/api/RoleApi";
import config from "@/configs";
import _ from "lodash";

import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'


export default {
  name:'userForm',
  props:['id'],
  components: {
    vueDropzone: vue2Dropzone
  },
  data: () => ({
    listLink:'/users',
    attachmentPath:process.env.VUE_APP_ATTACH_FILE_SERVER_URL,
    user: {
      flowerCompany: {}
    },
    userHasRoles:[],
    date: '1990-10-09',
    birth: false,
    gender: 'male',
    daumDialogVisible: false,
    companyDialogVisible: false,
    rules,
    confirmPassword: null,
    states:config.meta.user.state,
    systems:config.meta.systems,
    roles:[], //config.meta.user.role,
    isModify:false,
    message:{
      error:'',
      errorEmail:'',
      errorSystem:null,
      success:'',
      successEmail:'',
    },
    decryptLoginPw: false,
    decryptLoginConfirmPw: false,
    originUser: {},
    // dropzoneOptions: {
    //   url: `${process.env.VUE_APP_GW_URL}/files/1/USER/upload`,
    //   thumbnailHeight: 110,
    //   thumbnailWidth: 140,
    //   maxFilesize: 10, // mb
    //   maxFiles: 2,
    //   // acceptedFileTypes: "image/*",
    //   acceptedFiles: "image/*",
    //   headers: {
    //     'Authorization': `bearer ${this?.$store?.getters?.["user/token"] ?? ''}`
    //   },
    //   uploadMultiple: false,
    //   clickable: true,
    //   addRemoveLinks: true
    // },
    attachmentImages: []
  }),
  watch: {
    birth (val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    }
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
    },
    passwordRequired() {
      // return true;
      return value => (!!value || this.isModify) || '필수 입력 항목입니다..'
    }
  },
  methods: {
    openCompany() {
      this.companyDialogVisible = true;
    },
    doneCompanySelector(data) {
      this.user.flowerCompanyId = data ? data.id : null
      this.user.flowerCompany.companyName = data ? data.companyName : ''
      // this.user.flowerCompany.id = data ? data.id : ''

      setTimeout(() => {
      }, 50);

      this.companyDialogVisible = false;

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
      this.attachmentImages = this.attachmentImages.filter(a => a.uuid !== f.upload.uuid);
    },
    uploadedRemove(fileId) {
      this.user.photoFile = null;
      this.attachmentImages = this.attachmentImages.filter(f => f.fileId !== fileId);
    },
    async isUniqueLoginId(loginId) {
      this.message.success = null;
      this.message.error = null;

      if(loginId) {
        const isUsed = await UserApi.existLoginId(loginId); //.then((existed) => existed.data)

        if (isUsed && (this.isModify ? this.originUser.loginId !== loginId : true)) {
          this.message.error = '이미 사용중인 아이디입니다.';
          return false;
        }
        this.message.success = '사용 가능한 아이디입니다.';
        return true;
      }

      return true;
    },
    async isUniqueEmail(email) {

      this.message.errorEmail = null;
      this.message.successEmail = null;

      if(email && (!this.isModify || email !== this.originUser.email)) {

        const isUsed = await UserApi.existEmail(email); //.then((existed) => existed.data)

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
    async isUniqueMobile(mobile) {

      this.message.errorMobile = null;
      this.message.successMobile = null;

      if(mobile && (!this.isModify || mobile !== this.originUser.mobileNo)) {

        const isUsed = await UserApi.existMobile(mobile); //.then((existed) => existed.data)

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
    async save() {

      const valid = [await this.isUniqueLoginId(this.user.loginId), await this.isUniqueEmail(this.user.email), await this.isUniqueMobile(this.user.mobileNo), await this.$refs.userForm.validate()];

      // const valid = [await this.isUniqueEmail(this.user.email), await this.$refs.userForm.validate()];
      if(valid.indexOf(false) !== -1) {
        window.scrollTo(0,50)
        alert("필수 입력 항목을 확인해주세요.")
        return
      }

      this.user.authorities = null
      // console.log(this.attachmentImages)
      this.user.photoFile = this.attachmentImages?.map(a => a.savedName)?.[0]??null
      // const clonedRoles = _.cloneDeep(this.user.userHasRoles);

      this.user.userHasRoles = this.userHasRoles?.map(r => r.id)??[]

      UserApi.save(this.user).then(() => {
        this.user.loginPw = null;
        this.confirmPassword = null;
        alert('저장되었습니다.')
        this.$refs.userForm.resetValidation()
        this.$router.push(this.listLink)
        // this.$router.push({path: `/users/detail`})
      }).catch(e => {
        console.log(e)
        alert(e)
      })
    },
    deleteUser() {
      if (confirm('삭제하시겠습니까?'))
        UserApi.delete(this.user.id).then(() => {
          alert('삭제되었습니다.')
          this.$router.push({path: this.listLink})
        })
    },
    changeBirth (date) {
      // console.log(date);
      this.$refs.birth.save(date)
    },
    openZipCode() {
      this.daumDialogVisible = true;
    },
    completeZipCode(data) {
      this.user.zipCode = data.zonecode
      this.user.address = data.address
      setTimeout(() => {
        this.$refs.addressDetail.focus();
      }, 50);
      this.daumDialogVisible = false;

    },
    get() {

      RoleApi.getRoles().then(data => {
        this.roles = data
      })

      if(this.id) {
        UserApi.get(this.id).then(data => {
          // data.loginPw = null;
          this.user = data;
          // console.log(this.user.flowerCompany)
          if(!this.user.flowerCompany)
            this.user.flowerCompany = {}

          this.user.loginPw = null;
          this.userHasRoles = this.user.userHasRoles?.map(r => {
            return {
              'roleName':r.role.roleName,
              'id':r.role.id
            }
          })??[]
          // this.user.userHasRoles = this.user.userHasRoles?.map(r => r.role.id)??[]
          this.originUser = _.cloneDeep(data);
          this.isModify = true;

          this.attachmentImages = this.user.photoFile ? [{'savedName' : this.user.photoFile}] : []
        })
      }

    }
  },
  created() {
    this.get();

    let storedParams = this.$store.getters?.params??{};
    if(storedParams && storedParams.pageName) {
      this.pageName = storedParams.pageName

      if(storedParams.pageName === '관리자') {
        this.userHasRoles = [{'roleName' : storedParams.pageName, 'id': 2}]
        this.listLink = '/users/roles/2'
      } else if(storedParams.pageName === '일반 회원') {
        this.userHasRoles = [{'roleName' : storedParams.pageName, 'id': 100}]
        this.listLink = '/users/roles/100'
      } else if(storedParams.pageName === '탈퇴 회원') {
        this.userHasRoles = [{'roleName' : storedParams.pageName, 'id': 100}]
        this.listLink = '/users/states/STATE_WITHDRAW'
      } else if(storedParams.pageName === '신청 회원') {
        this.userHasRoles = [{'roleName' : storedParams.pageName, 'id': 100}]
        this.listLink = '/users/states/STATE_APPROVAL_REQUEST'
      }

    }
    // console.log(storedParams)
  }
}
</script>
<style lang="scss">

  .dropzone-custom-content {
    text-align: center;
  }

  .dropzone-custom-title {
    margin-top: 0;
    color: #00b782;
  }

  //.subtitle {
    //color: #fff;
  //}

  .dropzone {
    //min-height:200px;
    //max-height:200px;
    background-color: #152935 !important;
  }


</style>
