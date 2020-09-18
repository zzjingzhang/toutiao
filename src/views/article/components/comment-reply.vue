<template>
  <div class="comment-reply">
    <van-nav-bar :title="comment.reply_count>0?`${comment.reply_count}条回复`:'暂无回复'">
      <van-icon slot="left" name="cross" @click="$emit('close')" />
    </van-nav-bar>
    <div class="scroll-wrap">
      <!-- 当前评论项 -->
      <comment-item :comment="comment" />
      <!-- 评论的回复列表 -->
      <van-cell title="全部回复" />
      <comment-list :list="commentList" :source="comment.com_id" type="c" />
    </div>
    <!-- 发布评论 -->
    <div class="post-wrap">
      <van-button class="post-btn" size="small" round @click="isPostShow=true">写评论</van-button>
    </div>

    <van-popup v-model="isPostShow" position="bottom">
      <comment-post :target="comment.com_id" @post-success="onPostSuccess" />
    </van-popup>
  </div>
</template>

<script>
import CommentItem from './comment-item'
import CommentList from './comment-list'
import CommentPost from './comment-post'
export default {
  name: 'CommentReply',
  components: {
    CommentItem,
    CommentList,
    CommentPost
  },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isPostShow: false,
      commentList: []
    }
  },
  methods: {
    onPostSuccess(data) {
      // 更新回复的数量
      this.comment.reply_count++
      // 关闭弹出层
      this.isPostShow = false
      // 将发布的内容显示到列表顶部
      this.commentList.unshift(data.new_obj)
    }
  }
}
</script>

<style lang="less" scoped>
.scroll-wrap {
  position: fixed;
  top: 92px;
  left: 0;
  right: 0;
  bottom: 90px;
  overflow-y: auto;
}
.post-wrap {
  height: 88px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-top: 1px solid #d8d8d8;
  .post-btn {
    width: 60%;
  }
}
</style>
