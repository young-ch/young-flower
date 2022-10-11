<template>
  <div>
    <v-card class="text-center pa-1">
      <v-card-title class="justify-center display-1 mb-2">{{ $t('forgot.title') }}</v-card-title>
      <v-card-subtitle>
        회원 가입 이메일 주소와 성함을 입력해주세요. <br/>
        새로운 비밀번호는 가입하신 이메일 주소로 발송 됩니다.
      </v-card-subtitle>

      <!-- reset form -->
      <v-card-text>
        <v-form ref="form" v-model="isFormValid" lazy-validation @submit.prevent="submit">
          <v-text-field
            v-model="email"
            :rules="[rules.required]"
            :validate-on-blur="false"
            :error="error"
            :error-messages="errorMessages"
            :label="$t('forgot.email')"
            name="email"
            outlined
            @change="resetErrors"
          ></v-text-field>
          <v-text-field
            v-model="userName"
            :rules="[rules.required]"
            :validate-on-blur="false"
            :error="error"
            :error-messages="errorMessages"
            label="이름"
            name="userName"
            outlined
            @keyup.enter="submit"
            @change="resetErrors"
          ></v-text-field>

          <v-btn
            :loading="isLoading"
            block
            x-large
            color="primary"
            @click="submit"
          >{{ $t('forgot.button') }}</v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <div class="text-center mt-6">
      <router-link to="/auth/signin">
        {{ $t('forgot.backtosign') }}
      </router-link>
    </div>
  </div>
</template>

<script>
/*
|---------------------------------------------------------------------
| Forgot Page Component
|---------------------------------------------------------------------
|
| Template to send email to remember/replace password
|
*/
import UserApi from "@/api/UserApi";

export default {
  data() {
    return {
      // reset button
      isLoading: false,

      // form
      isFormValid: true,
      email: '',
      userName: '',

      // form error
      error: false,
      errorMessages: '',

      // input rules
      rules: {
        required: (value) => (value && Boolean(value)) || 'Required'
      }
    }
  },
  methods: {
    submit() {

      if (this.$refs.form.validate()) {
        UserApi.findAccount(this.email, this.userName).then(result => {

          if(result) {
            alert('새로운 비밀번호가 전송 되었습니다.')
            this.$refs.form.resetValidation()
            this.$router.push({path: `/auth/signin`})
          }

        }).catch(error => {
          if((error?.response?.status??1) !== 599 && (error?.response?.status??1) !== 401) {
            if (error.response?.data?.error_description ?? null) {
              alert(error.response.data.error_description ? error.response.data.error_description : error.response.data.errorMessage)
            } else if (error.message)
              alert(error.message);
          }

        });
      }
    },
    resetErrors() {
      this.error = false
      this.errorMessages = ''
    }
  }
}
</script>
