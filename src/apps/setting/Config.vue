<template>
  <div class="flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">설정 관리</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
      <v-spacer></v-spacer>

      <v-btn @click="reset">
        <v-icon left>mdi mdi-reload</v-icon>
        리셋
      </v-btn>
      <v-btn @click="save" color="indigo" style="margin-left: 1rem" dark>
        <v-icon left>mdi mdi-content-save</v-icon>
        저장
      </v-btn>
    </div>

    <v-card>
      <v-card-text>

        <v-form ref="formSite">

          <v-col>
            일반 설정 1 <v-icon x-small>fa fa-asterisk</v-icon>
            <div style="padding-left: 22px">
              <v-textarea v-model="configs.custom1" label="" dense flat clearable :rules="[rules.common.required]" />
            </div>
          </v-col>
        </v-form>

      </v-card-text>
    </v-card>

    <div class="d-flex align-center py-3">
      <v-spacer></v-spacer>

      <v-btn @click="reset">
        <v-icon left>mdi mdi-reload</v-icon>
        리셋
      </v-btn>
      <v-btn @click="save" color="indigo" style="margin-left: 1rem" dark>
        <v-icon left>mdi mdi-content-save</v-icon>
        저장
      </v-btn>
    </div>
  </div>
</template>

<script>
import settingApi from "@/api/SettingApi";
import rules from "@/utils/rules";

export default {
  name: "Settings",
  components: {
  },
  props: {
    id: String
  },
  data: () => ({
    breadcrumbs: [
    ],
    configs: {
      reportCommentTemplate: null,
      violation: {},
      reporting: false,
      ums: {}
    },
    rules
    // rules: {
    //   required: value => !!value || '필수 입력 항목입니다..'
    // },
  }),
  computed: {
  },
  watch: {
  },
  methods: {
    async save() {

      if (!await this.$refs.formSite.validate())
        return;

      settingApi.saveConfig(this.configs).then(data => {
        if (data) {
          alert("저장되었습니다.");
        } else {
          alert("Error");
        }
      });
    },
    reset() {
      settingApi.getConfig().then(data => {
        this.configs = data;
      });
    }


  },
  async created() {
    this.$store.commit('setParams', {})
    this.configs = await settingApi.getConfig();
    // console.log(this.configs)
  }
}
</script>
