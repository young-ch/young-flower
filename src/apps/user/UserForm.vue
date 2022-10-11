<template>
  <div class="flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1" v-if="id">{{ pageName }} 정보 상세 {{ user.name && `- ${user.name}` }}</div>
        <div class="display-1" v-else>{{ pageName }} 생성</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
    </div>

    <v-card class="mb-4" v-if="id">
      <v-card-title>기본 정보
        <v-icon small color="primary" v-if="user.role === 'admin'">mdi-security</v-icon>
        <span class="ma-1" v-if="user.role === 'admin'">관리자 계정</span>
      </v-card-title>
      <v-card-text>
        <div class="d-flex flex-column flex-sm-row">
          <div class="flex-grow-1 pt-2 pa-sm-2">
            <div class="d-flex">
              <span class="font-weight-bold">회원번호</span>
              <span class="mx-1">
                {{ user.id }}
              </span>
            </div>
            <div class="d-flex">
              <span class="font-weight-bold">이메일</span>
              <span class="mx-1">
                <copy-label :text="user.email + ''"/>
              </span>
            </div>
          </div>
          <div class="flex-grow-1 pt-2 pa-sm-2">

            <div class="d-flex">
              <span class="font-weight-bold">이름</span>
              <span class="mx-1">
                <copy-label :text="user.name + ''"/>
              </span>
            </div>
            <div class="d-flex">
              <span class="font-weight-bold">연락처</span>
              <span class="mx-1">
                <copy-label :text="user.mobileNo"/>
              </span>
            </div>

          </div>
          <div class="flex-grow-1 pt-2 pa-sm-2">

            <div class="d-flex">
              <span class="font-weight-bold">최종 접속 일시</span>
              <span class="mx-1">
                {{ user.loginAt | formatDate() }}
              </span>
            </div>
            <div class="d-flex">
              <span class="font-weight-bold">접속 횟수</span>
              <span class="mx-1">
                {{ user.loginCount }} 회
              </span>
            </div>

          </div>
          <div class="flex-grow-1 pt-2 pa-sm-2">

            <div class="d-flex">
              <span class="font-weight-bold">가입 일시</span>
              <span class="mx-1">
                {{ user.createdAt | formatDate() }}
              </span>
            </div>
            <div class="d-flex">
              <span class="font-weight-bold">승인 일시</span>
              <span class="mx-1">
                {{ user.approvedAt | formatDate() }}
              </span>
            </div>

          </div>
          <div class="flex-grow-1 pt-2 pa-sm-2">

            <div class="d-flex">
              <span class="font-weight-bold">비밀번호 변경일</span>
              <span class="mx-1">
                {{ user.passwordChangedAt | formatDate() }}
              </span>
            </div>
            <div class="d-flex">
              <span class="font-weight-bold">상태 변경일</span>
              <span class="mx-1">
                {{ user.stateChangedAt | formatDate() }}
              </span>
            </div>

          </div>
        </div>
      </v-card-text>
    </v-card>

    <v-tabs v-model="tab" :show-arrows="false" background-color="transparent">
      <v-tab href="#tabs-information" :key="1">회원정보</v-tab>
      <v-tab href="#tabs-history" :key="2">활동이력</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item value="tabs-information">
        <user-detail ref="tabs-information" :id="id"></user-detail>
      </v-tab-item>
      <v-tab-item value="tabs-history">
        <user-history ref="tabs-history" :id="id"></user-history>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import UserApi from "@/api/UserApi";
import CopyLabel from '@/components/common/CopyLabel'
import UserDetail from './UserDetail'
import UserHistory from './UserHistory'
import config from "@/configs";

export default {
  components: {
    CopyLabel,
    UserDetail,
    UserHistory
  },
  props: ['id'],
  computed: {
    breadcrumbs() {
      return [
        {
          text: this.pageName + ' 관리',
          to: '/users/list',
          exact: true
        },
        {
          text: this.pageName + (this.user.id ? ' 수정' : ' 생성')
        }
      ]
    },
    state() {
      if(this.user && this.user.state)
        return config.meta.user.state.filter(s => s.value === this.user.state).map(s => s.text)[0];
      else
        return "";
    }
  },
  data() {
    return {
      user: {
      },
      tab: null,
      pageName: '회원'
    }
  },
  methods: {
    get() {
      if(this.id)
        UserApi.get(this.id).then(data => {
          // console.log(data);
          data.loginCount = data.loginCount??0
          this.user = data;
        })
    }
  },
  created() {
    this.get();
    // console.log(process.env)

    let storedParams = this.$store.getters?.params??{};
    if(storedParams && storedParams.pageName) {
      this.pageName = storedParams.pageName

      if(storedParams.pageName === '관리자') {
        this.user.userHasRoles = [{'roleName' : storedParams.pageName, 'id': 2}]
      }
    }
  }
}
</script>
