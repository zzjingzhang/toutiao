<template>
  <div class="search-suggest">
    <van-cell v-for="(suggest,index) in suggestList" :key="index" icon="search" @click="$emit('search',suggest)">
      <div slot="title" v-html="hightLight(suggest)"></div>
      <!-- <van-icon slot="icon" name="search" /> -->
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggest } from '@/api/search'
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggest',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      suggestList: []
    }
  },
  watch: {
    searchText: {
      //   当 searchText 发生改变的时候就会调用 handler 函数
      // handler函数名称是固定的
      //   handler(value) {
      //     // console.log(value)
      //     this.loadSearchSuggest(value)
      //   },

      // 参数1 一个函数
      // 参数2 延迟时间，单位是毫秒
      // 返回值，防抖之后的函数
      handler: debounce(function (value) {
        this.loadSearchSuggest(value)
      }, 100),
      // 该回调将会在侦听开始之后被立即调用
      immediate: true
    }
  },
  methods: {
    async loadSearchSuggest(q) {
      try {
        const { data } = await getSearchSuggest(q)
        // console.log(data)
        this.suggestList = data.data.options
      } catch (err) {
        this.$toast('数据获取失败')
      }
    },
    hightLight(text) {
      const hightLightStr = `<span class="active">this.${this.searchText}</span>`

      // 如果需要根据数据变量动态的创建正则表达式，则手动new RegExp
      // RegExp是正则表达式构造函数
      // 参数1 匹配模式字符串，会根据这个字符串创建正则对象
      // 参数2 匹配模式，要写到字符串中
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, hightLightStr)
    }
  }
}
</script>
<style lang="less" scoped>
.search-suggest {
  /deep/ span.active {
    color: #2e95ff;
  }
}
</style>
