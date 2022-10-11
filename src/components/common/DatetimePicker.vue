<template>
  <v-col cols="4" sm="6" md="4">
    <v-dialog
      ref="dialog"
      v-model="dateModal"
      :return-value.sync="date"
      persistent
      width="290px"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          v-model="date"
          :label="`${label}`"
          prepend-icon="event"
          readonly
          :error-messages="`${errormsg}`"
          @blur="this.$emit('onChangeDate')"
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker v-model="date" scrollable @change="firstOk">
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="dateModal = false;">Cancel</v-btn>
        <!--<v-btn color="primary" @click="firstOk">OK</v-btn>-->
      </v-date-picker>
    </v-dialog>

    <v-dialog
      ref="dialog2"
      v-model="timeModal"
      :return-value.sync="time"
      persistent
      width="290px"
    >
      <v-time-picker
        v-if="timeModal"
        v-model="time"
        scrollable
      >
        <v-spacer></v-spacer>
        <v-btn  color="primary" @click="timeModal = false">Cancel</v-btn>
        <v-btn  color="primary" @click="secondOk">OK</v-btn>
      </v-time-picker>
    </v-dialog>
  </v-col>
</template>

<script>

import moment from "moment";

export default {
  name: "DateTimePicker",
  props: ['label','errormsg'],
  data: () => ({
    date: "",
    dateModal: false,
    time: "",
    timeModal: false,
  }),
  watch: {
    dateModal(val){
      if(val){
        this.date = "";
        this.time = "";

        this.$emit('dateClickEvent', this.date);
      }
    }
  },
  methods: {
    secondOk() {
      if(this.time == ""){
        alert('시간을 선택해주세요.')
      }else {
        this.date = this.date + " " + this.time;
        this.$refs.dialog.save(this.date);
        this.$refs.dialog2.save(this.time);

        this.$emit('dateClickEvent', this.date);
      }
    },
    firstOk(){
      if(this.date == "") {
        this.date = new Date().toISOString().substr(0, 10);
      }
      this.time = "";
      this.timeModal = true;
    }
  },
  created(){
    let val = this.$attrs.value.replaceAll("\"",'');
    val = val ? moment(val).format('YYYY-MM-DD HH:mm') : '';
    this.date = val;
  }
}
</script>
