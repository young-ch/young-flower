<template>
  <div class="d-flex flex-column flex-grow-1">


    <v-card>
      <v-card-title>
        <v-switch
          v-model="searchSelected"
          :label="searchSelected ? '선택 API' : '전체 API'"
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
        :items="endpoints"
        show-select
        item-key="itemKey"
        class="elevation-1"
        sortable="false"
        :options.sync="options"
        :footer-props="{showFirstLastPage: true, 'items-per-page-options' : [5,10,20,50,100,-1]}"
        @click:row="(item, row) => row.select(!row.isSelected)"
      >
        <template v-slot:item.isPublic="{ item }">
          <v-switch
            v-model="item.isPublic"
            flat
            @click.native.stop="publicChange(item)"
            :color="item.isPublic ? 'success' : 'error'"
          >
<!--            :label="item.isPublic ?'공개':'비공개'"-->
          </v-switch>
        </template>
        <template v-slot:item.isPublicText="{ item }">
          {{ item.isPublic ?'공개':'비공개' }}
        </template>

      </v-data-table>

<!--      <div class="text-center pt-2">-->
<!--        <v-btn-->
<!--          color="primary"-->
<!--          class="mr-2"-->
<!--          @click="saveEvent"-->
<!--        >-->
<!--          저장-->
<!--        </v-btn>-->
<!--      </div>-->
    </v-card>


  </div>
</template>

<script>
import EndpointApi from '../../api/EndpointApi';
import _ from "lodash";

export default {
  props: {
    headers: {
      type: Array,
      default: () => ([
        {text: '공개', value: 'isPublicText', align: 'center'},
        {text: 'uri', value: 'uri', align: 'left'},
        {text: 'http method', value: 'httpMethod', align: 'left'},
        {text: 'api title', value: 'operationDescription', align: 'left'},
        {text: 'resource title', value: 'resourceDescription', align: 'left'}
      ])
    },
    selectedEndpoint: {
      type: Array
    }
  },
  watch: {
    selectedEndpoint: {
      handler(nv) {
        this.selected = nv.map(v => {
          return Object.assign(v, {'itemKey' : v.uri + '_' + v.httpMethod})
        })??[]
        // console.log(nv)
      }
    },
    searchSelected: {
      handler(nv) {
        if(nv) {
          this.copiedEndpoints = _.cloneDeep(this.endpoints)
          this.endpoints = this.endpoints.filter(e => this.selected.map(s => s.itemKey).includes(e.itemKey))
        } else {
          this.endpoints = _.cloneDeep(this.copiedEndpoints)
        }
      }
    }
  },
  data() {
    return {
      breadcrumbs: [{
        text: '엔드포인트 관리',
        disabled: false,
        href: '#'
      }, {
        text: '엔드포인트 목록'
      }],
      searchSelected: false,
      search: '',
      // headers: ,
      options: {
        page: 1,
        itemsPerPage: 5
      },
      selected: [],
      endpoints: [],
      copiedEndpoints: [],
      totalCount: null,
      dialog: false,
      rules: {
      }
    }
  },
  methods: {
    saveEvent() {
      this.$emit('callback-save-event', this.selected);
    },
    async getEndpoints() {

      await Promise.all([EndpointApi.getPublicEndpoints(), EndpointApi.getEndpoints()])
        .then(([ps, endpoints]) => {
          const publicEndpoints = ps.map(p => p.endpoint);
          this.endpoints = endpoints.map(ele => {
            ele.isPublic = !!publicEndpoints.find(pe => pe.uri === ele.uri && pe.httpMethod === ele.httpMethod);
            ele.itemKey = ele.uri + '_' + ele.httpMethod
            ele.isPublicText = ele.isPublic ?'공개':'비공개'
            return ele;
          });
      })

    },

  },
  created() {
    this.getEndpoints();
  }

};
</script>
