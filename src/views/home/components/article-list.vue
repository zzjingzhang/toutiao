<template>
  <div class="article-list">
    <van-pull-refresh v-model="isreFreshLoading" @refresh="onRefresh" :success-text="refreshSuccessText" :success-duration="1500">
      <van-list v-model="loading" :error.sync="error" error-text="请求失败，点击重新加载" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <article-item v-for="(article,index) in list" :key="index" :article="article" />
        <!-- <van-cell v-for="(article,index) in list" :key="index" :title="article.title" /> -->
      </van-list>
    </van-pull-refresh>

  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  components: {
    ArticleItem
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      //   请求获取下一页数据的时间戳
      timestamp: null,
      //   控制列表失败的提示状态
      error: false,
      // 控制下拉刷新的loading状态
      isreFreshLoading: false,
      //   下拉刷新成功提示文本
      refreshSuccessText: '刷新成功'
    }
  },
  created() {
    // this.onLoad()
  },
  methods: {
    async onLoad() {
      //  1.请求获取数据
      // 2.把请求结果数据放到list数组中
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id,
          //  timestamp简单理解就是请求数据的页码
          // 请求第一页数据，当前最新时间戳
          // 用于请求之后数据的时间戳会在当前请求结果中返回
          timestamp: this.timestamp || Date.now(),
          with_top: 1
        })
        const { results } = data.data
        // console.log(results)
        this.list.push(...results)
        // 3.本次数据加载结束之后要把加载状态设置为结束
        this.loading = false
        // 4.判断数据是否全部加载完成
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据了，将finised设置为true
          this.finished = true
        }
      } catch (err) {
        console.log('文章列表获取失败', err)
        this.error = true
        this.loading = false
      }
    },
    // 当下拉刷新时，会触发调用该函数
    async onRefresh() {
      //   console.log('ok')
      //   请求获取数据
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: Date.now(),
          with_top: 1
        })

        // 模拟随机失败
        // if (Math.random() > 0.5) {
        //   JSON.parse('dddd')
        // }
        // 将数据追加到列表的顶部
        const { results } = data.data
        this.list.unshift(...results)
        // 关闭下拉刷新的loading状态
        this.isreFreshLoading = false
        // 更新下拉刷新成功提示文本
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
      } catch (err) {
        // console.log('请求失败')
        this.isreFreshLoading = false
        this.refreshSuccessText = '刷新失败'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.article-list {
  height: 79vh;
  overflow-y: auto;
}
</style>

