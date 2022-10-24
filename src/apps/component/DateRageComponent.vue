<template>
  <section>
  <v-menu
      v-model="searchDateMenu"
      :close-on-content-click="false"
      :nudge-right="40"
      transition="scale-transition"
      offset-y
      min-width="120px"
      v-bind:disabled="disable"
  >
<!--    :disabled="meta.meta_key === undefined"-->
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
          v-model="searchDate"
          v-bind:label="label"
          prepend-icon="event"
          readonly
          v-bind="attrs"
          v-on="on"
          dense clearable flat
          :outlined="outline"
          @click:clear="clearDatePicker"
          :rules="rules"
      ></v-text-field>
    </template>
    <v-date-picker v-model="searchDateList" locale="ko" range @input="closeDatePicker"></v-date-picker>
  </v-menu>

  </section>
</template>

<script>
import moment from 'moment';
export default {
  name: "DateRageComponent",
  props: {
    value:Array,
    label: {
      type: String,
      default: '기간검색'
    },
    disable: {
      type: Boolean,
      default: false
    },
    startEndDate:Array,
    rules:Array,
    outline:{
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    searchDateMenu: false,
    searchDateList:[],
  }),
  watch: {
    startEndDate: function (startEndDate) {
      this.searchDateList = startEndDate.map(d => moment(d, 'YYYYMMDDHHmmss').format('YYYY-MM-DD'));
    },
    value: function(nv) {
      this.searchDateList = nv?.map(v => {
        // v = moment(v, 'YYYY-MM-DD').format('YYYY-MM-DD');
        return v;
      })??[];
    }
  },
  computed: {
    searchDate: {
      get() {
        // alert(this.searchDate);
        // setTimeout(() => this.searchDateMenu = false, 0)

        // console.log(this.searchDate);
        let temp = this.searchDateList?.map(value => value);
        temp?.sort();
        return temp?.join(' ~ ')??''
      },
      set() {
        this.searchDateList = [];
      }
    }
  },
  methods: {
    clearDatePicker() {
      this.searchDateList = [];
      this.$emit('input', this.searchDateList);
      this.$emit('event', this.searchDateList);
      // this.getLoadList()
    },
    closeDatePicker() {
      if(this.searchDateList.length === 2) {
        this.searchDateList.sort();
        this.searchDateMenu = false;
        // this.$emit('event', this.searchDateList);
      }

      this.$emit('input', this.searchDateList);
      this.$emit('event', this.searchDateList);
      // this.getLoadList()
    }
  },
  created() {
    // console.log(this.startDate)
    // console.log(this.endDate)
    // this.searchDateList = [];

    this.searchDateList = this.value?.map(v => {
      if(v.length === 14)
        v = moment(v, 'YYYYMMDDHHmmss').format('YYYY-MM-DD')
      return v;
    })??[];

  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/style/layout/variables';
</style>