<template>
  <div class="search-result">
    <van-list v-model="loading" :finished="finished" :error.sync="error" error-text="加载失败，请点击重试" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="(item,index) in list" :key="index" :title="item.title" />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'
export default {
  name: 'SearchResult',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      finished: false,
      list: [],
      page: 1,
      perPage: 20,
      error: false

    }
  },
  created() {

  },
  methods: {
    async onLoad() {
      //   1.请求获取数据
      try {
        const { data } = await getSearchResult({
          page: this.page,
          per_page: this.perPage,
          q: this.searchText
        })
        const { results } = data.data
        // console.log(results)
        // 2.将数据添加到数组列表中
        this.list.push(...results)
        // 3.将本次加载中的loading关闭
        this.loading = false
        //   4.判断是否还有数据
        if (results.length) {
          //  如果有 则更新获取下一个数据的页码
          this.page++
        } else {
          // 如果没有，则将加载状态 finished 设置为结束
          this.finished = true
        }
      } catch (err) {
        //   展示加载失败的提示状态
        this.error = true
        this.loading = false
      }
    }
  }

}
</script>

<style lang="less" scoped>
</style>

