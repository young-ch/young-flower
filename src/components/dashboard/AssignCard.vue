<template>
  <v-card>
    <v-card-title>{{ label }}</v-card-title>
    <v-data-table
      :headers="headers"
      :items="farms"
      hide-default-footer
    >
      <template v-slot:item.id="{ item }">
        <div class="font-weight-bold"># <copy-label :text="item.id" /></div>
      </template>

      <template v-slot:item.farmName="{value, item}">
        <a @click.stop="onRowClick(item)">
          {{ value }}
        </a>
      </template>

      <template v-slot:item.species="{ value }">
        <div>{{ getSpeciesName(value) }}</div>
      </template>

    </v-data-table>
  </v-card>
</template>

<script>
import CopyLabel from '../common/CopyLabel'
import FarmApi from "@/api/FarmApi";

export default {
  components: {
    CopyLabel
  },
  props: {
    label: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      headers: [
        { text: '조사원명', align: 'start', value: 'inspectorName' },
        {text: '축종', value: 'species'},
        {
          text: '지역',
          sortable: false,
          value: 'area'
        },
        { text: '농가명', value: 'farmName' }
      ],
      farms:[],
      totalItems:0,
      // items: [
      //   {
      //     title: '홍길순',
      //     area: '대전',
      //     name: '테스트1'
      //   },
      //   {
      //     title: '홍길동',
      //     area: '세종',
      //     name: '테스트2'
      //   },
      //   {
      //     title: '홍길순',
      //     area: '대전',
      //     name: '테스트3'
      //   },
      //   {
      //     title: '홍길동',
      //     area: '세종',
      //     name: '테스트4'
      //   },
      //
      // ]
    }
  },
  methods: {
    getSpeciesName(s) {
      switch (s) {
        case 'TYPE_POULTRY' : return '닭·오리'
        case 'TYPE_PIG' : return '양돈'
        case 'TYPE_DAIRY_CATTLE' : return '젖소'
        case 'TYPE_KOREA_CATTLE' : return '한우'
      }
    },
    onRowClick(item) {
      this.$router.push({path:`/farms/detail/${item.id}`});
    },
    getFarms() {
      const params = {
        page:1,
        itemsPerPage:5,
        searchSpecies:null,
        searchKeyword:null,
        searchAssigned:true,
        name:this.$options.name
      }

      FarmApi.findAll(params).then(data => {
        this.totalItems = data.totalElements;
        this.farms = data.content.map((a, i) => {
          a.idx = this.totalItems - i;

          if(a.address) {
            const addrs = a.address.split(" ")
            a.area = addrs[0];
          }
          if(a.species) {

            switch (a.species) {
              case 'TYPE_POULTRY' : a.speciesKor = '닭·오리'; break
              case 'TYPE_KOREA_CATTLE' : a.speciesKor = '한우'; break
              case 'TYPE_DAIRY_CATTLE' : a.speciesKor = '젖소'; break
              case 'TYPE_PIG' : a.speciesKor = '돼지'; break
            }
          }

          return a;
        });

      })
    },
  },
  created() {
    this.getFarms()
  }
}
</script>
