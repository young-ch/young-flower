<template>
  <div class="flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">정책 정의 관리 {{ policy.policyName && `- ${policy.policyName}` }}</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
      <v-spacer></v-spacer>
<!--      <v-btn @click="savePolicy">{{ this.policy.policyId != null ? '수정' : '추가' }}</v-btn>-->
      <v-btn color="red" @click="deletePolicy" v-if="id" style="margin-right:1rem" dark><v-icon left>mdi mdi-delete</v-icon>삭제</v-btn>
      <v-btn @click="resetPolicy"><v-icon left>mdi-refresh</v-icon>리셋</v-btn>
      <v-btn @click="savePolicy" color="indigo" style="margin-left:1rem" dark><v-icon left>mdi mdi-content-save</v-icon>저장</v-btn>
      <v-btn @click="goToList" style="margin-left:1rem"><v-icon left>mdi mdi-format-list-bulleted</v-icon>목록</v-btn>

<!--      <v-btn icon @click="resetPolicy" style="margin-left:1rem">-->

    </div>

    <v-card class="mb-4">
<!--      <v-card-policyName>기본 정보</v-card-policyName>-->

      <v-card-text>

        <v-form ref="policyForm">
          <v-col>
            <span>
                  <v-text-field
                    v-model="policy.policyGroupCode"
                    label="정책 그룹 코드"
                    :rules="[rules.common.required, rules.common.digitCapAlphabet]"
                    inverted
                    clearable
                    dense
                    maxlength="100"
                  ></v-text-field>
              </span>
          </v-col>

          <v-col>
            <span>
                  <v-text-field
                    v-model="policy.policyCode"
                    label="정책코드"
                    :rules="[rules.common.required, rules.common.digitCapAlphabet]"
                    inverted
                    clearable
                    dense
                    maxlength="100"
                  ></v-text-field>
              </span>
          </v-col>

          <v-col>
            <span>
                  <v-text-field
                    v-model="policy.policyName"
                    label="정책명"
                    :rules="[rules.common.required]"
                    inverted
                    clearable
                    dense
                    maxlength="100"
                  ></v-text-field>
              </span>
          </v-col>

          <v-col>
            <span class="font-weight-bold">정책 설명</span>
            <span>
              <v-textarea
                v-model="policy.policyDescription"
                flat
                placeholder="정책 설명"
                hide-details
              ></v-textarea>
            </span>
          </v-col>

        </v-form>
      </v-card-text>
    </v-card>

    <div class="d-flex" style="margin-top:1rem">
      <v-spacer></v-spacer>
      <v-btn color="red" @click="deletePolicy" v-if="id" style="margin-right:1rem" dark><v-icon left>mdi mdi-delete</v-icon>삭제</v-btn>
      <v-btn @click="resetPolicy"><v-icon left>mdi-refresh</v-icon>리셋</v-btn>
      <v-btn color="indigo" @click="savePolicy" style="margin-left:1rem" dark><v-icon left>mdi mdi-content-save</v-icon>저장</v-btn>
      <v-btn @click="goToList" style="margin-left:1rem"><v-icon left>mdi mdi-format-list-bulleted</v-icon>목록</v-btn>
    </div>

  </div>
</template>

<script>

import PolicyApi from '../../api/PolicyApi'

import rules from "@/utils/rules";
import _ from "lodash";

export default {
  components: {
  },
  props: ['id'],
  data() {
    return {
      tab: null,
      rules,
      breadcrumbs: [{
        text: '정책 정의 관리',
        disabled: false,
        href: '#'
      }, {
        text: this.$props.id ? '정책 정의 수정' : '정책 정의 등록'
      }],
      policy: {
        policyName:''
      },
      copiedPolicy: {},
    }
  },
  methods: {
    async savePolicy() {
      if (!await this.$refs.policyForm.validate())
        return;

      if (confirm("저장하시겠습니까?")) {

        PolicyApi.save(this.policy).then(result => {
          this.policy.id = result.id
          alert("저장되었습니다.")
          // this.$router.push({path: '/policies'})
        })
      }
    },
    goToList() {
      this.$router.push({path: '/policies'})
    },
    resetPolicy() {
      this.policy = _.cloneDeep(this.copiedPolicy)
    },
    deletePolicy(policy) {
      if (confirm('삭제하시겠습니까?'))
        PolicyApi.delete(policy.id).then(() => {
          this.policy = this.policy.filter(r => r !== policy)
          alert("삭제되었습니다.")
          this.$router.push({path: '/policies'})
        })
    }

  },
  created() {
    if (this.id) {
      PolicyApi.findPolicyById(this.id).then(result => {
        // console.log(result)
        this.policy = result;
        // console.log(this.policy)
        this.copiedPolicy = _.cloneDeep(this.policy)

      })
    }
  }


};
</script>
