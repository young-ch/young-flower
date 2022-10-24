<template>
  <section>
    <div class="mobileBX">
      <div class="bxLine">
        <div class="bxBg">
          <v-col class="mgb">
            <v-text-field label="" placeholder="제목을 입력하세요.(30byte)" v-model="send.subject"
                          dense solo flat outlined
                          clearable
                          maxlength="30"
            />
          </v-col>
          <v-col class="textAreaH">
            <v-textarea
                counter="2000"
                label="내용"
                v-model="send.content"
                placeholder="SMS 90bytes 메시지, LSM 2000bytes 메시지"
                value=""
                :hint="send.content.length < 90 ? 'SMS' : 'LMS' "
                flat
                solo
                outlined
                ref="sendInput"
            />
          </v-col>
<!--          <span class="d-flex justify-end">{{ send.messageLength }}</span>-->
          <v-col class="mgb">
            <v-btn color="#666" small depressed dark @click="selectFullName">회원명 치환 문자 입력</v-btn>
          </v-col>
          <div class="smsDetailInfo checkSt mgb2">
            <v-radio-group class="formInRadio" v-model="send.sendType" :mandatory="true" @change="changeSendType" row>
              <!-- <v-radio label="PUSH 전송" value="PUSH"/>
              <v-radio label="PUSH 전송 실패시 SMS 전송" value="PUSH_SMS"/> -->
              <v-radio label="SMS 전송" value="SMS"/>
              <v-radio label="SMS 예약 전송" value="SMS_RESERVATION"/>
            </v-radio-group>
            <!-- <dl class="d-flex align-center">
                <dt class="dt mgr">PUSH LINK</dt>
                <dd>
                    <v-text-field label="" placeholder="" v-model="send.pushLink" dense solo  flat outlined :disabled="pushLinkDisabled"/>
                </dd>
            </dl> -->
            <dl class="d-flex align-center">
              <dt class="dt mgr">예약 날짜</dt>
              <dd>
                <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    :return-value.sync="date"
                    transition="scale-transition"
                    offset-y
                    min-width="250px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="reservationDate"
                        :label="reservationDate"
                        prepend-icon="event"
                        readonly
                        solo
                        dense
                        flat
                        outlined
                        v-bind="attrs"
                        v-on="on"
                        :disabled="reservation"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="reservationDate" @input="menu = false" no-title scrollable/>
                </v-menu>
              </dd>
            </dl>
            <dl class="d-flex align-center">
              <dt class="dt mgr">예약 시간</dt>
              <dd class="d-flex select">
                <v-img style="padding-right: 8px"><v-icon>mdi-clock-outline</v-icon></v-img>
                <vue-timepicker
                    v-model="send.reserveTime"
                    manual-input :input-class="errReserveTm ? 'invalid' : ''"
                    auto-scroll
                    :disabled="reservation"
                    hour-label="시"
                    minute-label="분"
                />
                <!--                  placeholder="00시:00분"-->
                <!--                  :minute-interval="10"-->

                <!--                  <v-select class="mgr" :items="hourList" v-model="hour" :disabled="reservation" label="00시" dense solo-->
                <!--                            flat-->
                <!--                            outlined/>-->
                <!--                  <v-select class="mgr" :items="minuteList" v-model="minute" :disabled="reservation" label="00분" dense-->
                <!--                            solo flat-->
                <!--                            outlined/>-->
              </dd>
            </dl>
          </div>
          <div class="checkSt">
            <v-col class="d-flex justify-center">
              <v-btn color="primary" depressed block dark @click="sendMessage">
                <v-icon></v-icon>
                문자보내기
              </v-btn>
            </v-col>

          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import smsApi from "@/api/SmsApi";

import VueTimepicker from 'vue2-timepicker'
import 'vue2-timepicker/dist/VueTimepicker.css'

