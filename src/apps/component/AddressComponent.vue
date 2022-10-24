<template>
  <section>
    <v-autocomplete :items="searchedList"
                    item-text="jibunAddress"
                    dense clearable flat
                    outlined required return-object
                    :label="label"
                    :rules="formRules"
                    :search-input.sync="searchAddress"
                    v-on:keyup.13="searchFn"
                    v-on:change="changeFn"
                    :filter="addressFilter"

    />

  </section>
</template>

<script>
import addressApi from "@/api/address";

export default {
  name: "AddressListComponent",
  props: {
    label: {
      type: String,
      default: '주소검색'
    },
    code: {
      type: Object
    },
    rules: Array,
    formFlag: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    searchedList: [],
    searchAddress: {address:"-"},
    formRules: this?.rules??[]
  }),
  watch: {
    searchAddress (val) {
      this.searchAddress = val
    }
  },
  methods: {
    searchFn() {
      // console.log(this.searchAddress);
      addressApi.search(this.searchAddress).then(result => {

        console.log(result.addresses);
        if(result && result.addresses && result.addresses.length > 0) {

          this.searchedList = result.addresses;
          // roadAddress
          // jibunAddress
          // x
          // y

        }

        console.log(result);
      });
    },
    changeFn() {

      if(!this?.formFlag??false) {
        this.$emit('event', this.searchAddress?.code??'');
      } else {
        this.$emit('event', this.searchAddress);
      }

    },
    addressFilter(item, queryText) {

      const searchText = queryText.toLowerCase();
      const roadAddress = item.roadAddress.toLowerCase();
      const jibunAddress = item.jibunAddress.toLowerCase();

      return roadAddress.indexOf(searchText) > -1 ||
          jibunAddress.indexOf(searchText) > -1

    }
  },
  created() {
    this.searchAddress = this?.code;
    this.formRules =  this?.rules??[];

  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/style/layout/variables';
</style>