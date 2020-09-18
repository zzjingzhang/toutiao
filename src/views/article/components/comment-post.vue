<template>
  <div class="comment-post">
    <van-field class="post-field" v-model.trim="message" rows="2" autosize type="textarea" maxlength="50" placeholder="请输入留言" show-word-limit />
    <van-button class="post-btn" @click="onPost" :disabled="!message.length">发布</van-button>
  </div>
</template>

<script>
import { addComment } from '@/api/comment'
export default {
  name: 'CommentPost',
  components: {},
  inject: {
    articleId: {
      type: [Object, Number, String],
      default: null
    }
  },
  props: {
    target: {
      type: [Object, Number, String],
      required: true
    }
  },
  data() {
    return {
      message: ''
    }
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {
    async onPost() {
      this.$toast.loading({
        message: '发布中...',
        // 禁用背景点击
        forbidClick: true,
        // 默认事件是2000毫秒，如果为0 则 持续展示
        duration: 0
      })
      try {
        const { data } = await addComment({
          // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
          target: this.target.toString(),
          content: this.message,
          art_id: this.articleId ? this.articleId.toString() : null
        })
        console.log(data)
        // 关闭弹出层
        // 将发布的内容显示到列表顶部
        // 清空文本框
        this.message = ''
        this.$emit('post-success', data.data)
        this.$toast.success('发布成功')
      } catch (err) {
        this.$toast.fail('发布失败')
        // console.log(err)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>
