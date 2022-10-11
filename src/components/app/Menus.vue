<template>
  <div class="d-flex flex-column flex-grow-1">
    <v-card>
      <v-card-title>
        <v-switch
          v-model="searchSelected"
          :label="searchSelected ? '선택 메뉴' : '전체 메뉴'"
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

<!--      <v-treeview-->
<!--        v-model="selected"-->
<!--        :items="menus"-->
<!--        :search="search"-->
<!--        selection-type="independent"-->
<!--        selectable-->
<!--        return-object-->
<!--        open-all-->
<!--      ></v-treeview>-->

      <v-data-table
        v-model="selected"
        :search="search"
        :headers="headers"
        :items="menus"
        show-select
        item-key="id"
        class="elevation-1"
        sortable="false"
        :options.sync="options"
        :footer-props="{showFirstLastPage: true, 'items-per-page-options' : [5,10,20,50,100,-1]}"
        @click:row="(item, row) => row.select(!row.isSelected)"
      >
        <template v-slot:item.menuName="{ item, value }">
          <div :style="`padding-left: ${(item.depth-1)*30}px`">{{ value }}</div>
        </template>
        <template v-slot:item.createdAt="{ value }">
          <div>{{ value | formatDate('YYYY-MM-DD HH:mm:ss') }}</div>
        </template>
      </v-data-table>

    </v-card>
  </div>
</template>

<script>
import menuApi from '@/api/MenuApi';
import _ from "lodash";

export default {
  props: {
    headers: {
      type: Array,
      default: () => ([
        {text: '메뉴명', value: 'menuName', align: 'left'},
        {text: '접근제어', value: 'isPublicText', align: 'left'},
        {text: '사용여부', value: 'isActivatedText', align: 'left'},
        {text: '메뉴타입', value: 'menuTypeText', align: 'left'},
        {text: '생성일', value: 'createdAt', align: 'left'},
        // {text: '연결프로그램', value: 'connectedProgram', align: 'left'}
      ])
    },
    selectedMenu: {
      type: Array
    },
    category: {
      type: String,
      default: 'HOME'
    }
  },
  watch: {
    // selectedMenu: {
    //   handler(nv) {
    //     this.selected = nv.map(v => {
    //       return Object.assign(v, {'id' : v.menuId})
    //     })??[]
    //     // console.log(nv)
    //   }
    // },
    searchSelected: {
      handler(nv) {
        console.log(nv)
        if(nv) {
          this.copiedMenus = _.cloneDeep(this.menus)
          this.menus = this.menus.filter(e => this.selected.map(s => s.id).includes(e.id))
        } else {
          this.menus = _.cloneDeep(this.copiedMenus)
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
        itemsPerPage: -1
      },
      selected: [],
      menus: [],
      copiedMenus: [],
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
    async findMenus() {

      if(!this.init) {
        this.selected = this.selectedMenu.map(v => {
          return Object.assign(v, {'id': v.menuId})
        }) ?? []
        this.init = true
      }

      menuApi.findMenusByCategory(this.category).then(result => {

        const flatMenus = (result, depth) => {
          let children = [];
          result.forEach(m => {
            m.depth = depth
            children = children.concat(m, m.childMenus ? flatMenus(m.childMenus, depth+1) : [])
          });
          return children
        };

        const temp = flatMenus(result, 1);

        this.menus = temp.map(ele => {
          // ele.isPublic = !!publicMenus.find(pe => pe.uri === ele.uri && pe.httpMethod === ele.httpMethod);
          // ele.name = ele.menuName
          ele.isPublicText = ele.isPublic ?'공개':'비공개'
          ele.isActivatedText = ele.activated ? '사용' : '사용안함'
          ele.menuTypeText = ele.menuType === 'TYPE_LINK' ? "링크" : ele.menuType === 'TYPE_BOARD' ? "게시판" : "컨텐츠"

          return ele;
        });
      })

    }
  },
  created() {
    this.findMenus();
  }

};
</script>
