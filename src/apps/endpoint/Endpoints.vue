<template>
  <div class="d-flex flex-column flex-grow-1">

    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">API 공개 관리</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
      <v-spacer></v-spacer>
      <v-btn color="red" @click="secureMapping" dark>
        <v-icon small left>mdi-lock</v-icon>
        비공개 API
      </v-btn>
      <v-btn color="indigo" @click="publicMapping" style="margin-left:1rem" dark>
        <v-icon small left>mdi-lock-open-variant</v-icon>
        공개 API
      </v-btn>
    </div>

    <v-card>
      <v-card-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          class="flex-grow-1 mr-md-2"
          label="검색"
          dense
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
        :footer-props="{showFirstLastPage: true, 'items-per-page-options' : [10,20,50,100,-1], showCurrentPage:true}"
        @click:row="(item, row) => row.select(!row.isSelected)"
        :options.sync="options"
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
        <template #footer.page-text="props">

            <v-combobox
              v-model="options.page"
              :label="`${props.pageStart}-${props.pageStop} of ${props.itemsLength} rows / ${options.page} page / total ${Math.ceil(props.itemsLength / options.itemsPerPage)} pages`"
              :items="Array.from({length: Math.ceil(props.itemsLength / options.itemsPerPage)}, (v, k) => k+1 )"
              :return-object="false"
              hide-details dense
              type="number"
              suffix="page"
            >
<!--              :value="{'value':options.page, 'text': `page ${options.page}`}"-->
<!--              @change="(v) => options.page = v ? v : 1"-->
<!--              :items="Array.from({length: Math.ceil(props.itemsLength / options.itemsPerPage)}, (v, k) => { return {'value':k+1, 'text': `page ${k+1}`} })"-->

            </v-combobox>

<!--          total {{Math.ceil(props.itemsLength / options.itemsPerPage)}} pages-->

<!--          <v-pagination-->
<!--            v-model="page"-->
<!--            :length="props.itemsLength">-->
<!--          </v-pagination>-->
        </template>
      </v-data-table>

    </v-card>

    <div class="d-flex align-center py-3">
      <v-spacer></v-spacer>
      <v-btn color="red" @click="secureMapping" dark>
        <v-icon small left>mdi-lock</v-icon>
        비공개 API
      </v-btn>
      <v-btn color="indigo" @click="publicMapping" style="margin-left:1rem" dark>
        <v-icon small left>mdi-lock-open-variant</v-icon>
        공개 API
      </v-btn>
    </div>

  </div>
</template>

<script>
import EndpointApi from '../../api/EndpointApi';
import rules from "@/utils/rules";

export default {
  data() {
    return {
      breadcrumbs: [{
        text: 'API 공개 관리',
        disabled: false,
        href: '#'
      }, {
        text: 'API 목록'
      }],

      search: '',
      headers: [
        {text: '공개', value: 'isPublic', align: 'center'},
        {text: 'uri', value: 'uri', align: 'left'},
        {text: 'http method', value: 'httpMethod', align: 'left'},
        {text: 'api title', value: 'operationDescription', align: 'left'},
        {text: 'resource title', value: 'resourceDescription', align: 'left'}
      ],
      selected: [],
      endpoints: [],
      param: {
        page: 1,
        size: 10
      },
      options:{},
      currentPage:{'value':1, 'text':'page 1'},
      totalCount: null,
      dialog: false,
      rules
    }
  },
  methods: {
    async publicChange(item) {
      // if (confirm((item.isPublic ? '공개로' : '비공개로') + " 전환 하시겠습니까?")) {
        await EndpointApi.changePublicEndpoint(item)
      // } else {
      //   item.isPublic = !item.isPublic
      // }
    },
    async getEndpoints() {

      await Promise.all([EndpointApi.getPublicEndpoints(), EndpointApi.getEndpoints()])
        .then(([ps, endpoints]) => {
          const publicEndpoints = ps.map(p => p.endpoint);
          this.endpoints = endpoints.map(ele => {
            ele.isPublic = !!publicEndpoints.find(pe => pe.uri === ele.uri && pe.httpMethod === ele.httpMethod);
            ele.itemKey = ele.uri + '_' + ele.httpMethod
            return ele;
          });
          // this.totalCount = endpoints.length;
      })

    },
    secureMapping() {
      if (this.selected && this.selected.length > 0) {

        if (confirm("비공개 전환 하시겠습니까?")) {
          EndpointApi.deletePublicEndpoints(this.selected).then(() => {

            this.endpoints.forEach(e => {
              if(this.selected.includes(e))
                e.isPublic = false
            })

          })
        }

      } else
        alert("API 를 선택해주세요.")
    },
    publicMapping() {
      if (this.selected && this.selected.length > 0) {
        if (confirm("공개 전환 하시겠습니까?")) {
          EndpointApi.savePublicEndpoint(this.selected).then(() => {
            this.endpoints.forEach(e => {
              if(this.selected.includes(e))
                e.isPublic = true
            })
          })
        }
      } else
        alert("API 를 선택해주세요.")
    },

  },
  created() {
    this.$store.commit('setParams', {})
    this.getEndpoints();
  }

};
</script>
