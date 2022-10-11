<template>
  <div>
  <div class="d-flex" style="margin-bottom: 8px;">
    <v-checkbox v-for="n in weekList" :label="n.name" :value="n.idx" v-bind:key="n.idx" v-model="weekday" style="width: 100px;"></v-checkbox>
  </div>
  <div class="d-flex">
    <v-dialog
      ref="dialog2"
      v-model="timeModal1"
      :return-value.sync="time"
      persistent
      width="290px"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          v-model="startTime"
          :label="'영업 시작시간'"
          prepend-icon="event"
          readonly
          :error-messages="`${errormsg}`"
          v-on="on"
          style="padding: 0; margin-right: 40px"
        ></v-text-field>
      </template>

      <v-time-picker
        v-if="timeModal1"
        v-model="time"
        scrollable
        ampm-in-title
      >
        <v-spacer></v-spacer>
        <v-btn  color="primary" @click="timeModal1 = false">Cancel</v-btn>
        <v-btn  color="primary" @click="onClick_modal1">OK</v-btn>
      </v-time-picker>
    </v-dialog>



    <v-dialog
      ref="dialog2"
      v-model="timeModal2"
      :return-value.sync="time"
      persistent
      width="290px"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          v-model="endTime"
          :label="'영업 종료시간'"
          prepend-icon="event"
          readonly
          :error-messages="`${errormsg}`"
          v-on="on"
          style="padding: 0; margin-right: 40px"
        ></v-text-field>
      </template>

      <v-time-picker
        v-if="timeModal2"
        v-model="time"
        scrollable
        ampm-in-title
      >
        <v-spacer></v-spacer>
        <v-btn @click="timeModal2 = false">Cancel</v-btn>
        <v-btn color="primary" @click="onClick_modal2">OK</v-btn>
      </v-time-picker>
    </v-dialog>


  </div>
  <v-spacer></v-spacer>
  <v-btn color="primary" @click="onClickComplete" style="margin-right: 5px">확인</v-btn>
  <v-btn @click="onClickCancel">취소</v-btn>


  </div>
</template>

<script>
export default {
  name: "TimePicker",
  props: ['errormsg'],
  data: () => ({
    timeModal1: false,
    timeModal2: false,

    time: "",
    weekList:[{idx:0,name:'월'},{idx:1,name:'화'},{idx:2,name:'수'},{idx:3,name:'목'},{idx:4,name:'금'},{idx:5,name:'토'},{idx:6,name:'일'}],
    startTime: "",
    endTime: "",
    weekday: []
,dialog: false
  }),
  watch: {
    timeModal(val){
      if(val){
        this.time = "";

        //this.$emit('dateClickEvent', this.time);
      }
    }
  },
  methods: {
    onClick_modal1() {
      if(this.time == ""){
        alert('시간을 선택해주세요.')
      }else {
        //this.$refs.dialog2.save(this.time);
        this.startTime = this.time;
        this.timeModal1 = false;
        //this.$emit('dateClickEvent', this.time);
      }
    },
    onClick_modal2() {
      if(this.time == ""){
        alert('시간을 선택해주세요.')
      }else {
        this.endTime = this.time;
        this.timeModal2 = false;
        //this.$emit('dateClickEvent', this.time);
      }
    },
    onClickTime(){
      this.dialog=true
    },
    onClickComplete(){
      let params = [];
      if(this.weekday.length == 0){
        return alert('요일을 선택해주세요.')
      }else if(this.startTime == "" || this.endTime == ""){
        return alert('시간을 선택해주세요.')
      }

      this.weekday.forEach(d=>{
        let param = {
          'startTime':this.startTime,
          'endTime':this.endTime,
          'day':d
        };
        params.push(param);
      })


      this.$emit('completeDialog', params);
      this.resetParam();
    },
    onClickCancel(){
      this.$emit('closeDialog');
      this.resetParam();
    },
    resetParam(){
      this.startTime= "";
      this.endTime= "";
      this.weekday= []
    }
  },
  created(){
  }
}
</script>
