<template>
  <div class="flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">시스템 환경 설정</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2" :key="tab"></v-breadcrumbs>
      </div>
      <v-spacer></v-spacer>

      <v-btn @click="reset">
        <v-icon left>mdi mdi-reload</v-icon>
        리셋
      </v-btn>
      <v-btn @click="saveSite" color="indigo" style="margin-left: 1rem" dark>
        <v-icon left>mdi mdi-content-save</v-icon>
        저장
      </v-btn>
    </div>

    <v-tabs v-model="tab" :show-arrows="false" background-color="transparent">

      <v-tab href="#tab-1">
        <v-icon>mdi-home-edit</v-icon>
        사이트 설정
      </v-tab>

      <v-tab href="#tab-2">
        <v-icon>mdi-toolbox-outline</v-icon>
        메일 서비스 설정
      </v-tab>

      <v-tab href="#tab-3">
        <v-icon>mdi-link</v-icon>
        연계 서비스 설정
      </v-tab>

    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item value="tab-1" key="1">
        <v-card>
          <v-card-text>

            <v-form ref="formSite">

            <v-col>
              사이트 이름 <v-icon x-small>fa fa-asterisk</v-icon>
              <div style="padding-left: 22px">
                <v-text-field v-model="settings.site.name" label="" dense flat clearable :rules="[rules.required]"/>
              </div>
            </v-col>
            <v-col>대표 연락처 <v-icon x-small>fa fa-asterisk</v-icon>
              <div style="padding-left: 22px">
                  <v-text-field v-model="settings.site.tel" label="" dense flat clearable :rules="[rules.required]"/>
              </div>
            </v-col>
            <v-col>FAX <v-icon x-small>fa fa-asterisk</v-icon>
              <div style="padding-left: 22px">
                  <v-text-field v-model="settings.site.fax" label="" dense flat clearable :rules="[rules.required]"/>
              </div>
            </v-col>
            <v-col>대표 EMAIL <v-icon x-small>fa fa-asterisk</v-icon>
              <div style="padding-left: 22px">
                  <v-text-field v-model="settings.site.email" label="" dense flat clearable :rules="[rules.required]"/>
              </div>
            </v-col>

            <v-col>신규 회원 역할 <v-icon x-small>fa fa-asterisk</v-icon>
                <v-col sm="3">
                  <v-select :items="userRoleItems" item-value="id" item-text="roleName" v-model="settings.user.role"
                            dense clearable outlined flat required
                            label="선택"
                            :rules="[rules.required]"
                  />

                </v-col>
            </v-col>
            <v-col>회원 가입 기본 상태 <v-icon x-small>fa fa-asterisk</v-icon>
              <div style="padding-left: 22px">
                <v-radio-group v-model="settings.user.state" row>
                  <v-radio v-for="(t) in userStateItems" :key="t.value" :value="t.value" :label="t.text" hide-details :rules="[rules.required]"></v-radio>
                </v-radio-group>
              </div>
            </v-col>
            <v-col>주소
              <div style="padding-left: 22px">
                <v-col class="mgr d-flex">
                  <v-text-field type="number" v-model="settings.site.zipCode" label="우편번호"
                                @click="openZipCode"
                                v-on:keyup.13="openZipCode"
                                maxlength="6"
                                :rules="[
                                        value => !value || (value.length >= 5 && value.length <= 6) || '우편번호 형식이 아닙니다.\n\r5~6자리 숫자로 입력해주세요.'
                                        ]"/>
                  <v-text-field v-model="settings.site.address" label="주소" />
                </v-col>
                <v-col>
                  <v-text-field v-model="settings.site.addressDetail" label="주소상세"></v-text-field>
                </v-col>
                <v-dialog v-model="daumDialogVisible" max-width="500px" @click:outside="daumDialogVisible=false" @keydown.esc="daumDialogVisible=false">
                  <daum-post @complete="completeZipCode" />
                </v-dialog>
              </div>
            </v-col>
