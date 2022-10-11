<template>
  <v-dialog v-model="visible" max-width="500px" @click:outside="closeDialog" @keydown.esc="closeDialog">
    <v-card>
      <v-card-title>
        <span class="headline">{{ title }}</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-form ref="formCategory">
            <v-row>
              <v-col class="wh300">
                <v-text-field :maxlength="100" v-model="category.categoryName" label="카테고리명" :rules="[rules.required]"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="wh300">
                <v-switch v-model="category.activated" label="사용여부"></v-switch>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <div class="btnStyleBx">
          <div class="btnCommon justify-center">
            <v-btn class="vBtn" color="#1991eb" dark @click="saveCategory">
              <v-icon left>mdi mdi-content-save</v-icon>
              저장
            </v-btn>
            <v-btn class="vBtn" @click="closeDialog"  style="margin-left:1rem">
              <v-icon left>mdi mdi-close</v-icon>
              취소
            </v-btn>
          </div>
        </div>
      </v-card-actions>

    </v-card>
  </v-dialog>
</template>

<script>
import _ from 'lodash';
// import moment from 'moment';

export default {
  name: "CategoryForm",
  props: {
    visible: Boolean,
    item: Object,
    meta: Object
  },
  watch: {
    item: {
      handler(nv) {
        this.category = {activated: true};
        this.$refs?.formCategory?.resetValidation();

        if(!nv || nv === {} || Object.keys(nv).length === 0) {
          this.title = `카테고리 추가`;
        } else {
          this.category = _.cloneDeep(nv);
          this.category.originName = _.cloneDeep(this.category.categoryName)
          this.title = '카테고리 수정'
        }
      }
    }
  },
  data: () => ({
    category:{},
    title:`컬럼 추가`,
    rules: {
      required: value => !!value || '필수 입력 항목입니다..'
    },
    categoryTypes: [
      {
        value: 'string',
        text: '문자열'
      },
      {
        value: 'integer',
        text: '숫자'
      }
    ]
  }),
  methods: {
    closeDialog() {
      this.$emit('callback-canceled');
    },
    async saveCategory() {
      if(!await this.$refs.formCategory.validate())
        return;

      // if(!this.category.createdAt)
      //   this.category.createdAt = moment();

      this.$emit('callback-saved', this.category);

    },
  }
}
</script>

<style scoped>

</style>
