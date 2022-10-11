<template>
  <v-card>
    <v-card-title>{{ label }}</v-card-title>
    <v-data-table
      :headers="headers"
      :items="articles"
      hide-default-footer
    >

      <template v-slot:item.no="{item}">
        <template v-if="item.notice">
          공지
        </template>
        <template v-else>
          {{item.idx}}
        </template>
      </template>


      <template v-slot:item.id="{ item }">
        <div class="font-weight-bold"># <copy-label :text="item.id" /></div>
      </template>

      <template v-slot:item.title="{value, item}">
        <a @click.stop="onRowClick(item)">
          {{ value }}
        </a>
      </template>

      <template v-slot:item.createdAt="{ value }">
        {{ value | formatDate('YYYY-MM-DD HH:mm:ss') }}
      </template>

    </v-data-table>
  </v-card>
</template>

<script>
import CopyLabel from '../common/CopyLabel'
import roleApi from "@/api/RoleApi";
import boardApi from "@/api/BoardApi";
import articleApi from "@/api/ArticleApi";

/*
|---------------------------------------------------------------------
| DEMO Dashboard Card Component
|---------------------------------------------------------------------
|
| Demo card component to be used to gather some ideas on how to build
| your own dashboard component
|
*/
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
        { text: 'No.', align: 'start', value: 'no' },
        {
          text: '제목',
          sortable: false,
          value: 'title',
        },
        {text: '작성자', value: 'writer'},
        { text: '작성일', value: 'createdAt', align: 'center'}
      ],
      params: {
        page:1,
        size:5,
        itemsPerPage:12,
        searchKeyword:null,
        name:this.$options.name
      },
      articles:[],
      // items: [
      //   {
      //     id: '5',
      //     title: '공지사항 테스트 5',
      //     date: '2021-12-10',
      //     priority: 'Low',
      //     status: 'OPEN'
      //   },
      //   {
      //     id: '4',
      //     title: '공지사항 테스트 4',
      //     date: '2021-12-09',
      //     priority: 'Low',
      //     status: 'OPEN'
      //   },
      //   {
      //     id: '3',
      //     title: '공지사항 테스트 3',
      //     date: '2021-12-08',
      //     priority: 'Low',
      //     status: 'OPEN'
      //   },
      //   {
      //     id: '2',
      //     title: '공지사항 테스트 2',
      //     date: '2021-12-07',
      //     priority: 'Low',
      //     status: 'OPEN'
      //   },
      //   {
      //     id: '1',
      //     title: '공지사항 테스트 1',
      //     date: '2021-12-06',
      //     priority: 'Low',
      //     status: 'OPEN'
      //   },
      //   // {
      //   //   id: '424',
      //   //   user: {
      //   //     name: 'Greg Cool J',
      //   //     email: 'cool@caprimooner.com',
      //   //     avatar: '/images/avatars/avatar2.svg'
      //   //   },
      //   //   date: '2020-05-11',
      //   //   priority: 'High',
      //   //   status: 'CLOSED'
      //   // },
      //   // {
      //   //   id: '425',
      //   //   user: {
      //   //     name: 'Samantha Bush',
      //   //     email: 'bush@catloveisstilllove.com',
      //   //     avatar: '/images/avatars/avatar3.svg'
      //   //   },
      //   //   date: '2020-05-11',
      //   //   priority: 'Low',
      //   //   status: 'CLOSED'
      //   // },
      //   // {
      //   //   id: '426',
      //   //   user: {
      //   //     name: 'Ben Howard',
      //   //     email: 'ben@indiecoolers.com',
      //   //     avatar: '/images/avatars/avatar4.svg'
      //   //   },
      //   //   date: '2020-05-12',
      //   //   priority: 'Low',
      //   //   status: 'OPEN'
      //   // },
      //   // {
      //   //   id: '427',
      //   //   user: {
      //   //     name: 'Jack Candy',
      //   //     email: 'jack@candylooove.com',
      //   //     avatar: '/images/avatars/avatar5.svg'
      //   //   },
      //   //   date: '2020-05-13',
      //   //   priority: 'High',
      //   //   status: 'OPEN'
      //   // }
      // ]
    }
  },
  methods: {
    onRowClick(item) {
      this.$router.push({path:`/boards/${item.boardId}/articles/${item.id}`});
    },
    search() {
      articleApi.findAll(1, this.params).then(data => {
        this.totalItems = data.totalElements;
        this.articles = data.content.map((a, i) => {
          a.idx = this.totalItems - i - (( (this.params.page??1) - 1) * this.params.size);
          return a;
        });
      });
    }
  },
  created: function () {
    this.search()
  }
}
</script>