<!--              <dt class="formInfoTxt">주소 미리보기</dt>-->
<!--              <dd class="formInfoArea">-->
<!--                <v-col class="mgr" sm="6" v-if="settings.site.lon && geos && geos.length > 1">-->
<!--                  <v-select :items="geos"-->
<!--                            v-model="geo"-->
<!--                            return-object-->
<!--                            label="검색결과" item-text="roadAddress"-->
<!--                            dense solo flat clearable-->
<!--                            outlined-->
<!--                            @change="setGeo"-->
<!--                  />-->
<!--                </v-col>-->
<!--                <v-col class="mgr" sm="6" v-if="settings.site.lon">-->
<!--                  <img :src="`https://naveropenapi.apigw.ntruss.com/map-static/v2/raster-cors?w=300&h=300&center=${ settings.site.lon },${ settings.site.lat }&markers=markers=type:d|size:mid|pos:${ settings.site.lon }%20${ settings.site.lat }&level=16&X-NCP-APIGW-API-KEY-ID=${ ncpApiKey }`">-->
<!--                </v-col>-->
<!--                <v-col v-else-if="!settings.site.lon && settings.site.address" e>좌표를 찾을 수 없습니다.</v-col>-->

          </v-form>

          </v-card-text>
<!--          <v-card-actions class="justify-end">-->
<!--            <v-spacer></v-spacer>-->
<!--            <v-btn class="vBtn" color="#1991eb" dark @click="saveSite">-->
<!--              <v-icon left>mdi mdi-content-save</v-icon>-->
<!--              저장-->
<!--            </v-btn>-->
<!--            <v-btn class="vBtn" color="grey" dark @click="reset">-->
<!--              <v-icon left>mdi mdi-reload</v-icon>-->
<!--              취소-->
<!--            </v-btn>-->
<!--          </v-card-actions>-->
        </v-card>
      </v-tab-item>

      <v-tab-item value="tab-2" key="2">
        <v-card>
          <v-card-text>
            <v-form ref="formSmtp">

              <v-col>발송 EMAIL 주소 <v-icon x-small>fa fa-asterisk</v-icon>
                <div style="padding-left: 22px">
                  <v-text-field v-model="settings.site.systemEmail" label="" dense flat clearable :rules="[rules.required]"/>
                </div>
              </v-col>

              <v-col>메일계정 <v-icon x-small>fa fa-asterisk</v-icon>
                <div style="padding-left: 22px">
                    <v-text-field v-model="settings.smtp.username" label="" dense flat clearable :rules="[rules.required]"/>
                </div>
              </v-col>
              <v-col>패스워드 <v-icon x-small>fa fa-asterisk</v-icon>
                <div style="padding-left: 22px">
                    <v-text-field v-model="settings.smtp.password" label="" dense flat clearable :rules="[rules.required]"/>
                </div>
              </v-col>

              <v-col>SMTP 주소 <v-icon x-small>fa fa-asterisk</v-icon>
                <div style="padding-left: 22px">
                    <v-text-field v-model="settings.smtp.host" label="" dense flat clearable :rules="[rules.required]"/>
                </div>
              </v-col>

              <v-col>포트 <v-icon x-small>fa fa-asterisk</v-icon>
                <div style="padding-left: 22px">
                    <v-text-field v-model="settings.smtp.port" label="" dense flat clearable :rules="[rules.required]"/>
                </div>
              </v-col>

            </v-form>
          </v-card-text>
