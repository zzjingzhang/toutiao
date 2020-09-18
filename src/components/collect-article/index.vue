<template>
  <van-icon color="#777" :loading="loading" :name="isCollected?'star':'star-o'" @click="onCollect" />
</template>

<script>
import { addCollect, deleteCollect } from '@/api/article'
export default {
  name: 'CollectArticle',
  model: {
    prop: 'isCollected'
  },
  props: {
    isCollected: {
      type: Boolean,
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
  created() {

  },
  methods: {
    async onCollect() {
      this.loading = true
      try {
        if (this.isCollected) {
          //   已收藏 取消收藏
          await deleteCollect(this.articleId)
        } else {
          //   未收藏，点击收藏
          await addCollect(this.articleId)
        }
        // 更新视图
        // 自定义事件修改数据并不是立即的
        this.$emit('input', !this.isCollected)
        this.$toast.success(!this.isCollected ? '收藏成功' : '取消收藏')
      } catch (err) {
        this.$toast.fail('操作失败，请重试')
        // console.log(err)
      }
      this.loading = false
    }
  }

}
</script>

<style lang="less" scoped>
.van-icon-star {
  color: #ffa400 !important;
}
</style>

