<template>
  <van-list v-model="loading" :immediate-check="false" :finished="finished" finished-text="已显示全部评论" :error.sync="error" error-text="请求失败，点击重新加载" @load="onLoad">
    <comment-item v-for="(item,index) in list" :key="index" :comment="item" @reply-click="$emit('reply-click',$event)" />
  </van-list>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item'
export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  props: {
    source: {
      type: [Object, Number, String],
      required: true
    },
    list: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      // 自定义Prop数据验证
      validator(value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    }
  },
  data() {
    return {
      // list: [],
      loading: false,
      finished: false,
      //   用来获取下一页数据的标记
      offset: null,
      limit: 10,
      error: false
    }
  },
  created() {
    this.loading = true
    this.onLoad()
  },
  methods: {
    async onLoad() {
      try {
        // 1.请求获取数据
        // 获取文章的评论和获取评论的回复是同一个接口
        // 区别是参数不一样
        // type  a  文章的评论 c  评论的回复
        // source 文章的评论 ，则传递文章的id  ；评论的回复，则传递评论的ID
        const { data } = await getComments({
          // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          type: this.type,
          source: this.source.toString(),
          //   获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          offset: this.offset,
          limit: this.limit
        })
        // 2.将数据添加到列表中
        const { results } = data.data
        this.list.push(...results)
        // console.log(this.list)
        // 把文章评论的总数量传递到外部
        this.$emit('onload-success', data.data)
        // 3.将loading设置为false
        this.loading = false
        // 4.判断是否还有数据
        if (results.length) {
          // 有就更新获取下一页数据页码
          this.offset = data.data.last_id
        } else {
          // 没有就将finished设置结束
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
        // console.log(err)
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
