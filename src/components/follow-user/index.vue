<template>

  <van-button v-if="isFollowed" :loading="loading" class="follow-btn" round size="small" @click="onFollow">已关注</van-button>
  <van-button v-else class="follow-btn" :loading="loading" type="info" color="#3296fa" round size="small" icon="plus" @click="onFollow">关注</van-button>

</template>

<script>
import { deleteFollow, addFollow } from '@/api/user'
export default {
  name: 'FollowUser',
  model: {
    prop: 'isFollowed', // 默认是value
    event: 'update_is_followed' // 默认是input
  },
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    async onFollow() {
      this.loading = true
      try {
        if (this.isFollowed) {
          // 已关注，取消关注
          await deleteFollow(this.userId)
          //   this.article.is_followed = false
          //   console.log(data)
        } else {
          // 未关注，添加关注
          await addFollow(this.userId)
          //   this.followLoading = false
          //   this.article.is_followed = true
        }
        // 更新视图状态
        // this.article.is_followed = !this.article.is_followed
        // this.$emit('input', !this.value)
        this.$emit('update_is_followed', !this.isFollowed)
      } catch (err) {
        let message = '操作失败，请重试'
        if (err.response && err.response.status === 400) {
          message = '你不能关注你自己'
        }
        this.$toast(message)
      }
      this.loading = false
    }
  }

}
</script>

<style lang="less" scoped>
</style>
