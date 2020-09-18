<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button class="search-btn" slot="title" type="info" size="small" round icon="search" to="/search">搜索</van-button>
    </van-nav-bar>

    <!-- 频道列表 -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab v-for="channel in channels" :key="channel.id" :title="channel.name">
        <!-- 文章列表 -->
        <article-list :channel="channel" />
      </van-tab>
      <div slot="nav-right" class="palceholder"></div>
      <div slot="nav-right" class="hamburger-btn" @click="isChannelEditShow=true">
        <i class="iconfont icongengduo"></i>
      </div>
    </van-tabs>

    <!-- 频道编辑弹出层 -->
    <van-popup v-model="isChannelEditShow" closeable position="bottom" close-icon-position="top-left" :style="{ height: '100%' }">
      <channel-edit :my-channels="channels" :active="active" @update-active="onUpdateActive" />
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list.vue'
import ChannelEdit from './components/channel-edit.vue'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    ChannelEdit
  },
  data() {
    return {
      active: 0,
      // 频道列表
      channels: [],
      // 控制编辑频道弹出层是否展示
      isChannelEditShow: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created() {
    this.loadChannels()
  },

  methods: {
    async loadChannels() {
      try {
        // eslint-disable-line no-unused-vars
        let channelss = []
        // 已登录，请求获取用户频道列表
        if (this.user) {
          const { data } = await getUserChannels()
          channelss = data.data.channels
        } else {
          // 未登录，判断是否有本地频道列表数据
          const localChannels = getItem('TOUTIAO_CHANNELS')
          if (localChannels) {
            // 有，拿来使用
            channelss = localChannels
          } else {
            // 没有，请求获取默认频道列表
            const { data } = await getUserChannels()
            channelss = data.data.channels
          }
        }
        this.channels = channelss
      } catch (err) {
        this.$toast('获取频道列表失败')
      }
    },
    onUpdateActive(index, isChannelEditShow = true) {
      // console.log(index)
      this.active = index
      this.isChannelEditShow = isChannelEditShow
    }
  }
}
</script>

<style lang="less" scoped>
@deep: ~'>>>';
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  @{deep}.van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }
  @deep: ~'>>>';
  .channel-tabs {
    @{deep} .van-tabs__wrap {
      height: 82px;
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
    }
    @{deep} .van-tab {
      min-width: 200px;
      border-right: 1px solid #edeff3;
      color: #777;
      font-size: 30px;
    }
    @{deep}.van-tab--active {
      color: #333;
    }
    @{deep} .van-tabs__nav {
      padding-bottom: 0px;
    }
    @{deep} .van-tabs__line {
      bottom: 8px;
      width: 31px;
      height: 6px;
      background-color: #3296fa;
    }
    .palceholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }
    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      background-color: rgba(255, 255, 255, 0.902);
      i.iconfont {
        font-size: 33px;
      }
      @{deep} &:before {
        position: absolute;
        left: 0;
        content: '';
        width: 1px;
        height: 58px;
        background: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }
}
</style>

