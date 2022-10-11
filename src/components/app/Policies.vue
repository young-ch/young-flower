<template>
  <div class="d-flex flex-column flex-grow-1">
    <v-card>
      <v-card-title>
        <v-switch
          v-model="searchSelected"
          :label="searchSelected ? '선택 정책' : '전체 정책'"
          flat
        >
        </v-switch>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="전체 검색"
          single-line
          hide-details
          clearable
        ></v-text-field>
      </v-card-title>

      <v-data-table
        v-model="selected"
        :search="search"
        :headers="headers"
        :items="policies"
        show-select
        item-key="id"
        class="elevation-1"
        sortable="false"
        :options.sync="options"
        :footer-props="{showFirstLastPage: true, 'items-per-page-options' : [5,10,20,50,100,-1]}"
        @click:row="(item, row) => row.select(!row.isSelected)"
      >
      </v-data-table>

    </v-card>
  </div>
</template>

<script>
import policyApi from '@/api/PolicyApi';
import _ from "lodash";

export default {
  props: {
    headers: {
      type: Array,
      default: () => ([
        {text: '정책 그룹 코드', value: 'policyGroupCode', align: 'left'},
        {text: '정책 코드', value: 'policyCode', align: 'left'},
        {text: '정책 명', value: 'policyName', align: 'left'}
      ])
    },
    selectedPolicy: {
      type: Array
    }
  },
  watch: {
    searchSelected: {
      handler(nv) {
        console.log(nv)
        if(nv) {
          this.copiedPolicies = _.cloneDeep(this.policies)
          this.policies = this.policies.filter(e => this.selected.map(s => s.id).includes(e.id))
        } else {
          this.policies = _.cloneDeep(this.copiedPolicies)
        }
      }
    }
  },
  data() {
    return {
      searchSelected: false,
      search: '',
      // headers: ,
      options: {
        page: 1,
        itemsPerPage: 5
      },
      selected: [],
      policies: [],
      copiedPolicies: [],
      totalCount: null,
      rules: {
      },
      init: false
    }
  },
  methods: {
    saveEvent() {
      this.$emit('callback-save-event', this.selected);
    },
    async findPolicies() {

      if(!this.init) {
        this.selected = this.selectedPolicy.map(v => {
          return Object.assign(v, {'id': v.id})
        }) ?? []
        this.init = true
      }

      policyApi.findPolicies().then(result => {

        this.policies = result.content.map(ele => {
          return ele;
        });
      })

    }
  },
  created() {
    this.findPolicies();
  }

};
</script>
