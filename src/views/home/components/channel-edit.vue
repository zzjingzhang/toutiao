<template>
  <div class="channel-edit">
    <!-- 我的频道 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button type="danger" plain round size="mini" class="edit-btn" @click="isEdit=!isEdit">{{isEdit?'完成':'编辑'}}</van-button>
    </van-cell>
    <van-grid :gutter="10" class="my-grid">
      <van-grid-item class="grid-item" v-for="(channel,index) in myChannels" :key="index" @click="onMyChannelClick(channel,index)">
        <van-icon v-show="isEdit && !fixChannels.includes(channel.id)" slot="icon" name="close"></van-icon>
        <span class="text" slot="text" :class="{active:index===active}">{{channel.name}}</span>
      </van-grid-item>
    </van-grid>

    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid :gutter="10" direction="horizontal" class="recommend-grid">
      <van-grid-item class="grid-item" icon="plus" v-for="(channel,index) in recommendChannels " :key="index" :text="channel.name" @click="onAddChannel(channel)" />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }

  },
  data() {
    return {
      allChannels: [],
      //   控制编辑状态显示
      isEdit: false,
      fixChannels: [0] //  固定频道不允许删除

    }
  },
  created() {
    this.loadAllChannels()
  },
  computed: {
    ...mapState(['user']),
    // recommendChannels() {
    //   const channels = []
    //   this.allChannels.forEach(channel => {
    //     //   find 遍历数组，找到满足条件的元素
    //     const ret = this.myChannels.find(myChannel => {
    //       return myChannel.id === channel.id
    //     })
    //     //   如果我的频道中不包括该频道项，则收集到推荐频道中
    //     if (!ret) {
    //       channels.push(channel)
    //     }
    //   })
    //   //   把计算结果返回
    //   return channels
    // }
    recommendChannels() {
      return this.allChannels.filter(channel => {
        return !this.myChannels.find(myChannel => {
          return myChannel.id === channel.id
        })
      })
    }
  },
  methods: {
    async loadAllChannels() {
      try {
        const { data: res } = await getAllChannels()
        // console.log(res)
        this.allChannels = res.data.channels
        // console.log(this.allChannels)
      } catch (err) {
        this.$toast('数据获取失败')
      }
    },
    async onAddChannel(channel) {
      this.myChannels.push(channel)
      // 数据持久化处理
      if (this.user) {
        // 已登录，把数据请求接口放到线上
        try {
          await addUserChannel({ id: channel.id, seq: this.myChannels.length })
        } catch (err) {
          this.$toast('数据获取失败')
        }
      } else {
        // 未登录，把数据存储到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    onMyChannelClick(channel, index) {
      // 编辑状态，执行删除频道
      if (this.isEdit) {
        // 如果是固定频道，则不删除
        if (this.fixChannels.includes(channel.id)) {
          return
        }
        //   参数1 要删除的元素索引
        // 参数2  删除的个数，如果不指定，则从参数1开始一直删到最后
        this.myChannels.splice(index, 1)
        // 如果要删除激活频道之前的频道，则更新激活的频道选项
        if (index <= this.active) {
          //  让激活频道的索引-1
          this.$emit('update-active', this.active - 1, true)
        }
        // 处理持久化
        this.deleteChannel(channel.id)
      } else {
        // 非编辑状态，执行切换频道
        this.$emit('update-active', index, false)
      }
    },
    async deleteChannel(id) {
      if (this.user) {
        try {
          //   已登录。将数据更新到线上
          await deleteUserChannel(id)
        } catch (err) {
          this.$toast('删除失败')
        }
      } else {
        //   未登录，将数据更新到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
    }
  }
  /deep/.my-grid {
    .grid-item {
      .van-grid-item__icon-wrapper {
        position: static;
        .van-icon-close {
          position: absolute;
          right: -5px;
          top: -5px;
          font-size: 20px;
          z-index: 3;
        }
      }
    }
  }
  /deep/.recommend-grid {
    .grid-item {
      .van-icon-plus {
        font-size: 28px;
        margin-right: 6px;
      }
    }
  }
}
</style>

