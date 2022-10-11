<template>
  <div class="d-flex flex-column flex-grow-1">

    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">정적 페이지 관리</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
      <v-spacer></v-spacer>
      <v-btn color="primary" to="/content/form" style="margin-right:1rem">
        <v-icon left>mdi mdi-playlist-plus</v-icon>
        정적 페이지 추가
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
        :search="search"
        :headers="headers"
        :items="contents"
        item-key="id"
        class="elevation-1"
        :sortable="true"
        :footer-props="{showFirstLastPage: true, 'items-per-page-options' : [10,20,50,100,-1], showCurrentPage:true}"
        :options.sync="options"
      >
        <template v-slot:item.title="{ item }">
          <router-link :to="{path:`/contents/${item.id}`}">{{ item.title }}</router-link>
        </template>

        <template v-slot:item.activated="{ item }">
          {{ item.activated ?'사용':'사용안함' }}
        </template>


        <template v-slot:item.createdAt="{ value }">
          <div>{{ value | formatDate('YYYY-MM-DD HH:mm:ss') }}</div>
        </template>

        <template v-slot:item.updatedAt="{ value }">
          <div>{{ value | formatDate('YYYY-MM-DD HH:mm:ss') }}</div>
        </template>

        <template v-slot:item.action="{ item }">
<!--          <v-icon-->
<!--            class="mr-2"-->
<!--            @click.stop="updateContent(item)"-->
<!--            small-->
<!--          >-->
<!--            mdi-pencil-->
<!--          </v-icon>-->
          <v-icon
            class="mr-2"
            @click.stop="deleteContent(item)"
            small
          >
            mdi-delete
          </v-icon>
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
          </v-combobox>
        </template>
      </v-data-table>
    </v-card>


    <div class="d-flex align-center py-3">
      <v-spacer></v-spacer>
      <v-btn color="primary" to="/content/form" style="margin-right:1rem">
        <v-icon left>mdi mdi-playlist-plus</v-icon>
        정적 페이지 추가
      </v-btn>
    </div>
  </div>
</template>

<script>
import ContentApi from '../../api/ContentApi';

export default {
  name: 'contents',
  data() {
    return {
      breadcrumbs: [{
        text: '정적 페이지 관리',
        disabled: false,
        href: '#'
      }, {
        text: '정적 페이지 목록'
      }],

      search: '',
      headers: [
        {text: '정적 페이지 명', value: 'title'},
        {text: '사용 여부', value: 'activated'},
        {text: '생성자', value: 'createdBy'},
        {text: '생성일', value: 'createdAt'},
        {text: '수정자', value: 'updatedBy'},
        {text: '수정일', value: 'updatedAt'},
        {text: '관리', value: 'action', sortable: false }
      ],
      selected: [],
      contents: [],
      options: {},
      totalCount: null,
      dialog: false,
      rules: {
      }
    }
  },
  watch: {
    options: {
      handler() {
        this.$store.commit('setParams', this.options);
      },
      deep: true,
    }
  },
  methods: {
    getContents(storedParams) {
      ContentApi.findContents().then(result => {
        // console.log(result)
        this.contents = result.content

        if(storedParams)
          this.options = storedParams
      })
    },
    updateContent(content) {
      this.$router.push({path : `/contents/${content.id}`})
    },
    deleteContent(content) {
      if (confirm('삭제하시겠습니까?'))

        ContentApi.delete(content.id).then(() => {
          this.contents = this.contents.filter(r => r !== content)
          alert("삭제되었습니다.")
        })
    }

  },
  created() {
    let storedParams = this.$store.getters?.params??{};

    // first load
    if(!storedParams.name || storedParams.name !== this.$options.name) {
      this.options = {
        page:1,
        itemsPerPage:10,
        name:this.$options.name
      }

      storedParams = this.options
      this.$store.commit('setParams', storedParams)

    } else {
      storedParams.name = this.$options.name
      this.options = storedParams
    }

    this.getContents(storedParams);
  }

};
</script>
