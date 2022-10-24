<style scoped>
.v-application a{color:#333}
.v-application .pagination a.on{color: #fff;}
</style>
<template>
  <div class="pagination">
    <a href="javascript:;" class="btn-first pg" :class="{on:currentPage!==1}" @click="goToEdge('first')">처음페이지</a>
    <a href="javascript:;" class="btn-prev pg" :class="{on:currentPageGroup!==1}" @click="goPageGroup('prev',currentPageGroup-1)">이전페이지</a>
    <a href="javascript:;" v-for="index in bottomPage" :key="index" :class="{on:currentPage===index}" @click="goPageGroup(null,index)">
      {{ index }}
    </a>

    <!--<a href="javascript:;" :class="{on:hasPrev}">1</a>-->
    <a href="javascript:;" class="btn-next pg" :class="{on:currentPageGroup != lastPageGroup}" @click="goPageGroup('next',currentPageGroup+1)">다음페이지</a>
    <a href="javascript:;" class="btn-last pg" :class="{on:currentPage!==totalPages && totalPages !== 0}" @click="goToEdge('last')">마지막페이지</a>
  </div>

  <!-- dg-page-navigation (E)-->
</template>
<script>
export default {
  name: 'DgPagination',
  props: {
    value: {
      type:Object,
      default:function(){
        return {
          currentPage: 1,
          pageSize: 10,
          totalPages: 1,

          currentPageGroup: 1,
          pageGroupSize: 10,
        }
      }
    }
  },
  data () {
    return {
      pagingIdx:1,
      hasPrev:true,
      hasNext:true,
    }
  },
  computed: {
    startPage(){
      return (this.currentPageGroup -1) * this.pageGroupSize + 1;
    },
    currentPage(){
      return this.value.currentPage;
    },
    pageGroupSize(){
      return this.value.pageGroupSize;
    },
    totalPages(){
      return this.value.totalPages;
    },
    lastPageGroup(){
      return Math.ceil(this.totalPages/this.pageGroupSize)==0?1:Math.ceil(this.totalPages/this.pageGroupSize);
    },
    currentPageGroup(){
      return Math.ceil(this.currentPage/this.pageGroupSize);
    },
    lastPage(){
      let lastPage = this.currentPageGroup * this.pageGroupSize;
      if(lastPage > this.totalPages){
				lastPage = this.totalPages;
			}
      return lastPage;
    },
    showPrevBtn(){
      // pageGroupSize 설정
      if(this.lastPage>=0 && this.lastPage<=this.pageGroupSize){
        return false;
      } else{
        return this.currentPageGroup > 1;
      }
    },
    showNextBtn(){
      return this.currentPageGroup < this.lastPageGroup;
    },
    bottomPage() {
      let bottom = []
      let lastIdx = this.showNextBtn ? (this.currentPageGroup * this.value.pageGroupSize) : (this.lastPage)
      for (let i = this.startPage; i <= lastIdx; i++) {
        bottom.push(i)
      }
      return bottom
    }
  },
  methods: {
    goPageGroup(event, pageGroup){
      let pagination= this.value;
      let startPage = 1
      if(event!=null){
        if(event=='prev' && this.currentPageGroup == 1){
          return false;
        }else if(event=='next' && this.currentPageGroup == this.lastPageGroup){
          return false;
        }
        startPage = (pageGroup * pagination.pageGroupSize) - pagination.pageGroupSize + 1;
        this.pagingIdx = startPage
      }else{
        startPage = pageGroup + ((startPage-1) * this.value.pageSize)
      }
      pagination.currentPage = startPage;
      this.$emit('pageSelected', pagination);
    },
    goToEdge(val){
      let pagination= this.value;
      let startPage = 1

      if(val=='first'){
        startPage = (1 * pagination.pageGroupSize) - pagination.pageGroupSize + 1;
        this.pagingIdx = startPage
        pagination.currentPage = startPage;
      }else{
        startPage = (this.lastPageGroup * pagination.pageGroupSize) - pagination.pageGroupSize + 1;
        if(this.currentPage==this.totalPages || this.totalPages == 0){
          return false;
        }else {
          this.pagingIdx = startPage;
          pagination.currentPage = this.totalPages
        }
      }

        this.$emit('pageSelected', pagination);

    }
  },
}
</script>
