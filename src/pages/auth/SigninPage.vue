<template>
  <div>
    <v-card class="text-center pa-1">
      <v-card-title class="justify-center display-1 mb-2">Welcome</v-card-title>
      <v-card-subtitle>Sign in to your account</v-card-subtitle>

      <!-- sign in form -->
      <v-card-text>
        <v-form ref="form" v-model="isFormValid" lazy-validation>
          <v-text-field
            v-model="loginId"
            :rules="[rules.required]"
            :validate-on-blur="false"
            :error="error"
            label="아이디"
            name="loginId"
            outlined
            @keyup.enter="submit"
            @change="resetErrors"
          ></v-text-field>

          <v-text-field
            v-model="password"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required]"
            :type="showPassword ? 'text' : 'password'"
            :error="error"
            :error-messages="errorMessages"
            label="패스워드"
            name="password"
            outlined
            @change="resetErrors"
            @keyup.enter="submit"
            @click:append="showPassword = !showPassword"
          ></v-text-field>

          <v-btn
            :loading="isLoading"
            :disabled="isSignInDisabled"
            block
            x-large
            color="primary"
            @click="submit"
          >로그인</v-btn>

<!--          <div class="caption font-weight-bold text-uppercase my-3">{{ $t('login.orsign') }}</div>-->
<!--           external providers list-->
<!--          <v-btn-->
<!--            v-for="provider in providers"-->
<!--            :key="provider.id"-->
<!--            :loading="provider.isLoading"-->
<!--            :disabled="isSignInDisabled"-->
<!--            class="mb-2 primary lighten-2 primary&#45;&#45;text text&#45;&#45;darken-3"-->
<!--            block-->
<!--            x-large-->
<!--            to="/"-->
<!--          >-->
<!--            <v-icon small left>mdi-{{ provider.id }}</v-icon>-->
<!--            {{ provider.label }}-->
<!--          </v-btn>-->

          <div v-if="errorProvider" class="error--text">{{ errorProviderMessages }}</div>

<!--          <div class="mt-5">-->
<!--            <router-link to="/auth/forgot-password">-->
<!--              {{ $t('login.forgot') }}-->
<!--            </router-link>-->
<!--          </div>-->
        </v-form>
      </v-card-text>
    </v-card>

    <div class="text-center mt-6">
      {{ $t('login.noaccount') }}
      <router-link to="/auth/signup" class="font-weight-bold">
        {{ $t('login.create') }}
      </router-link>
    </div>
  </div>
</template>

<script>
/*
|---------------------------------------------------------------------
| Sign In Page Component
|---------------------------------------------------------------------
|
| Sign in template for user authentication into the application
|
*/
// import MenuApi from "@/api/MenuApi";

export default {
  data() {
    return {
      // sign in buttons
      isLoading: false,
      isSignInDisabled: false,

      // form
      isFormValid: true,
      loginId: '',
      password: '',

      // form error
      error: false,
      errorMessages: '',

      errorProvider: false,
      errorProviderMessages: '',

      // show password field
      showPassword: false,

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
      rules: {
        required: (value) => (value && Boolean(value)) || 'Required'
      }
    }
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.isLoading = true
        this.isSignInDisabled = true
        this.signIn(this.loginId, this.password)
      }
    },
    signIn(loginId, password) {

      this.$store.dispatch('user/login', {loginId, loginPw:password}).then((data) => {

        // this.$router.push('/dashboard/analytics')
        // this.$router.push('/users')


        // console.log(this.$store.state.user.roles)
        // console.log(adminMenus)
        if(data) {
          if (this.$store.state.user.roles.includes("1") || this.$store.state.user.roles.includes("2"))
            this.$router.push('/dashboard')
          // else if (this.$store.state.user.roles.includes("100"))
          //   this.$router.push('/report-list')
          else
            this.$router.push('/dashboard')
        }
      }).catch(error => {

        this.isLoading = false;
        this.isSignInDisabled = false

        // console.log(error)
        // console.log(error.response)
        if((error?.response?.status??1) !== 599 && (error?.response?.status??1) !== 401) {
          if (error.response?.data?.error_description ?? null) {
            alert(error.response.data.error_description ? error.response.data.error_description : error.response.data.errorMessage)
          } else if (error.message)
            alert(error.message);
        }

      });
      // this.$router.push('/')
    },
    signInProvider(provider) {},
    resetErrors() {
      this.error = false
      this.errorMessages = ''

      this.errorProvider = false
      this.errorProviderMessages = ''
    }
  },
  created() {
    this.$store.commit('error/HIDE_ALERT')
    this.$store.commit('app/resetToast')
  }
}
</script>