export default {
  name: "MobileComponent",
  components: {
    VueTimepicker
  },
  props: {
    allSelected: {
      type: Boolean,
      default: false
    },
    param: {
      type: Object,
      default: function(){
        return {}
      }
    },
    selected: {
      type: Array,
      default: function(){
        return []
      }
    },
    includeMobileList: {
      type: Array,
      default: function(){
        return []
      }
    },
    templateData: {
      type: Object,
    },
    defaultMessage: {
      type: String,
      default: null
    },
    defaultTitle: {
      type: String,
      default: null
    },
    groupId: String,
    from: {
      type: String,
      default: null
    }
  },
  watch: {
    defaultMessage: {
      handler(nv) {
        this.send.content = nv
      },
      deep:true
    },
    defaultTitle: {
      handler(nv) {
        this.send.subject = nv
      },
      deep:true
    },
    templateData: {
      handler(nv) {
        this.send.templateId = nv.templateId;
        this.send.subject = nv.subject;
        this.send.content = nv.content??'';
        this.$refs.sendInput.focus();
      },
      deep:true
    }
  },
  data: () => ({
    send: {
      subject: null,
      content: '',
      sendType: "SMS",
      pushLink: "http://",
      reservationAt: null,
      sendUserIdList: [],
      allSelected: false,
      searchParam: {},
      messageLength: "(SMS 0/90)",
      reserveTime:"00:00",
      includeMobileList: []
    },
    pushLinkDisabled: true,
    reservation: true,
    reservationDate: null,
    errReserveTm:false,
    date: new Date().toISOString().substr(0, 10),
    menu: false
  }),
  methods: {
    selectFullName() {
      this.send.content = this.send.content + "{NAME}";
    },
    changeSendType() {
      let sendType = this.send.sendType;
      if (sendType === "SMS") {
        this.pushLinkDisabled = true;
        this.reservation = true;
      } else if (sendType === "SMS_RESERVATION") {
        this.pushLinkDisabled = true;
        this.reservation = false;
      } else {
        this.pushLinkDisabled = false;
        this.reservation = true;
      }
    },
    sendMessage() {

      if (this.send.subject == null || this.send.subject === "") {
        alert("제목을 입력하세요.");
        return;
      }

      if (this.send.content == null || this.send.content === "") {
        alert("내용을 입력하세요.");
        return;
      }

      this.send.includeMobileList = this.includeMobileList;

      if (this.send.sendType === "SMS_RESERVATION") {
        // let reservationAt = this.reservationDate;

        // let hour = this.hour??'00';
        // let min = this.minute??'00';

        // send.reservationAt = reservationAt.replace(/-/g, '') + hour + min;

        this.send.reservationAt = `${this.reservationDate} ${this.send.reserveTime}`

        let nowDate = this.$moment();
        let reserveDate = this.$moment(this.send.reservationAt, 'YYYY-MM-DD HH:mm');

        if (this.$moment.duration(reserveDate.diff(nowDate)).asMinutes() < 10) {
          alert("예약시간을 수정해주세요. 10분 이내로 예약하실 수 없습니다.");
          return;
        }
      }

      if (this.allSelected) {
        let searchParam = {...this.param};
        searchParam.searchIncludeUsers = this.searchIncludeUsers?.map(o => o.userId)??null;
        searchParam.searchExcludeUsers = this.searchExcludeUsers?.map(o => o.userId)??null;
        searchParam.searchSmsReceive = (this.param.searchSmsReceive === true || this.param.searchSmsReceive === false) ? this.param.searchSmsReceive : null;

        this.send.searchParam = searchParam;
        this.send.allSelected = this.allSelected;

      } else {

        if ((this.selected??[]).length === 0 && (this.send?.includeMobileList?? []).length === 0) {
          alert("발송하실 회원을 선택해주세요.");
          return;
        }

        // this.send.sendUserIdList = this.selected.map(u => u.userId);
        this.send.sendUserList = this.selected.map(u => {
          u.userHasRoles = null;
          u.userHasGroups = null;
          return u
        });
      }

      // console.log(this.send);

      this.send.groupId = this.groupId;
      if(this.from && this.from === 'present')
        this.send.present = true;

      smsApi.sendMessage(this.send).then(data => {
        if (data) alert("발송되었습니다.");
        this.$emit('callback-event', true);
      }).catch(err => {
        // console.log(err.response);
        alert(err.response.data.message)
      });
    }
  },
  created() {
    this.reservationDate = this.$moment().format('YYYY-MM-DD');
    this.send.reserveTime = this.$moment().add('minute', 15).format('HH:mm');
    this.send.content = this.defaultMessage??''
    this.send.subject = this.defaultTitle
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/style/layout/variables';

  .mobileBX {
    width: 300px;

    .bxLine {
      position: relative;
      padding: 34px 10px;
      border: 1px solid #dcdee3;
      border-radius: 30px;
      box-shadow: 0 3px 6px #eee;

      &::before {
        content: '';
        position: absolute;
        top: 15px;
        left: 120px;
        width: 135px;
        height: 15px;
        background: url('~@/assets/images/common/bg_sms_phone02.png') no-repeat;
      }

      .bxBg {
        padding: 20px 15px;
        background: #f8f8fa;
        font-size: 12px;
        font-family: 'dotum', sans-serif;

        .smsDetailInfo {
          padding: 14px 10px;
          border-radius: 4px;
          border: 1px solid rgba(0, 0, 0, 0.38);
          background: #fff;

          dl {
            margin-bottom: 8px;

            &:last-child {
              margin-bottom: 0;
            }

            dt {
              flex: 0 0 62px;
              width: 62px;
            }
          }
        }

        .select {
          .mgr {
            margin-right: 4px !important;
          }
        }

      }
    }


  }
</style>
<style scoped>
.textAreaH >>> .v-text-field__details {
  display: flex !important;
}
.textAreaH >>> .v-messages {
  width:45%;
  max-width: 45%;
  flex-basis:45%;
  text-align: left;
  display: block !important;
}
.textAreaH >>> .v-counter {
  width:45%;
  max-width: 45%;
  flex-basis:45%;
  text-align: right;
}
.textAreaH >>> .v-text-field__details {
  /*display: block !important;*/
  flex-wrap:wrap;
  justify-content: center;
}
</style>