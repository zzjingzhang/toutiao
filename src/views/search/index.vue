<template>
  <div class="search-container">
    <!-- 顶部搜索栏 -->
    <form class="search-form" action="/">
      <van-search v-model="searchText" show-action background="#2992ff" placeholder="请输入搜索关键词" @search="onSearch" @cancel="onCancel" @focus="isResultShow=false" />
    </form>

    <!-- 搜索结果 -->
    <search-result v-if="isResultShow" :search-text="searchText" />

    <!-- 联想建议 -->
    <search-suggest v-else-if="searchText" :search-text="searchText" @search="onSearch" />
    <!-- 搜索历史记录 -->
    <search-history v-else :search-histories="searchHistories" @clear-search-histories="searchHistories=[]" @search="onSearch" />

  </div>
</template>

<script>
import SearchHistory from './components/search-history'
import SearchSuggest from './components/search-suggest'
import SearchResult from './components/search-result'
import { setItem, getItem } from '@/utils/storage'
export default {
  name: 'SearchIndex',
  components: {
    SearchHistory,
    SearchSuggest,
    SearchResult
  },
  props: {

  },
  data() {
    return {
      searchText: '',
      //   控制搜索结果的展示
      isResultShow: false,
      //   搜索的历史记录
      searchHistories: getItem('TOUTIAO_SEARCH_HISTORIES') || []
    }
  },
  computed: {

  },
  watch: {
    searchHistories(val) {
      // console.log('kl')
      setItem('TOUTIAO_SEARCH_HISTORIES', val)
    }
  },
  created() {

  },
  methods: {
    onSearch(val) {
      //   console.log(val)
      //   更新文本框内容
      this.searchText = val
      //   存储搜索历史记录
      //   要求不要用重复历史记录
      // 最新的排在最前面
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(val)
      //   显示搜索结果
      this.isResultShow = true
    },
    onCancel() {
      //   console.log('取消')
      this.$router.back()
    }
  }

}
</script>
<style lang="less" scoped>
.search-container {
  padding-top: 108px;
  .search-form {
    position: fixed;
    // width: 100%;
    top: 0;
    left: 0;
    right: 0;
    z-index: 5;
  }
  .van-search__action {
    color: #fff;
  }
}
</style>