<!--          <v-card-actions class="justify-end">-->
<!--            <v-spacer></v-spacer>-->
<!--            <v-btn class="vBtn" color="#1991eb" dark @click="saveSite">-->
<!--              <v-icon left>mdi mdi-content-save</v-icon>-->
<!--              저장-->
<!--            </v-btn>-->
<!--            <v-btn class="vBtn" color="grey" dark @click="reset">-->
<!--              <v-icon left>mdi mdi-reload</v-icon>-->
<!--              취소-->
<!--            </v-btn>-->
<!--          </v-card-actions>-->
        </v-card>
      </v-tab-item>

      <v-tab-item value="tab-3" key="3">
        <v-card>
          <v-card-text>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>

    <div class="d-flex align-center py-3">
      <v-spacer></v-spacer>

      <v-btn @click="reset">
        <v-icon left>mdi mdi-reload</v-icon>
        리셋
      </v-btn>
      <v-btn @click="saveSite" color="indigo" style="margin-left: 1rem" dark>
        <v-icon left>mdi mdi-content-save</v-icon>
        저장
      </v-btn>
    </div>
  </div>
</template>

<script>
import rules from "@/utils/rules";
import roleApi from "@/api/RoleApi";
import settingApi from "@/api/SettingApi";
import config from "@/configs";
import _ from "lodash";

export default {
  name: "Settings",
  components: {
  },
  props: {
    id: String
  },
  data: () => ({
    breadcrumbs: [
      {
        text: '고급 설정 관리',
        disabled: false,
        href: '#'
      },
      {
        text: '설정'
      }
    ],
    tab: null,
    settings: {
      user: {
      },
      group: {
      },
      site:{
      },
      smtp:{
      }
    },
    userStateItems: config.meta.user.state,
    groupStateItems: [
      {text: '승인', value: 'STATE_APPROVAL'},
      {text: '대기', value: 'STATE_REQUEST'},
      {text: '거절', value: 'STATE_DENIED'},
    ],
    userRoleItems: [],
    daumDialogVisible: false,
    rules: {
      required: value => !!value || '필수 입력 항목입니다..',
      qtZero: value => value && value > 0 || '필수 입력 항목입니다.'
    },
    startCal: false,
    endCal: false,
    postCal: false,
    imageFileUrl: null,
    endPoint: process.env.VUE_APP_ATTACH_FILE_SERVER_URL,
    fileMeta: {},
    geos:[],
    errStartTm:false,
    errEndTm:false
  }),
  computed: {
    // ncpApiKey() {
    //   return this.$store.state.config.ext.naver.staticmap.id
    // }
  },
  watch: {
    tab: {
      handler(nv) {
        this.breadcrumbs[1] = {
          text: nv === 'tab-1' ? '사이트 설정' : nv === 'tab-2' ? '사이트 메일 서비스 설정' : '연계 서비스 설정'
        }
      }
    }
  },
  methods: {
    // setGeo(item) {
    //   this.setting.site.lon = item.x
    //   this.setting.site.lat = item.y
    // },
    openZipCode() {
      this.daumDialogVisible = true;
    },
    completeZipCode(data) {
      this.settings.site.zipCode = data.zonecode
      this.settings.site.address = data.address

      // utilApi.geo(data.address).then(res => {
      //   if(res.status === 'OK') {
      //
      //     this.setting.site.lon = res.addresses[0]?.x;
      //     this.setting.site.lat = res.addresses[0]?.y;
      //     this.geos = res.addresses;
      //   }
      // });

      this.daumDialogVisible = false;
    },
    async saveSite() {

      if (!await this.$refs.formSite.validate())
        return;

      this.save();
    },
    async saveExt() {

      if (!await this.$refs.formSite.validate())
        return;

      this.save();

    },
    save() {
      settingApi.save(this.settings).then(data => {
        if (data) {
          alert("저장되었습니다.");
        } else {
          alert("Error");
        }
      });
    },
    reset() {
      settingApi.get().then(data => {
        // console.log(data)
        this.settings = data;
      });
    }


  },
  async created() {
    this.$store.commit('setParams', {})
    this.userRoleItems = (await roleApi.getRoles()).filter(d => d.activated);
    this.settings = await settingApi.get();
  }
}
</script>
