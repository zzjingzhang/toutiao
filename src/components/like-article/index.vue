<template>
  <van-icon color="#777" :name="attitude===1?'good-job':'good-job-o'" :loading="loading" @click="onClick" />
</template>

<script>
import { addLike, deleteLike } from '@/api/article'
export default {
  name: 'LikeArticle',
  model: {
    prop: 'attitude'
  },
  props: {
    attitude: {
      type: Number,
      required: true
    },
    articleId: {
      type: [Number, Object, String],
      required: true
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    async onClick() {
      this.loading = true
      try {
        let status = -1
        if (this.attitude === 1) {
          //   已点赞 取消点赞
          await deleteLike(this.articleId)
        } else {
          //   未点赞，点击点赞
          await addLike(this.articleId)
          status = 1
        }
        // 更新视图
        // 自定义事件修改数据并不是立即的
        this.$emit('input', status)
        this.$toast.success(status === 1 ? '点赞成功' : '取消点赞')
      } catch (err) {
        this.$toast.fail('操作失败，请重试')
        console.log(err)
      }
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
.van-icon-good-job {
  color: #ef7066 !important;
}
</style>
